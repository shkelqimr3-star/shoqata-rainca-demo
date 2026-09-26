"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ensureV2ContentTables } from "@/lib/v2-content";
import { isV2Admin } from "@/lib/v2-auth";

async function guard() {
  if (!(await isV2Admin())) redirect("/admin-v2");
  if (!process.env.DATABASE_URL) redirect("/admin-v2/permbajtja?error=database");
  await ensureV2ContentTables();
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function bool(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function nullable(formData: FormData, key: string) {
  const value = text(formData, key);
  return value || null;
}

function toDateTime(value: string) {
  if (!value) return null;
  const local = new Date(value);
  return Number.isNaN(local.getTime()) ? null : local;
}

function revalidateContent() {
  revalidatePath("/");
  revalidatePath("/eventet");
  revalidatePath("/projektet");
  revalidatePath("/admin-v2/permbajtja");
}

export async function createEventV2(formData: FormData) {
  await guard();

  const title = text(formData, "title");
  const description = text(formData, "description");
  const details = nullable(formData, "details");
  const location = text(formData, "location");
  const startsAt = toDateTime(text(formData, "startsAt"));
  const imageUrl = nullable(formData, "imageUrl");
  const published = bool(formData, "published");

  if (!title || !description || !location || !startsAt) {
    redirect("/admin-v2/permbajtja?error=event");
  }

  await prisma.$executeRawUnsafe(
    `insert into v2_events
      (id, title, description, details, location, starts_at, image_url, published)
     values ($1,$2,$3,$4,$5,$6,$7,$8)`,
    randomUUID(),
    title,
    description,
    details,
    location,
    startsAt,
    imageUrl,
    published
  );

  revalidateContent();
  redirect("/admin-v2/permbajtja?eventCreated=1");
}

export async function updateEventV2(formData: FormData) {
  await guard();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const description = text(formData, "description");
  const details = nullable(formData, "details");
  const location = text(formData, "location");
  const startsAt = toDateTime(text(formData, "startsAt"));
  const imageUrl = nullable(formData, "imageUrl");
  const published = bool(formData, "published");

  if (!id || !title || !description || !location || !startsAt) {
    redirect("/admin-v2/permbajtja?error=event");
  }

  await prisma.$executeRawUnsafe(
    `update v2_events
     set title=$2, description=$3, details=$4, location=$5, starts_at=$6,
         image_url=$7, published=$8, updated_at=now()
     where id=$1`,
    id,
    title,
    description,
    details,
    location,
    startsAt,
    imageUrl,
    published
  );

  revalidateContent();
  redirect("/admin-v2/permbajtja?eventSaved=1");
}

export async function deleteEventV2(formData: FormData) {
  await guard();
  const id = text(formData, "id");
  if (id) {
    await prisma.$executeRawUnsafe("delete from v2_events where id=$1", id);
  }
  revalidateContent();
  redirect("/admin-v2/permbajtja?eventDeleted=1");
}

export async function createProjectV2(formData: FormData) {
  await guard();

  const title = text(formData, "title");
  const summary = text(formData, "summary");
  const category = text(formData, "category");
  const status = text(formData, "status");
  const year = Number(text(formData, "year"));
  const budgetRaw = text(formData, "budget");
  const budget = budgetRaw ? Number(budgetRaw.replace(",", ".")) : null;
  const imageUrl = nullable(formData, "imageUrl");
  const published = bool(formData, "published");

  if (!title || !summary || !category || !status || !Number.isInteger(year)) {
    redirect("/admin-v2/permbajtja?error=project");
  }

  await prisma.$executeRawUnsafe(
    `insert into v2_projects
      (id, title, summary, category, status, year, budget, image_url, published)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    randomUUID(),
    title,
    summary,
    category,
    status,
    year,
    budget,
    imageUrl,
    published
  );

  revalidateContent();
  redirect("/admin-v2/permbajtja?projectCreated=1");
}

export async function updateProjectV2(formData: FormData) {
  await guard();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const summary = text(formData, "summary");
  const category = text(formData, "category");
  const status = text(formData, "status");
  const year = Number(text(formData, "year"));
  const budgetRaw = text(formData, "budget");
  const budget = budgetRaw ? Number(budgetRaw.replace(",", ".")) : null;
  const imageUrl = nullable(formData, "imageUrl");
  const published = bool(formData, "published");

  if (!id || !title || !summary || !category || !status || !Number.isInteger(year)) {
    redirect("/admin-v2/permbajtja?error=project");
  }

  await prisma.$executeRawUnsafe(
    `update v2_projects
     set title=$2, summary=$3, category=$4, status=$5, year=$6,
         budget=$7, image_url=$8, published=$9, updated_at=now()
     where id=$1`,
    id,
    title,
    summary,
    category,
    status,
    year,
    budget,
    imageUrl,
    published
  );

  revalidateContent();
  redirect("/admin-v2/permbajtja?projectSaved=1");
}

export async function deleteProjectV2(formData: FormData) {
  await guard();
  const id = text(formData, "id");
  if (id) {
    await prisma.$executeRawUnsafe("delete from v2_projects where id=$1", id);
  }
  revalidateContent();
  redirect("/admin-v2/permbajtja?projectDeleted=1");
}
