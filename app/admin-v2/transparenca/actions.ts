"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ensureV2TransparencyTables } from "@/lib/v2-transparency";
import { isV2Admin } from "@/lib/v2-auth";

async function guard() {
  if (!(await isV2Admin())) redirect("/admin-v2");
  if (!process.env.DATABASE_URL) redirect("/admin-v2/transparenca?error=database");
  await ensureV2TransparencyTables();
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function nullable(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || null;
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function nullableNumber(formData: FormData, key: string) {
  const value = text(formData, key).replace(",", ".");
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/transparenca");
  revalidatePath("/dokumentet");
  revalidatePath("/donacionet");
  revalidatePath("/admin-v2/transparenca");
}

export async function saveTransparencySettings(formData: FormData) {
  await guard();

  const associationName = text(formData, "associationName") || "Shoqata Rainca";
  const officialEmail = text(formData, "officialEmail") || "info@shoqata-rainca.ch";
  const domain = text(formData, "domain") || "shoqata-rainca.ch";
  const membershipFee = nullableNumber(formData, "membershipFee") ?? 100;
  const currency = text(formData, "currency") || "CHF";

  await prisma.$executeRawUnsafe(
    `update v2_settings
     set association_name=$1, official_email=$2, domain=$3, membership_fee=$4,
         currency=$5, iban=$6, bank_name=$7, bic=$8, qr_url=$9,
         facebook_url=$10, germany_payment_note=$11, donation_note=$12,
         updated_at=now()
     where id='main'`,
    associationName,
    officialEmail,
    domain,
    membershipFee,
    currency,
    nullable(formData, "iban"),
    nullable(formData, "bankName"),
    nullable(formData, "bic"),
    nullable(formData, "qrUrl"),
    nullable(formData, "facebookUrl"),
    nullable(formData, "germanyPaymentNote"),
    nullable(formData, "donationNote")
  );

  refresh();
  redirect("/admin-v2/transparenca?settingsSaved=1");
}

export async function createFinancialReport(formData: FormData) {
  await guard();
  const year = Number(text(formData, "year"));
  const title = text(formData, "title");
  if (!Number.isInteger(year) || !title) redirect("/admin-v2/transparenca?error=report");

  await prisma.$executeRawUnsafe(
    `insert into v2_financial_reports
      (id, year, title, income, expenses, note, pdf_url, published)
     values ($1,$2,$3,$4,$5,$6,$7,$8)`,
    randomUUID(),
    year,
    title,
    nullableNumber(formData, "income"),
    nullableNumber(formData, "expenses"),
    nullable(formData, "note"),
    nullable(formData, "pdfUrl"),
    bool(formData, "published")
  );

  refresh();
  redirect("/admin-v2/transparenca?reportCreated=1");
}

export async function updateFinancialReport(formData: FormData) {
  await guard();
  const id = text(formData, "id");
  const year = Number(text(formData, "year"));
  const title = text(formData, "title");
  if (!id || !Number.isInteger(year) || !title) redirect("/admin-v2/transparenca?error=report");

  await prisma.$executeRawUnsafe(
    `update v2_financial_reports
     set year=$2, title=$3, income=$4, expenses=$5, note=$6,
         pdf_url=$7, published=$8, updated_at=now()
     where id=$1`,
    id,
    year,
    title,
    nullableNumber(formData, "income"),
    nullableNumber(formData, "expenses"),
    nullable(formData, "note"),
    nullable(formData, "pdfUrl"),
    bool(formData, "published")
  );

  refresh();
  redirect("/admin-v2/transparenca?reportSaved=1");
}

export async function deleteFinancialReport(formData: FormData) {
  await guard();
  const id = text(formData, "id");
  if (id) await prisma.$executeRawUnsafe("delete from v2_financial_reports where id=$1", id);
  refresh();
  redirect("/admin-v2/transparenca?reportDeleted=1");
}

export async function createDocumentV2(formData: FormData) {
  await guard();
  const title = text(formData, "title");
  const category = text(formData, "category");
  const fileUrl = text(formData, "fileUrl");
  const yearRaw = text(formData, "year");
  const year = yearRaw ? Number(yearRaw) : null;
  if (!title || !category || !fileUrl || (year !== null && !Number.isInteger(year))) {
    redirect("/admin-v2/transparenca?error=document");
  }

  await prisma.$executeRawUnsafe(
    `insert into v2_documents
      (id, title, category, year, description, file_url, published)
     values ($1,$2,$3,$4,$5,$6,$7)`,
    randomUUID(),
    title,
    category,
    year,
    nullable(formData, "description"),
    fileUrl,
    bool(formData, "published")
  );

  refresh();
  redirect("/admin-v2/transparenca?documentCreated=1");
}

export async function updateDocumentV2(formData: FormData) {
  await guard();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const category = text(formData, "category");
  const fileUrl = text(formData, "fileUrl");
  const yearRaw = text(formData, "year");
  const year = yearRaw ? Number(yearRaw) : null;
  if (!id || !title || !category || !fileUrl || (year !== null && !Number.isInteger(year))) {
    redirect("/admin-v2/transparenca?error=document");
  }

  await prisma.$executeRawUnsafe(
    `update v2_documents
     set title=$2, category=$3, year=$4, description=$5,
         file_url=$6, published=$7, updated_at=now()
     where id=$1`,
    id,
    title,
    category,
    year,
    nullable(formData, "description"),
    fileUrl,
    bool(formData, "published")
  );

  refresh();
  redirect("/admin-v2/transparenca?documentSaved=1");
}

export async function deleteDocumentV2(formData: FormData) {
  await guard();
  const id = text(formData, "id");
  if (id) await prisma.$executeRawUnsafe("delete from v2_documents where id=$1", id);
  refresh();
  redirect("/admin-v2/transparenca?documentDeleted=1");
}

export async function createDonationV2(formData: FormData) {
  await guard();
  const donationDate = text(formData, "donationDate");
  const amount = nullableNumber(formData, "amount");
  const purpose = text(formData, "purpose");
  const currency = text(formData, "currency") || "CHF";

  if (!donationDate || amount === null || amount < 0 || !purpose) {
    redirect("/admin-v2/transparenca?error=donation");
  }

  await prisma.$executeRawUnsafe(
    `insert into v2_donations
      (id, donation_date, amount, currency, purpose, note, published)
     values ($1,$2::date,$3,$4,$5,$6,$7)`,
    randomUUID(),
    donationDate,
    amount,
    currency,
    purpose,
    nullable(formData, "note"),
    bool(formData, "published")
  );

  refresh();
  redirect("/admin-v2/transparenca?donationCreated=1");
}

export async function updateDonationV2(formData: FormData) {
  await guard();
  const id = text(formData, "id");
  const donationDate = text(formData, "donationDate");
  const amount = nullableNumber(formData, "amount");
  const purpose = text(formData, "purpose");
  const currency = text(formData, "currency") || "CHF";

  if (!id || !donationDate || amount === null || amount < 0 || !purpose) {
    redirect("/admin-v2/transparenca?error=donation");
  }

  await prisma.$executeRawUnsafe(
    `update v2_donations
     set donation_date=$2::date, amount=$3, currency=$4, purpose=$5,
         note=$6, published=$7
     where id=$1`,
    id,
    donationDate,
    amount,
    currency,
    purpose,
    nullable(formData, "note"),
    bool(formData, "published")
  );

  refresh();
  redirect("/admin-v2/transparenca?donationSaved=1");
}

export async function deleteDonationV2(formData: FormData) {
  await guard();
  const id = text(formData, "id");
  if (id) await prisma.$executeRawUnsafe("delete from v2_donations where id=$1", id);
  refresh();
  redirect("/admin-v2/transparenca?donationDeleted=1");
}
