import { put, list } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";
import type { WeddingConfig } from "@/types/config";

const CONFIG_BLOB_PATH = "config/wedding.json";
const LOCAL_CONFIG = path.join(process.cwd(), "config.json");

function useBlob() {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export async function getConfig(): Promise<WeddingConfig> {
  if (useBlob()) {
    const { blobs } = await list({ prefix: CONFIG_BLOB_PATH });
    if (blobs.length > 0) {
      const res = await fetch(blobs[0].url, { cache: "no-store" });
      return res.json();
    }
  }
  const raw = await fs.readFile(LOCAL_CONFIG, "utf-8");
  return JSON.parse(raw);
}

export async function saveConfig(config: WeddingConfig): Promise<void> {
  if (useBlob()) {
    await put(CONFIG_BLOB_PATH, JSON.stringify(config, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
  } else {
    await fs.writeFile(LOCAL_CONFIG, JSON.stringify(config, null, 2));
  }
}
