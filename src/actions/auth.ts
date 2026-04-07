"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT} from "jose";

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET);

export async function login(_prev: { error?: string } | null, formData: FormData) {
  const password = formData.get("password") as string;

  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: "Invalid password" };
  }

  const token = await new SignJWT({ sub: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .setIssuedAt()
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  redirect("/admin/content");
}
