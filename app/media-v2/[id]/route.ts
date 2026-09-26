import { prisma } from "@/lib/prisma";
import { ensureV2UploadTable } from "@/lib/v2-upload";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!(await ensureV2UploadTable())) return new Response("Not found", { status: 404 });

  const rows = await prisma.$queryRawUnsafe<Array<{
    filename: string;
    mimeType: string;
    bytes: Uint8Array;
  }>>(
    `select filename, mime_type as "mimeType", file_bytes as bytes
     from v2_uploads
     where id=$1
     limit 1`,
    id
  );

  const file = rows[0];
  if (!file) return new Response("Not found", { status: 404 });

  const safeName = file.filename.replace(/[\r\n"]/g, "_");
  return new Response(file.bytes as BodyInit, {
    headers: {
      "Content-Type": file.mimeType,
      "Content-Disposition": `inline; filename="${safeName}"`,
      "Cache-Control": "public, max-age=31536000, immutable"
    }
  });
}
