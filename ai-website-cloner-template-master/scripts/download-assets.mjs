import fs from "node:fs/promises";
import path from "node:path";

const assets = [
  { url: "https://media.base44.com/images/public/6966e1f30fa9fbe508239391/7031d6205_IMG_6192.jpg", out: "images/hero/invitation-preview.jpg" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/affe3f5b2_Screenshot2026-04-30at110642am.png", out: "images/templates/w024.png" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/96a893700_IMG_7553.jpeg", out: "images/templates/w031.jpeg" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/d9e5120d7_Screenshot2026-06-07at112136PM.png", out: "images/templates/w029.png" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/60722822f_Screenshot2026-03-22060952.png", out: "images/templates/w019.png" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/1a072fe6f_inbound2091984130594842491.jpg", out: "images/partners/orchid-invites.jpg" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/303570fe4_IMG_4970.jpeg", out: "images/partners/lumiere-by-basma.jpeg" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/510b1ea49__20260520_095444_.png", out: "images/partners/nawara.png" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/919c0f10a_ea3634b6-5912-41a1-bedb-a6e066eaa179.jpeg", out: "images/partners/numindseg.jpeg" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/52d2704f4_BlackandWhiteMinimalistProfessionalInitialLogo-1.png", out: "images/partners/kp-planner.png" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/a8b5320bf_Halacodelogo.png", out: "images/partners/halacode.png" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/a37dd3bbe_0989fa79-4226-4546-a8f6-d7a92a2c8f55.jpeg", out: "images/partners/togather-n.jpeg" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/4317aa8f0_IMG_5642.jpeg", out: "images/partners/n-design.jpeg" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/d5f007093_IMG_9774.jpeg", out: "images/partners/dy-designer.jpeg" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/15b83bedc_MEMORY-22.png", out: "images/partners/dhikra-events.png" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/5fde4beb9_IMG_8910.png", out: "images/partners/ayman-abdalillah.png" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/399f8a9c9_inbound854772114706327780.png", out: "images/partners/dj-dahab.png" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/9b782491e_IMG_9737.png", out: "images/partners/zeinap-abdullah.png" },
  { url: "https://base44.app/api/apps/6966e1f30fa9fbe508239391/files/mp/public/6966e1f30fa9fbe508239391/c2a0043d7_pww-01.jpg", out: "images/partners/dr-design.jpg" },
  { url: "https://media.base44.com/images/public/6966e1f30fa9fbe508239391/5ccef141b_14.png", out: "seo/favicon.png" },
];

const PUBLIC_DIR = path.resolve(import.meta.dirname, "..", "public");
const CONCURRENCY = 4;

async function downloadOne({ url, out }) {
  const dest = path.join(PUBLIC_DIR, out);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await fs.writeFile(dest, buf);
    console.log(`OK   ${out} (${buf.length} bytes)`);
  } catch (err) {
    console.error(`FAIL ${out}: ${err.message}`);
  }
}

async function run() {
  const queue = [...assets];
  async function worker() {
    while (queue.length) {
      const item = queue.shift();
      await downloadOne(item);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
}

run();
