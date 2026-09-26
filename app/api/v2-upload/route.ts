import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { isV2Admin } from "@/lib/v2-auth";
import { prisma } from "@/lib/prisma";
import { ensureV2UploadTable } from "@/lib/v2-upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

export async function POST(request: Request) {
  if (!(await isV2Admin())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  if (!(await ensureV2UploadTable())) {
    return NextResponse.json({ error: "database" }, { status: 503 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "file" }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "type" }, { status: 400 });
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "size", maxBytes: MAX_BYTES }, { status: 413 });
  }

  const id = randomUUID();
  const bytes = Buffer.from(await file.arrayBuffer());

  await prisma.$executeRawUnsafe(
    `insert into v2_uploads(id, filename, mime_type, file_bytes, file_size)
     values ($1,$2,$3,$4,$5)`,
    id,
    file.name,
    file.type,
    bytes,
    file.size
  );

  return NextResponse.json({
    ok: true,
    id,
    url: `/media-v2/${id}`,
    filename: file.name,
    mimeType: file.type,
    size: file.size
  });
}
