import { memberRecords, type MemberRecord, type PaymentYear } from "@/data/member-records";
import { prisma } from "@/lib/prisma";

export type V2PaymentOverride = {
  id: string;
  sourceIndex: number;
  year: PaymentYear;
  amount: number;
  currency: string;
  method: string;
  updatedAt: Date;
};

function cloneMembers(): MemberRecord[] {
  return memberRecords.map((m) => ({
    ...m,
    payments: { ...m.payments }
  }));
}

function numberValue(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value) || 0;
  if (value && typeof value === "object" && "toString" in value) return Number(String(value)) || 0;
  return 0;
}

function parseOverride(note: string | null | undefined) {
  if (!note) return null;
  const match = note.match(/^V2_OVERRIDE:(\d+):(2023|2024|2025|2026)(?::([^:]+))?/);
  if (!match) return null;
  return {
    sourceIndex: Number(match[1]),
    year: match[2] as PaymentYear,
    method: match[3] || "bank"
  };
}

export async function getV2Members() {
  const members = cloneMembers();
  if (!process.env.DATABASE_URL) {
    return { members, databaseMode: false, overrides: [] as V2PaymentOverride[] };
  }

  try {
    const rows = await prisma.member.findMany({
      where: { notes: { startsWith: "V2_OVERRIDE:" } },
      orderBy: { updatedAt: "asc" }
    });

    const overrides: V2PaymentOverride[] = [];
    for (const row of rows) {
      const parsed = parseOverride(row.notes);
      if (!parsed) continue;
      const member = members.find((item) => item.sourceIndex === parsed.sourceIndex);
      if (!member) continue;
      const amount = numberValue(row.amountPaid);
      member.payments[parsed.year] = amount;
      overrides.push({
        id: row.id,
        sourceIndex: parsed.sourceIndex,
        year: parsed.year,
        amount,
        currency: row.currency || "CHF",
        method: parsed.method,
        updatedAt: row.updatedAt
      });
    }

    return { members, databaseMode: true, overrides };
  } catch (error) {
    console.error("V2 member override read failed", error);
    return { members, databaseMode: false, overrides: [] as V2PaymentOverride[] };
  }
}
