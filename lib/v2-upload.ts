import { prisma } from "@/lib/prisma";

export async function ensureV2UploadTable() {
  if (!process.env.DATABASE_URL) return false;

  await prisma.$executeRawUnsafe(`
    create table if not exists v2_uploads (
      id text primary key,
      filename text not null,
      mime_type text not null,
      file_bytes bytea not null,
      file_size integer not null,
      created_at timestamptz not null default now()
    )
  `);

  return true;
}
