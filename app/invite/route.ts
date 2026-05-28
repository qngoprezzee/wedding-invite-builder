import fs from "fs/promises";
import path from "path";
import { getConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

const TEXT_REPLACEMENTS: Array<[keyof Omit<import("@/types/config").WeddingConfig, "photos">, string]> = [
  ["groomName",       "[TÊN CHÚ RỂ]"],
  ["brideName",       "[TÊN CÔ DÂU]"],
  ["groomEventDate",  "[DD/MM/YYYY - Nhà Trai]"],
  ["brideEventDate",  "[DD/MM/YYYY - Nhà Gái]"],
  ["eventTime",       "[GIỜ TIỆC]"],
  ["eventDay",        "[NGÀY]"],
  ["eventMonthYear",  "[THÁNG - NĂM]"],
  ["eventWeekday",    "[THỨ]"],
  ["lunarDate",       "[DD tháng MM năm ÂM LỊCH]"],
  ["venue",           "[TÊN NHÀ HÀNG]"],
  ["venueAddress",    "[ĐỊA CHỈ NHÀ HÀNG]"],
];

export async function GET() {
  const [template, config] = await Promise.all([
    fs.readFile(path.join(process.cwd(), "public", "template.html"), "utf-8"),
    getConfig(),
  ]);

  let html = template;

  // Replace text placeholders
  for (const [key, placeholder] of TEXT_REPLACEMENTS) {
    const value = config[key] as string;
    html = html.split(placeholder).join(value);
  }

  // Replace photo paths
  for (const [templatePath, url] of Object.entries(config.photos)) {
    html = html.split(templatePath).join(url);
  }

  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
