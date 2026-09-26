"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isV2Admin } from "@/lib/v2-auth";
import { ensureV2GalleryTable } from "@/lib/v2-gallery";

async function guard() {
  if (!(await isV2Admin())) redirect("/admin-v2");
  if (!process.env.DATABASE_URL) redirect("/admin-v2/galeria?error=database");
  await ensureV2GalleryTable();
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

function refresh() {
  revalidatePath("/galeria");
  revalidatePath("/");
  revalidatePath("/admin-v2/galeria");
}

export async function createGalleryItem(formData: FormData) {
  await guard();

  const title = text(formData, "title");
  const year = Number(text(formData, "year"));
  const mediaType = text(formData, "mediaType") || "image";
  const mediaUrl = text(formData, "mediaUrl");

  if (!title || !Number.isInteger(year) || !["image","video"].includes(mediaType) || !mediaUrl) {
    redirect("/admin-v2/galeria?error=item");
  }

  await prisma.$executeRawUnsafe(
    `insert into v2_gallery
      (id, title, caption, event_label, year, media_type, media_url, published, sort_order)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    randomUUID(),
    title,
    nullable(formData, "caption"),
    nullable(formData, "eventLabel"),
    year,
    mediaType,
    mediaUrl,
    bool(formData, "published"),
    Number(text(formData, "sortOrder") || "0")
  );

  refresh();
  redirect("/admin-v2/galeria?created=1");
}

export async function updateGalleryItem(formData: FormData) {
  await guard();

  const id = text(formData, "id");
  const title = text(formData, "title");
  const year = Number(text(formData, "year"));
  const mediaType = text(formData, "mediaType") || "image";
  const mediaUrl = text(formData, "mediaUrl");

  if (!id || !title || !Number.isInteger(year) || !["image","video"].includes(mediaType) || !mediaUrl) {
    redirect("/admin-v2/galeria?error=item");
  }

  await prisma.$executeRawUnsafe(
    `update v2_gallery
     set title=$2, caption=$3, event_label=$4, year=$5, media_type=$6,
         media_url=$7, published=$8, sort_order=$9, updated_at=now()
     where id=$1`,
    id,
    title,
    nullable(formData, "caption"),
    nullable(formData, "eventLabel"),
    year,
    mediaType,
    mediaUrl,
    bool(formData, "published"),
    Number(text(formData, "sortOrder") || "0")
  );

  refresh();
  redirect("/admin-v2/galeria?saved=1");
}

export async function deleteGalleryItem(formData: FormData) {
  await guard();
  const id = text(formData, "id");
  if (id) await prisma.$executeRawUnsafe("delete from v2_gallery where id=$1", id);
  refresh();
  redirect("/admin-v2/galeria?deleted=1");
}
