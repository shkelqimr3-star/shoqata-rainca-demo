"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function submitMembershipApplication(formData: FormData) {
  const fullName = String(formData.get("fullName") || "").trim();
  const email = String(formData.get("email") || "").trim();

  if (fullName && email && process.env.DATABASE_URL) {
    await prisma.membershipApplication.create({
      data: {
        fullName,
        email,
        phone: String(formData.get("phone") || "").trim(),
        city: String(formData.get("city") || "").trim(),
        country: String(formData.get("country") || "").trim(),
        message: String(formData.get("message") || "").trim()
      }
    });
  }

  redirect("/behu-anetar?saved=1");
}
