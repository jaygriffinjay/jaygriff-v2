import "server-only";

import { AwsClient } from "aws4fetch";

export type R2Object = {
  key: string;
  url: string;
  size: number;
  uploaded: string;
};

// read lazily so a missing key fails the image manager route, not the whole build
function config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBase = process.env.R2_PUBLIC_BASE;

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    throw new Error("R2 environment variables are not fully set");
  }

  return { accountId, accessKeyId, secretAccessKey, bucket, publicBase };
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&apos;": "'",
};

function unescapeXml(value: string) {
  return value.replace(/&(?:amp|lt|gt|quot|apos);/g, (match) => ENTITIES[match]);
}

function tag(block: string, name: string) {
  const match = block.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`));
  return match ? unescapeXml(match[1]) : "";
}

/**
 * Lists every object in the bucket via the S3 API.
 *
 * The public custom domain only resolves keys it is given, so enumeration has
 * to go through r2.cloudflarestorage.com with signed credentials.
 */
export async function listR2Objects(): Promise<R2Object[]> {
  const { accountId, accessKeyId, secretAccessKey, bucket, publicBase } = config();

  const client = new AwsClient({
    accessKeyId,
    secretAccessKey,
    service: "s3",
    region: "auto",
  });

  const base = `https://${accountId}.r2.cloudflarestorage.com/${bucket}`;
  const root = publicBase.replace(/\/$/, "");
  const objects: R2Object[] = [];
  let token: string | undefined;

  do {
    const url = new URL(base);
    url.searchParams.set("list-type", "2");
    url.searchParams.set("max-keys", "1000");
    if (token) url.searchParams.set("continuation-token", token);

    const res = await client.fetch(url.toString());
    if (!res.ok) {
      throw new Error(`R2 list failed: ${res.status} ${await res.text()}`);
    }

    const xml = await res.text();

    for (const [, block] of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
      const key = tag(block, "Key");
      if (!key || key.endsWith("/")) continue;

      objects.push({
        key,
        url: `${root}/${key.split("/").map(encodeURIComponent).join("/")}`,
        size: Number(tag(block, "Size")),
        uploaded: tag(block, "LastModified"),
      });
    }

    token =
      tag(xml, "IsTruncated") === "true"
        ? tag(xml, "NextContinuationToken")
        : undefined;
  } while (token);

  return objects;
}
