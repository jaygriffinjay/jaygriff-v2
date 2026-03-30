import { createClient } from "@libsql/client";

if (!process.env.TURSO_URL) throw new Error("TURSO_URL is not set");
if (!process.env.TURSO_AUTH_TOKEN)
  throw new Error("TURSO_AUTH_TOKEN is not set");

export const db = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
