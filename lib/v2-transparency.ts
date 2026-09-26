import { prisma } from "@/lib/prisma";

export type V2TransparencySettings = {
  associationName: string;
  officialEmail: string;
  domain: string;
  membershipFee: string;
  currency: string;
  iban: string | null;
  bankName: string | null;
  bic: string | null;
  qrUrl: string | null;
  facebookUrl: string | null;
  germanyPaymentNote: string | null;
  donationNote: string | null;
};

export type V2FinancialReport = {
  id: string;
  year: number;
  title: string;
  income: string | null;
  expenses: string | null;
  note: string | null;
  pdfUrl: string | null;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type V2Document = {
  id: string;
  title: string;
  category: string;
  year: number | null;
  description: string | null;
  fileUrl: string;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type V2Donation = {
  id: string;
  donationDate: string;
  amount: string;
  currency: string;
  purpose: string;
  note: string | null;
  published: boolean;
  createdAt: Date;
};

export async function ensureV2TransparencyTables() {
  if (!process.env.DATABASE_URL) return false;

  await prisma.$executeRawUnsafe(`
    create table if not exists v2_settings (
      id text primary key,
      association_name text not null,
      official_email text not null,
      domain text not null,
      membership_fee numeric(12,2) not null default 100,
      currency text not null default 'CHF',
      iban text,
      bank_name text,
      bic text,
      qr_url text,
      facebook_url text,
      germany_payment_note text,
      donation_note text,
      updated_at timestamptz not null default now()
    )
  `);

  await prisma.$executeRawUnsafe(`
    create table if not exists v2_financial_reports (
      id text primary key,
      year integer not null,
      title text not null,
      income numeric(12,2),
      expenses numeric(12,2),
      note text,
      pdf_url text,
      published boolean not null default false,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await prisma.$executeRawUnsafe(`
    create table if not exists v2_documents (
      id text primary key,
      title text not null,
      category text not null,
      year integer,
      description text,
      file_url text not null,
      published boolean not null default true,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now()
    )
  `);

  await prisma.$executeRawUnsafe(`
    create table if not exists v2_donations (
      id text primary key,
      donation_date date not null,
      amount numeric(12,2) not null,
      currency text not null default 'CHF',
      purpose text not null,
      note text,
      published boolean not null default false,
      created_at timestamptz not null default now()
    )
  `);

  const old = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } }).catch(() => null);

  await prisma.$executeRawUnsafe(
    `insert into v2_settings
      (id, association_name, official_email, domain, membership_fee, currency, iban, bank_name, qr_url, facebook_url)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
     on conflict (id) do nothing`,
    "main",
    old?.associationName || "Shoqata Rainca",
    old?.officialEmail || "info@shoqata-rainca.ch",
    old?.domain || "shoqata-rainca.ch",
    100,
    "CHF",
    old?.iban || null,
    old?.bankName || null,
    old?.qrImageUrl || null,
    "https://www.facebook.com/shoqatarainca"
  );

  return true;
}

export async function getV2TransparencySettings(): Promise<V2TransparencySettings> {
  const ready = await ensureV2TransparencyTables();
  if (!ready) {
    return {
      associationName: "Shoqata Rainca",
      officialEmail: "info@shoqata-rainca.ch",
      domain: "shoqata-rainca.ch",
      membershipFee: "100",
      currency: "CHF",
      iban: null,
      bankName: null,
      bic: null,
      qrUrl: null,
      facebookUrl: "https://www.facebook.com/shoqatarainca",
      germanyPaymentNote: null,
      donationNote: null
    };
  }

  const rows = await prisma.$queryRaw<Array<{
    associationName: string;
    officialEmail: string;
    domain: string;
    membershipFee: string;
    currency: string;
    iban: string | null;
    bankName: string | null;
    bic: string | null;
    qrUrl: string | null;
    facebookUrl: string | null;
    germanyPaymentNote: string | null;
    donationNote: string | null;
  }>>`
    select
      association_name as "associationName",
      official_email as "officialEmail",
      domain,
      membership_fee::text as "membershipFee",
      currency,
      iban,
      bank_name as "bankName",
      bic,
      qr_url as "qrUrl",
      facebook_url as "facebookUrl",
      germany_payment_note as "germanyPaymentNote",
      donation_note as "donationNote"
    from v2_settings
    where id = 'main'
    limit 1
  `;

  return rows[0];
}

export async function getV2FinancialReports(includeUnpublished = false) {
  const ready = await ensureV2TransparencyTables();
  if (!ready) return [] as V2FinancialReport[];

  return prisma.$queryRaw<Array<V2FinancialReport>>`
    select
      id,
      year,
      title,
      income::text as income,
      expenses::text as expenses,
      note,
      pdf_url as "pdfUrl",
      published,
      created_at as "createdAt",
      updated_at as "updatedAt"
    from v2_financial_reports
    where (${includeUnpublished} = true or published = true)
    order by year desc, created_at desc
  `;
}

export async function getV2Documents(includeUnpublished = false) {
  const ready = await ensureV2TransparencyTables();
  if (!ready) return [] as V2Document[];

  return prisma.$queryRaw<Array<V2Document>>`
    select
      id,
      title,
      category,
      year,
      description,
      file_url as "fileUrl",
      published,
      created_at as "createdAt",
      updated_at as "updatedAt"
    from v2_documents
    where (${includeUnpublished} = true or published = true)
    order by category asc, year desc nulls last, created_at desc
  `;
}

export async function getV2Donations(includeUnpublished = false) {
  const ready = await ensureV2TransparencyTables();
  if (!ready) return [] as V2Donation[];

  return prisma.$queryRaw<Array<V2Donation>>`
    select
      id,
      donation_date::text as "donationDate",
      amount::text as amount,
      currency,
      purpose,
      note,
      published,
      created_at as "createdAt"
    from v2_donations
    where (${includeUnpublished} = true or published = true)
    order by donation_date desc, created_at desc
  `;
}

export function formatMoney(value: string | null, currency = "CHF") {
  if (value === null) return "—";
  const number = Number(value);
  if (!Number.isFinite(number)) return value;
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(number);
}

export function formatPublicDate(value: string) {
  const date = new Date(`${value}T12:00:00Z`);
  return new Intl.DateTimeFormat("sq-AL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Zurich"
  }).format(date);
}
