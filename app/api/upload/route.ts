import { type NextRequest } from "next/server";
import { put } from "@vercel/blob";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const slot = form.get("slot") as string; // e.g. "images/photo-01.jpg"

  if (!file || !slot) {
    return Response.json({ error: "Missing file or slot" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const blobPath = `photos/${slot.replace("images/", "").replace(/\.[^.]+$/, "")}.${ext}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(blobPath, file, {
      access: "public",
      addRandomSuffix: false,
    });
    return Response.json({ url: blob.url });
  } else {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = path.basename(slot);
    const dest = path.join(process.cwd(), "public", "images", filename);
    await fs.writeFile(dest, buffer);
    return Response.json({ url: `/images/${filename}` });
  }
}
