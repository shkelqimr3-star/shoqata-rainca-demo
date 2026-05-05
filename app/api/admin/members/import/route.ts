import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type ImportRow = {
  firstName?: unknown;
  lastName?: unknown;
  city?: unknown;
  country?: unknown;
  year?: unknown;
  status?: unknown;
  paidAmount?: unknown;
  currency?: unknown;
  paymentStatus?: unknown;
  isPublic?: unknown;
  showAmountPublicly?: unknown;
  privateNotes?: unknown;
};

function text(value: unknown) {
  return String(value ?? "").trim();
}

function parseAmount(value: unknown) {
  const raw = text(value).replace(",", ".");
  if (!raw) return null;
  const number = Number(raw);
  return Number.isFinite(number) ? raw : null;
}

function asBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  return ["true", "1", "yes", "y", "po", "ja"].includes(text(value).toLowerCase());
}

function validateRows(rows: ImportRow[]) {
  const errors: string[] = [];
  const valid = rows.map((row, index) => {
    const rowNumber = index + 1;
    const name = text(row.firstName);
    const surname = text(row.lastName);
    const year = Number(row.year);
    const amountPaid = parseAmount(row.paidAmount);
    const amountNumber = amountPaid ? Number(amountPaid) : 0;
    const status = (text(row.status) || "APPROVED").toUpperCase();
    const paymentStatus = (text(row.paymentStatus) || (amountNumber > 0 ? "PAID" : "UNPAID")).toUpperCase();

    if (!name) errors.push(`Row ${rowNumber}: firstName is required.`);
    if (!surname) errors.push(`Row ${rowNumber}: lastName is required.`);
    if (!Number.isInteger(year) || year < 2010 || year > 2035) errors.push(`Row ${rowNumber}: year is invalid.`);
    if (text(row.paidAmount) && amountPaid === null) errors.push(`Row ${rowNumber}: paidAmount is invalid.`);
    if (!["PENDING", "APPROVED", "ARCHIVED"].includes(status)) errors.push(`Row ${rowNumber}: status is invalid.`);
    if (!["UNPAID", "PARTIAL", "PAID", "WAIVED"].includes(paymentStatus)) errors.push(`Row ${rowNumber}: paymentStatus is invalid.`);

    return {
      name,
      surname,
      city: text(row.city) || null,
      country: text(row.country) || null,
      year,
      status: status as "PENDING" | "APPROVED" | "ARCHIVED",
      amountPaid: amountPaid || undefined,
      currency: text(row.currency).toUpperCase() || "CHF",
      paymentStatus,
      isPublic: asBoolean(row.isPublic),
      publicVisibleAmount: asBoolean(row.showAmountPublicly),
      notes: text(row.privateNotes) || null
    };
  });

  return { valid, errors };
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  if (!process.env.DATABASE_URL) return new NextResponse("Database not configured", { status: 500 });

  const body = (await request.json()) as { rows?: ImportRow[] };
  const rows = Array.isArray(body.rows) ? body.rows : [];
  const { valid, errors } = validateRows(rows);

  if (!rows.length) return new NextResponse("No rows to import", { status: 400 });
  if (errors.length) return NextResponse.json({ errors }, { status: 400 });

  await prisma.member.createMany({ data: valid });

  return NextResponse.json({ imported: valid.length });
}
