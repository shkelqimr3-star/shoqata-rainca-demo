import { demoData } from "@/lib/demo-data";
import { prisma } from "@/lib/prisma";
import type { CategoryValue, PublicData } from "@/lib/types";
import { existsSync } from "fs";
import path from "path";

function hasDatabase() {
  return Boolean(process.env.DATABASE_URL);
}

function uploadedAsset(preferred: string, fallback: string) {
  const relative = preferred.replace(/^\//, "");
  return existsSync(path.join(process.cwd(), "public", relative)) ? preferred : fallback;
}

function demoWithUploadedAssets(): PublicData {
  const heroImageUrl = "/uploads/rainca-aerial.jpg";
  const qrImageUrl = "/uploads/qr-payment.png";
  return {
    ...demoData,
    settings: {
      ...demoData.settings,
      heroImageUrl,
      qrImageUrl
    },
    gallery: demoData.gallery.map((item) =>
      item.id === "demo-gallery-1" ? { ...item, imageUrl: heroImageUrl } : item
    )
  };
}

function money(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return 0;
}

function categories(value: unknown): CategoryValue[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const candidate = item as { label?: unknown; amount?: unknown };
      return {
        label: String(candidate.label ?? "Kategori"),
        amount: money(candidate.amount)
      };
    })
    .filter(Boolean) as CategoryValue[];
}

export async function getPublicData(): Promise<PublicData> {
  if (!hasDatabase()) {
    return demoWithUploadedAssets();
  }

  try {
    const [settings, projects, membershipStats, reports, members, board, events, gallery] = await Promise.all([
      prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } }),
      prisma.project.findMany({ where: { isPublished: true }, orderBy: [{ year: "desc" }, { updatedAt: "desc" }] }),
      prisma.membershipStatistic.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { year: "asc" }] }),
      prisma.financialReport.findMany({ where: { isPublished: true }, orderBy: { year: "desc" } }),
      prisma.member.findMany({
        where: { isPublic: true },
        orderBy: [{ year: "desc" }, { surname: "asc" }, { name: "asc" }]
      }),
      prisma.boardMember.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { fullName: "asc" }] }),
      prisma.event.findMany({ where: { isPublished: true }, orderBy: { startsAt: "asc" } }),
      prisma.galleryItem.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" } })
    ]);

    return {
      settings: {
        associationName: settings?.associationName ?? demoData.settings.associationName,
        officialEmail: settings?.officialEmail ?? demoData.settings.officialEmail,
        domain: settings?.domain ?? demoData.settings.domain,
        heroImageUrl: settings?.heroImageUrl || uploadedAsset("/uploads/rainca-aerial.jpg", demoData.settings.heroImageUrl),
        logoUrl: settings?.logoUrl,
        qrImageUrl: settings?.qrImageUrl || uploadedAsset("/uploads/qr-payment.png", demoData.settings.qrImageUrl),
        iban: settings?.iban,
        bankName: settings?.bankName,
        paymentNote: settings?.paymentNote,
        contactAddress: settings?.contactAddress,
        contactPhone: settings?.contactPhone,
        statutePdfUrl: settings?.statutePdfBytes || settings?.statutePdfUrl ? "/api/files/statute" : settings?.statutePdfUrl
      },
      projects: projects.length
        ? projects.map((project) => ({
            ...project,
            budget: project.budget ? money(project.budget) : null
          }))
        : demoData.projects,
      membershipStats: membershipStats.length
        ? membershipStats.map((stat) => ({
            id: stat.id,
            year: stat.year,
            memberCount: stat.memberCount,
            status: stat.status,
            dateUpdated: stat.dateUpdated?.toISOString() ?? null,
            noteSq: stat.noteSq,
            noteDe: stat.noteDe,
            sortOrder: stat.sortOrder
          }))
        : demoData.membershipStats,
      reports: reports.length
        ? reports.map((report) => ({
            id: report.id,
            year: report.year,
            title: report.title,
            income: money(report.income),
            expenses: money(report.expenses),
            balance: money(report.income) - money(report.expenses),
            categories: categories(report.categories),
            pdfUrl: report.pdfBytes || report.pdfUrl ? `/api/files/reports/${report.id}` : null,
            hasPdf: Boolean(report.pdfBytes || report.pdfUrl)
          }))
        : demoData.reports,
      members: members.map((member) => ({
        id: member.id,
        name: member.name,
        surname: member.surname,
        country: member.country,
        year: member.year,
        status: member.status,
        amount: member.publicVisibleAmount ? money(member.amountPaid) : null,
        currency: member.publicVisibleAmount ? member.currency : null
      })),
      board: board.length ? board : demoData.board,
      events: events.length
        ? events.map((event) => ({
            ...event,
            startsAt: event.startsAt.toISOString()
          }))
        : demoData.events,
      gallery: gallery.length ? gallery : demoData.gallery
    };
  } catch (error) {
    console.error("Falling back to demo data:", error);
    return demoWithUploadedAssets();
  }
}
