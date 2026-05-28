import { type NextRequest } from "next/server";
import { getConfig, saveConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = await getConfig();
  return Response.json(config);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  await saveConfig(body);
  return Response.json({ ok: true });
}
