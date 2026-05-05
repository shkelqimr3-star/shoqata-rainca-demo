import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const headers = [
  "firstName",
  "lastName",
  "city",
  "country",
  "year",
  "status",
  "paidAmount",
  "currency",
  "paymentStatus",
  "isPublic",
  "showAmountPublicly",
  "privateNotes",
  "createdAt",
  "updatedAt"
];

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
}

function money(value: unknown) {
  if (!value) return "";
  if (typeof value === "object" && "toString" in value) return value.toString();
  return String(value);
}

export async function GET() {
  if (!(await isAdmin())) return new NextResponse("Unauthorized", { status: 401 });
  if (!process.env.DATABASE_URL) return new NextResponse("Database not configured", { status: 500 });

  const members = await prisma.member.findMany({ orderBy: [{ year: "desc" }, { surname: "asc" }, { name: "asc" }] });
  const rows = members.map((member) => [
    member.name,
    member.surname,
    member.city,
    member.country,
    member.year,
    member.status,
    money(member.amountPaid),
    member.currency,
    member.paymentStatus,
    member.isPublic,
    member.publicVisibleAmount,
    member.notes,
    member.createdAt.toISOString(),
    member.updatedAt.toISOString()
  ]);

  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="shoqata-rainca-members.csv"`
    }
  });
}
