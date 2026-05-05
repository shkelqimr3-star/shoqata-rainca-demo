import { randomBytes } from "crypto";
import path from "path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"]
]);

function safeBaseName(name: string) {
  const parsed = path.parse(name);
  return parsed.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "image";
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return new NextResponse("Blob storage is not configured", { status: 500 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return new NextResponse("No image selected", { status: 400 });
  }

  const extension = allowedTypes.get(file.type);
  if (!extension) {
    return new NextResponse("Only jpg, jpeg, png, and webp images are allowed", { status: 400 });
  }

  const fileName = `${safeBaseName(file.name)}-${randomBytes(5).toString("hex")}${extension}`;
  const blob = await put(`rainca/${fileName}`, file, {
    access: "public",
    contentType: file.type,
    token: process.env.BLOB_READ_WRITE_TOKEN
  });

  return NextResponse.json({ url: blob.url });
}
