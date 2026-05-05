import { createHash } from "crypto";
import { cookies } from "next/headers";

const cookieName = "rainca_admin";

function adminSecret() {
  return process.env.ADMIN_PASSWORD || "rainca-demo-admin";
}

function token() {
  return createHash("sha256").update(adminSecret()).digest("hex");
}

export async function isAdmin() {
  const store = await cookies();
  return store.get(cookieName)?.value === token();
}

export async function setAdminSession() {
  const store = await cookies();
  store.set(cookieName, token(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(cookieName);
}

export function checkPassword(password: string) {
  return password === adminSecret();
}
