import { prisma } from "@/lib/prisma";

export type V2GalleryItem = {
  id: string;
  title: string;
  caption: string | null;
  eventLabel: string | null;
  year: number;
  mediaType: string;
  mediaUrl: string;
  published: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export async function ensureV2GalleryTable() {
  if (!process.env.DATABASE_URL) return false;

  await prisma.$executeRawUnsafe(`
    create table if not exists v2_gallery (
      id text primary key,
      title text not null,
      caption text,
      event_label text,
      year integer not null,
      media_type text not null default 'image',
      media_url text not null,
      published boolean not null default true,
      sort_order integer not null default 0,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  return true;
}

export async function getV2Gallery(includeUnpublished = false) {
  const ready = await ensureV2GalleryTable();
  if (!ready) return [] as V2GalleryItem[];

  return prisma.$queryRaw<Array<V2GalleryItem>>`
    select
      id,
      title,
      caption,
      event_label as "eventLabel",
      year,
      media_type as "mediaType",
      media_url as "mediaUrl",
      published,
      sort_order as "sortOrder",
      created_at as "createdAt",
      updated_at as "updatedAt"
    from v2_gallery
    where (${includeUnpublished} = true or published = true)
    order by year desc, sort_order asc, created_at desc
  `;
}
