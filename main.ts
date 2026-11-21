// bring-the-humans-03 — entrypoint (Node 22).
// Copies the entry's VIDEO.json (the posted TikTok ad's URL) into /output
// so the grader can see exactly which video this entry is about.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const entryDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(entryDir, "VIDEO.json");
const outputDir = "/output";
const outputPath = join(outputDir, "VIDEO.json");

const text = readFileSync(sourcePath, "utf8");
const video = JSON.parse(text);

if (typeof video.url !== "string" || !video.url.startsWith("https://www.tiktok.com/")) {
  throw new Error("VIDEO.json must hold a https://www.tiktok.com/ video URL");
}

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

writeFileSync(outputPath, JSON.stringify(video, null, 2) + "\n", "utf8");

// Verify the copy actually landed before reporting success.
const copied = JSON.parse(readFileSync(outputPath, "utf8"));
if (copied.url !== video.url) {
  throw new Error("copy verification failed: /output/VIDEO.json does not match");
}

console.log(`Copied ${sourcePath} -> ${outputPath}`);
console.log(`Video: ${video.url}`);
