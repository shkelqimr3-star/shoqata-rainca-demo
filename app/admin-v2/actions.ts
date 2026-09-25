"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { memberRecords, type PaymentYear } from "@/data/member-records";
import { prisma } from "@/lib/prisma";
import { checkV2Password, clearV2AdminSession, isV2Admin, setV2AdminSession } from "@/lib/v2-auth";

export async function loginV2(formData: FormData) {
  const password = String(formData.get("password") || "");
  if (!checkV2Password(password)) redirect("/admin-v2?error=1");
  await setV2AdminSession();
  redirect("/admin-v2");
}

export async function logoutV2() {
  await clearV2AdminSession();
  redirect("/admin-v2");
}

export async function savePaymentOverride(formData: FormData) {
  if (!(await isV2Admin())) redirect("/admin-v2?error=session");
  if (!process.env.DATABASE_URL) redirect("/admin-v2?error=database");

  const sourceIndex = Number(formData.get("sourceIndex"));
  const year = String(formData.get("year") || "") as PaymentYear;
  const amount = Number(String(formData.get("amount") || "0").replace(",", "."));
  const method = String(formData.get("method") || "bank").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || "bank";

  if (!Number.isInteger(sourceIndex) || !["2023","2024","2025","2026"].includes(year) || !Number.isFinite(amount) || amount < 0) {
    redirect("/admin-v2?error=validation");
  }

  const member = memberRecords.find((item) => item.sourceIndex === sourceIndex);
  if (!member) redirect("/admin-v2?error=member");

  const prefix = `V2_OVERRIDE:${sourceIndex}:${year}:`;
  const existing = await prisma.member.findFirst({
    where: { notes: { startsWith: prefix } },
    orderBy: { updatedAt: "desc" }
  });

  const data = {
    name: member.firstName,
    surname: member.lastName,
    year: Number(year),
    amountPaid: String(amount),
    currency: "CHF",
    paymentStatus: amount > 0 ? "PAID" : "UNPAID",
    notes: `${prefix}${method}`,
    status: "APPROVED" as const,
    isPublic: false,
    publicVisibleAmount: false
  };

  if (existing) {
    await prisma.member.update({ where: { id: existing.id }, data });
  } else {
    await prisma.member.create({ data });
  }

  revalidatePath("/antaret");
  revalidatePath("/admin-v2");
  redirect("/admin-v2?saved=1");
}
