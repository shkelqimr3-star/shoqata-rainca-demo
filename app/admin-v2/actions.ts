"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { PaymentYear } from "@/data/member-records";
import { prisma } from "@/lib/prisma";
import { getV2Members } from "@/lib/v2-members";
import { checkV2Password, clearV2AdminSession, isV2Admin, setV2AdminSession } from "@/lib/v2-auth";

async function requireAdmin() {
  if (!(await isV2Admin())) redirect("/admin-v2?error=session");
  if (!process.env.DATABASE_URL) redirect("/admin-v2?error=database");
}

function clean(value: FormDataEntryValue | null) {
  return String(value || "").trim();
}

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
  await requireAdmin();

  const sourceIndex = Number(formData.get("sourceIndex"));
  const year = String(formData.get("year") || "") as PaymentYear;
  const amount = Number(String(formData.get("amount") || "0").replace(",", "."));
  const method = String(formData.get("method") || "bank").trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || "bank";

  if (!Number.isInteger(sourceIndex) || !["2023","2024","2025","2026"].includes(year) || !Number.isFinite(amount) || amount < 0) {
    redirect("/admin-v2?error=validation");
  }

  const { members } = await getV2Members();
  const member = members.find((item) => item.sourceIndex === sourceIndex && !item.archived);
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
  revalidatePath("/admin-v2/antaret");
  redirect("/admin-v2?saved=1");
}

export async function deletePaymentOverride(formData: FormData) {
  await requireAdmin();
  const id = clean(formData.get("id"));
  const row = id ? await prisma.member.findUnique({ where: { id } }) : null;
  if (!row?.notes?.startsWith("V2_OVERRIDE:")) redirect("/admin-v2?error=payment");

  await prisma.member.delete({ where: { id } });
  revalidatePath("/antaret");
  revalidatePath("/admin-v2");
  revalidatePath("/admin-v2/antaret");
  redirect("/admin-v2?reverted=1");
}

export async function createV2Member(formData: FormData) {
  await requireAdmin();
  const firstName = clean(formData.get("firstName"));
  const lastName = clean(formData.get("lastName"));
  const neighborhood = clean(formData.get("neighborhood")) || null;
  if (!firstName || !lastName) redirect("/admin-v2/antaret?error=name");

  const { members } = await getV2Members();
  const sourceNo = members.reduce((max, member) => Math.max(max, member.sourceNo), 0) + 1;
  let sourceIndex = Date.now();
  while (members.some((member) => member.sourceIndex === sourceIndex)) sourceIndex += 1;

  await prisma.member.create({
    data: {
      name: firstName,
      surname: lastName,
      city: neighborhood,
      notes: `V2_PROFILE:${sourceIndex}:${sourceNo}:NEW`,
      status: "APPROVED",
      isPublic: false,
      publicVisibleAmount: false
    }
  });

  revalidatePath("/antaret");
  revalidatePath("/admin-v2");
  revalidatePath("/admin-v2/antaret");
  redirect("/admin-v2/antaret?created=1");
}

export async function updateV2MemberProfile(formData: FormData) {
  await requireAdmin();

  const sourceIndex = Number(formData.get("sourceIndex"));
  const sourceNo = Number(formData.get("sourceNo"));
  const firstName = clean(formData.get("firstName"));
  const lastName = clean(formData.get("lastName"));
  const neighborhood = clean(formData.get("neighborhood")) || null;
  const archived = clean(formData.get("status")) === "ARCHIVED";

  const { members } = await getV2Members();
  const member = members.find((item) => item.sourceIndex === sourceIndex);
  if (!member || !firstName || !lastName || !Number.isInteger(sourceNo)) redirect("/admin-v2/antaret?error=member");

  const kind = member.isNew ? "NEW" : "BASE";
  const prefix = `V2_PROFILE:${sourceIndex}:`;
  const existing = await prisma.member.findFirst({
    where: { notes: { startsWith: prefix } },
    orderBy: { updatedAt: "desc" }
  });

  const data = {
    name: firstName,
    surname: lastName,
    city: neighborhood,
    notes: `V2_PROFILE:${sourceIndex}:${sourceNo}:${kind}`,
    status: archived ? "ARCHIVED" as const : "APPROVED" as const,
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
  revalidatePath("/admin-v2/antaret");
  redirect("/admin-v2/antaret?saved=1");
}
