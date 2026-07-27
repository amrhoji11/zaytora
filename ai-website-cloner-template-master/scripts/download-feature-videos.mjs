import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public", "videos", "features");

const VIDEOS = [
  { key: "contact", url: "https://media.base44.com/videos/public/6966e1f30fa9fbe508239391/6b60d5111_contact.MP4" },
  { key: "location", url: "https://media.base44.com/videos/public/6966e1f30fa9fbe508239391/4db7dc48c_ScreenRecording_05-21-20263-50-55pm_1.MP4" },
  { key: "save-date", url: "https://media.base44.com/videos/public/6966e1f30fa9fbe508239391/6e89fa3c3_ScreenRecording_05-21-20264-14-22pm_1.MP4" },
  { key: "music", url: "https://media.base44.com/videos/public/6966e1f30fa9fbe508239391/61299c04b_ScreenRecording_05-21-20263-51-15pm_1.MP4" },
  { key: "rsvp", url: "https://media.base44.com/videos/public/6966e1f30fa9fbe508239391/e16d9c5c0_ScreenRecording_05-21-20263-49-59pm_1.MP4" },
  { key: "camera", url: "https://media.base44.com/videos/public/6966e1f30fa9fbe508239391/d5fe299fc_camera.MP4" },
];

async function download({ key, url }) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${key}: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const dest = path.join(OUT_DIR, `${key}.mp4`);
  await writeFile(dest, buf);
  console.log(`Saved ${key}.mp4 (${(buf.length / 1024 / 1024).toFixed(2)} MB)`);
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  for (const video of VIDEOS) {
    await download(video);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
