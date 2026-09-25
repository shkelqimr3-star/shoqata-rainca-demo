import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE = "rainca_v2_admin";

function secret() {
  return process.env.ADMIN_V2_PASSWORD || process.env.ADMIN_PASSWORD || "";
}

function tokenFor(value: string) {
  return createHash("sha256").update(`rainca-v2:${value}`).digest("hex");
}

export function v2AdminConfigured() {
  return Boolean(secret());
}

export function checkV2Password(password: string) {
  const expected = secret();
  if (!expected || !password) return false;
  const a = Buffer.from(tokenFor(password));
  const b = Buffer.from(tokenFor(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function setV2AdminSession() {
  const value = secret();
  if (!value) throw new Error("Admin password is not configured.");
  const store = await cookies();
  store.set(COOKIE, tokenFor(value), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 10
  });
}

export async function clearV2AdminSession() {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isV2Admin() {
  const value = secret();
  if (!value) return false;
  const store = await cookies();
  const cookie = store.get(COOKIE)?.value || "";
  const expected = tokenFor(value);
  if (cookie.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(cookie), Buffer.from(expected));
}
