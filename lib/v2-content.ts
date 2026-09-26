import { prisma } from "@/lib/prisma";

export type V2Event = {
  id: string;
  title: string;
  description: string;
  details: string | null;
  location: string;
  startsAt: Date;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type V2Project = {
  id: string;
  title: string;
  summary: string;
  category: string;
  status: string;
  year: number;
  budget: string | null;
  imageUrl: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export async function ensureV2ContentTables() {
  if (!process.env.DATABASE_URL) return false;

  await prisma.$executeRawUnsafe(`
    create table if not exists v2_meta (
      key text primary key,
      value text not null,
      updated_at timestamptz not null default now()
    )
  `);

  await prisma.$executeRawUnsafe(`
    create table if not exists v2_events (
      id text primary key,
      title text not null,
      description text not null,
      details text,
      location text not null,
      starts_at timestamptz not null,
      image_url text,
      published boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await prisma.$executeRawUnsafe(`
    create table if not exists v2_projects (
      id text primary key,
      title text not null,
      summary text not null,
      category text not null,
      status text not null,
      year integer not null,
      budget numeric(12,2),
      image_url text,
      published boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  const seeded = await prisma.$queryRaw<Array<{ key: string }>>`
    insert into v2_meta(key, value)
    values ('core_seed_v1', '1')
    on conflict (key) do nothing
    returning key
  `;

  if (seeded.length > 0) {
    await prisma.$executeRawUnsafe(
      `insert into v2_events
        (id, title, description, details, location, starts_at, published)
       values
        ($1,$2,$3,$4,$5,$6,true)`,
      "event-2026-11-07",
      "Shoqata Rainca feston Ditën e Flamurit",
      "Mbrëmje festive me Agimi Band, darkë dhe dessert. Rezervimi bëhet përmes kontakteve të publikuara nga Shoqata.",
      "Të rriturit 20 CHF · 10–16 vjeç 10 CHF · nën 10 vjeç falas · rezervimi deri më 02.11.2026.",
      "Sternensaal Wangs, Dorfstrasse 10, 7323 Wangs",
      new Date("2026-11-07T17:00:00.000Z")
    );

    await prisma.$executeRawUnsafe(
      `insert into v2_projects
        (id, title, summary, category, status, year, published)
       values
        ($1,$2,$3,$4,$5,$6,true),
        ($7,$8,$9,$10,$11,$12,true),
        ($13,$14,$15,$16,$17,$18,true)`,
      "project-maintenance-2026",
      "Mirëmbajtja e fshatit",
      "Pastrim, kositje dhe mirëmbajtje e hapësirave publike të Raincës, të organizuara dhe të mbështetura nga Shoqata.",
      "Komunitet",
      "Në vazhdim",
      2026,
      "project-kindergarten-2026",
      "Mbështetje për çerdhen",
      "Mbështetje për çerdhen me pajisje klime për kushte më të mira gjatë temperaturave të larta.",
      "Arsim",
      "Përfunduar",
      2026,
      "project-tournament-2026",
      "Turneu i Diasporës “Berat Mahmuti” 2026",
      "Aktivitet sportiv i organizuar nga KF Rainca dhe Forumi Rinor Raincë, i zhvilluar më 24–26 korrik 2026.",
      "Rini & Sport",
      "Përfunduar",
      2026
    );
  }

  return true;
}

export async function getV2Events(includeUnpublished = false) {
  const ready = await ensureV2ContentTables();
  if (!ready) return [] as V2Event[];

  const rows = await prisma.$queryRaw<Array<{
    id: string;
    title: string;
    description: string;
    details: string | null;
    location: string;
    startsAt: Date;
    imageUrl: string | null;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>>`
    select
      id,
      title,
      description,
      details,
      location,
      starts_at as "startsAt",
      image_url as "imageUrl",
      published,
      created_at as "createdAt",
      updated_at as "updatedAt"
    from v2_events
    where (${includeUnpublished} = true or published = true)
    order by starts_at asc
  `;

  return rows;
}

export async function getV2Projects(includeUnpublished = false) {
  const ready = await ensureV2ContentTables();
  if (!ready) return [] as V2Project[];

  const rows = await prisma.$queryRaw<Array<{
    id: string;
    title: string;
    summary: string;
    category: string;
    status: string;
    year: number;
    budget: string | null;
    imageUrl: string | null;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>>`
    select
      id,
      title,
      summary,
      category,
      status,
      year,
      budget::text as budget,
      image_url as "imageUrl",
      published,
      created_at as "createdAt",
      updated_at as "updatedAt"
    from v2_projects
    where (${includeUnpublished} = true or published = true)
    order by year desc, created_at desc
  `;

  return rows;
}

export function formatEventDate(date: Date) {
  return new Intl.DateTimeFormat("sq-AL", {
    timeZone: "Europe/Zurich",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

export function formatEventTime(date: Date) {
  return new Intl.DateTimeFormat("sq-AL", {
    timeZone: "Europe/Zurich",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}
