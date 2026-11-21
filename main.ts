// Entry point for the bring-the-humans-03 TikTok ad entry.
//
// The video itself is the entry: it lives on TikTok, and this repository
// only hands the house its address. This program's whole job is to copy
// VIDEO.json into the output directory the grader reads.
//
// Run it with:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const videoFile = join(here, "VIDEO.json");

// The grader tells the program where its output goes; fall back to a
// local folder of the same name when it says nothing.
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(here, "out");

function main(): void {
  if (!existsSync(videoFile)) {
    throw new Error(`VIDEO.json is missing next to ${here}`);
  }

  // Refuse to hand in a placeholder-shaped file that is not valid JSON
  // or does not name a TikTok video: a bad address fails the gate.
  const parsed: unknown = JSON.parse(readFileSync(videoFile, "utf8"));
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as { url?: unknown }).url !== "string" ||
    !(parsed as { url: string }).url.startsWith("https://www.tiktok.com/")
  ) {
    throw new Error("VIDEO.json must hold {\"url\": \"https://www.tiktok.com/...\"}");
  }

  mkdirSync(outDir, { recursive: true });
  const target = join(outDir, "VIDEO.json");
  copyFileSync(videoFile, target);
  console.log(`Copied VIDEO.json to ${target}`);
}

main();
