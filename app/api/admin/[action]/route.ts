import { NextResponse } from "next/server";
import { checkPassword, clearAdminSession, isAdmin, setAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function optionalText(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || null;
}

function intValue(formData: FormData, key: string, fallback = 0) {
  const value = Number(text(formData, key));
  return Number.isFinite(value) ? value : fallback;
}

function boolValue(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function reportCategories(formData: FormData) {
  return text(formData, "categories")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [label, amount] = line.split(":");
      return { label: (label || "Kategori").trim(), amount: Number(amount || 0) };
    });
}

function dateValue(formData: FormData, key: string) {
  const value = text(formData, key);
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function projectData(formData: FormData) {
  return {
    titleSq: text(formData, "titleSq"),
    titleDe: text(formData, "titleDe"),
    summarySq: text(formData, "summarySq"),
    summaryDe: text(formData, "summaryDe"),
    category: text(formData, "category"),
    status: text(formData, "status"),
    year: intValue(formData, "year", new Date().getFullYear()),
    budget: text(formData, "budget") || undefined,
    imageUrl: optionalText(formData, "imageUrl"),
    isPublished: boolValue(formData, "isPublished")
  };
}

function membershipStatData(formData: FormData) {
  const status = text(formData, "status");
  return {
    year: intValue(formData, "year", new Date().getFullYear()),
    memberCount: intValue(formData, "memberCount"),
    status: status === "closed" ? "closed" : "in_progress",
    dateUpdated: dateValue(formData, "dateUpdated"),
    noteSq: optionalText(formData, "noteSq"),
    noteDe: optionalText(formData, "noteDe"),
    sortOrder: intValue(formData, "sortOrder", intValue(formData, "year", new Date().getFullYear())),
    isPublished: boolValue(formData, "isPublished")
  };
}

async function fileBytes(formData: FormData, key: string) {
  const file = formData.get(key);
  if (!(file instanceof File) || file.size === 0) return null;
  return {
    name: file.name,
    bytes: Buffer.from(await file.arrayBuffer())
  };
}

function back(request: Request) {
  return NextResponse.redirect(new URL("/admin", request.url), 303);
}

async function guard(request: Request) {
  if (await isAdmin()) return null;
  return NextResponse.redirect(new URL("/admin", request.url), 303);
}

export async function POST(request: Request, { params }: { params: Promise<{ action: string }> }) {
  const { action } = await params;
  const formData = await request.formData();

  if (action === "login") {
    if (checkPassword(text(formData, "password"))) {
      await setAdminSession();
      return back(request);
    }
    return NextResponse.redirect(new URL("/admin?error=1", request.url), 303);
  }

  if (action === "logout") {
    await clearAdminSession();
    return back(request);
  }

  const denied = await guard(request);
  if (denied) return denied;
  if (!process.env.DATABASE_URL) return back(request);

  if (action === "settings") {
    const pdf = await fileBytes(formData, "statutePdf");
    const existing = await prisma.siteSettings.findFirst({ orderBy: { updatedAt: "desc" } });
    await prisma.siteSettings.upsert({
      where: { id: existing?.id ?? "new-settings" },
      create: {
        associationName: text(formData, "associationName") || "Shoqata Rainca",
        officialEmail: text(formData, "officialEmail") || "info@shoqata-rainca.ch",
        domain: text(formData, "domain") || "shoqata-rainca.ch",
        heroImageUrl: optionalText(formData, "heroImageUrl"),
        logoUrl: optionalText(formData, "logoUrl"),
        qrImageUrl: optionalText(formData, "qrImageUrl"),
        iban: optionalText(formData, "iban"),
        bankName: optionalText(formData, "bankName"),
        paymentNote: optionalText(formData, "paymentNote"),
        contactAddress: optionalText(formData, "contactAddress"),
        contactPhone: optionalText(formData, "contactPhone"),
        statutePdfUrl: optionalText(formData, "statutePdfUrl"),
        statutePdfName: pdf?.name,
        statutePdfBytes: pdf?.bytes
      },
      update: {
        associationName: text(formData, "associationName") || "Shoqata Rainca",
        officialEmail: text(formData, "officialEmail") || "info@shoqata-rainca.ch",
        domain: text(formData, "domain") || "shoqata-rainca.ch",
        heroImageUrl: optionalText(formData, "heroImageUrl"),
        logoUrl: optionalText(formData, "logoUrl"),
        qrImageUrl: optionalText(formData, "qrImageUrl"),
        iban: optionalText(formData, "iban"),
        bankName: optionalText(formData, "bankName"),
        paymentNote: optionalText(formData, "paymentNote"),
        contactAddress: optionalText(formData, "contactAddress"),
        contactPhone: optionalText(formData, "contactPhone"),
        statutePdfUrl: optionalText(formData, "statutePdfUrl"),
        ...(pdf ? { statutePdfName: pdf.name, statutePdfBytes: pdf.bytes } : {})
      }
    });
  }

  if (action === "project") {
    await prisma.project.create({
      data: projectData(formData)
    });
  }

  if (action === "project-update") {
    await prisma.project.update({
      where: { id: text(formData, "id") },
      data: projectData(formData)
    });
  }

  if (action === "membership-stat") {
    await prisma.membershipStatistic.create({
      data: membershipStatData(formData)
    });
  }

  if (action === "membership-stat-update") {
    await prisma.membershipStatistic.update({
      where: { id: text(formData, "id") },
      data: membershipStatData(formData)
    });
  }

  if (action === "report") {
    const pdf = await fileBytes(formData, "pdf");
    await prisma.financialReport.create({
      data: {
        year: intValue(formData, "year", new Date().getFullYear()),
        title: text(formData, "title"),
        income: text(formData, "income") || "0",
        expenses: text(formData, "expenses") || "0",
        categories: reportCategories(formData),
        pdfUrl: optionalText(formData, "pdfUrl"),
        pdfName: pdf?.name,
        pdfBytes: pdf?.bytes,
        isPublished: boolValue(formData, "isPublished")
      }
    });
  }

  if (action === "report-update") {
    const pdf = await fileBytes(formData, "pdf");
    await prisma.financialReport.update({
      where: { id: text(formData, "id") },
      data: {
        year: intValue(formData, "year", new Date().getFullYear()),
        title: text(formData, "title"),
        income: text(formData, "income") || "0",
        expenses: text(formData, "expenses") || "0",
        categories: reportCategories(formData),
        pdfUrl: optionalText(formData, "pdfUrl"),
        isPublished: boolValue(formData, "isPublished"),
        ...(pdf ? { pdfName: pdf.name, pdfBytes: pdf.bytes } : {})
      }
    });
  }

  if (action === "member") {
    await prisma.member.create({
      data: {
        name: text(formData, "name"),
        surname: text(formData, "surname"),
        country: optionalText(formData, "country"),
        city: optionalText(formData, "city"),
        year: text(formData, "year") ? intValue(formData, "year") : null,
        amountPaid: text(formData, "amountPaid") || undefined,
        currency: text(formData, "currency") || "CHF",
        paymentStatus: text(formData, "paymentStatus") || "UNPAID",
        notes: optionalText(formData, "notes"),
        status: text(formData, "status") as "PENDING" | "APPROVED" | "ARCHIVED",
        isPublic: boolValue(formData, "isPublic"),
        publicVisibleAmount: boolValue(formData, "publicVisibleAmount")
      }
    });
  }

  if (action === "application") {
    await prisma.membershipApplication.update({
      where: { id: text(formData, "id") },
      data: {
        status: text(formData, "status") as "NEW" | "REVIEWING" | "APPROVED" | "DECLINED"
      }
    });
  }

  if (action === "board") {
    await prisma.boardMember.create({
      data: {
        fullName: text(formData, "fullName"),
        positionSq: text(formData, "positionSq"),
        positionDe: text(formData, "positionDe"),
        bioSq: optionalText(formData, "bioSq"),
        bioDe: optionalText(formData, "bioDe"),
        imageUrl: optionalText(formData, "imageUrl"),
        sortOrder: intValue(formData, "sortOrder"),
        isPublished: boolValue(formData, "isPublished")
      }
    });
  }

  if (action === "event") {
    await prisma.event.create({
      data: {
        titleSq: text(formData, "titleSq"),
        titleDe: text(formData, "titleDe"),
        descriptionSq: text(formData, "descriptionSq"),
        descriptionDe: text(formData, "descriptionDe"),
        location: text(formData, "location"),
        startsAt: new Date(text(formData, "startsAt")),
        imageUrl: optionalText(formData, "imageUrl"),
        isPublished: boolValue(formData, "isPublished")
      }
    });
  }

  if (action === "gallery") {
    await prisma.galleryItem.create({
      data: {
        titleSq: text(formData, "titleSq"),
        titleDe: text(formData, "titleDe"),
        imageUrl: text(formData, "imageUrl"),
        captionSq: optionalText(formData, "captionSq"),
        captionDe: optionalText(formData, "captionDe"),
        isPublished: boolValue(formData, "isPublished")
      }
    });
  }

  if (action === "delete") {
    const model = text(formData, "model");
    const id = text(formData, "id");
    if (model === "project") await prisma.project.delete({ where: { id } });
    if (model === "report") await prisma.financialReport.delete({ where: { id } });
    if (model === "membershipStat") await prisma.membershipStatistic.delete({ where: { id } });
    if (model === "member") await prisma.member.delete({ where: { id } });
    if (model === "board") await prisma.boardMember.delete({ where: { id } });
    if (model === "event") await prisma.event.delete({ where: { id } });
    if (model === "gallery") await prisma.galleryItem.delete({ where: { id } });
  }

  return back(request);
}
