import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const fullName = text(formData, "fullName");
  const email = text(formData, "email");

  if (process.env.DATABASE_URL && fullName && email) {
    await prisma.membershipApplication.create({
      data: {
        fullName,
        email,
        phone: text(formData, "phone"),
        city: text(formData, "city"),
        country: text(formData, "country"),
        message: text(formData, "message")
      }
    });
  }

  return NextResponse.redirect(new URL("/behu-anetar?saved=1", request.url), 303);
}
