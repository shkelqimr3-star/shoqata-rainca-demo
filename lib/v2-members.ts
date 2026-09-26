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

type V2Profile = {
  id: string;
  sourceIndex: number;
  sourceNo: number;
  kind: "BASE" | "NEW";
  firstName: string;
  lastName: string;
  neighborhood: string | null;
  archived: boolean;
  updatedAt: Date;
};

function cloneMembers(): MemberRecord[] {
  return memberRecords.map((m) => ({
    ...m,
    archived: false,
    isNew: false,
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

function parseProfile(note: string | null | undefined) {
  if (!note) return null;
  const match = note.match(/^V2_PROFILE:(\d+):(\d+):(BASE|NEW)$/);
  if (!match) return null;
  return {
    sourceIndex: Number(match[1]),
    sourceNo: Number(match[2]),
    kind: match[3] as "BASE" | "NEW"
  };
}

export async function getV2Members() {
  const members = cloneMembers();
  if (!process.env.DATABASE_URL) {
    return {
      members,
      databaseMode: false,
      overrides: [] as V2PaymentOverride[],
      profiles: [] as V2Profile[]
    };
  }

  try {
    const rows = await prisma.member.findMany({
      where: {
        OR: [
          { notes: { startsWith: "V2_OVERRIDE:" } },
          { notes: { startsWith: "V2_PROFILE:" } }
        ]
      },
      orderBy: { updatedAt: "asc" }
    });

    const profiles: V2Profile[] = [];
    for (const row of rows) {
      const parsed = parseProfile(row.notes);
      if (!parsed) continue;

      const profile: V2Profile = {
        id: row.id,
        sourceIndex: parsed.sourceIndex,
        sourceNo: parsed.sourceNo,
        kind: parsed.kind,
        firstName: row.name,
        lastName: row.surname,
        neighborhood: row.city || null,
        archived: row.status === "ARCHIVED",
        updatedAt: row.updatedAt
      };
      profiles.push(profile);

      let member = members.find((item) => item.sourceIndex === parsed.sourceIndex);
      if (!member && parsed.kind === "NEW") {
        member = {
          sourceIndex: parsed.sourceIndex,
          sourceNo: parsed.sourceNo,
          firstName: row.name,
          lastName: row.surname,
          neighborhood: row.city || null,
          archived: row.status === "ARCHIVED",
          isNew: true,
          payments: { "2023": 0, "2024": 0, "2025": 0, "2026": 0 }
        };
        members.push(member);
      } else if (member) {
        member.sourceNo = parsed.sourceNo;
        member.firstName = row.name || member.firstName;
        member.lastName = row.surname || member.lastName;
        member.neighborhood = row.city || null;
        member.archived = row.status === "ARCHIVED";
        member.isNew = parsed.kind === "NEW";
      }
    }

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

    members.sort((a,b) => a.sourceNo - b.sourceNo || a.sourceIndex - b.sourceIndex);
    return { members, databaseMode: true, overrides, profiles };
  } catch (error) {
    console.error("V2 member data read failed", error);
    return {
      members,
      databaseMode: false,
      overrides: [] as V2PaymentOverride[],
      profiles: [] as V2Profile[]
    };
  }
}
