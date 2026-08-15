// Visual parity check: loads the live reference invitation page and our
// local /invitationpublic (template-preview flow, so both sides render
// fully-populated demo content) side by side in a mobile viewport, opens
// the envelope on both, screenshots both full pages, extracts computed
// styles from a fixed set of landmark elements on each, and diffs them —
// surfacing exactly which metrics (padding, gaps, radius, blur, colors,
// total scroll height) still disagree, rather than assuming parity.
//
// Usage: node scripts/visual-parity-check.js
// Output: scripts/parity/reference.png, scripts/parity/local.png,
//          scripts/parity/parity-report.json

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const REFERENCE_URL =
  "https://numinds.me/invitationpublic?slug=invitation-rnevpi-1780523665381&fbclid=PAVERFWASSy81leHRuA2FlbQIxMABzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaccPAlm71wD24cpJmfn08HeT_ZecBiaw28-ZujYN_GDt49PV9GcagWrPCq-Ew_aem_noBd-b6dub566em-JOYyog";
// Our route has no equivalent "slug" — it's driven by ?template=<code>
// (dummy/demo data) or ?id=<guid>&preview=true (real draft data). The
// template flow is the fair comparison since both sides then show
// fully-populated placeholder content rather than one side being a mostly
// empty real draft.
const LOCAL_URL = "http://localhost:3000/invitationpublic?template=W031";

const OUT_DIR = path.join(__dirname, "parity");
const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function openEnvelopeAndScroll(page) {
  await sleep(1000);
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.includes("OPEN"));
    if (btn) btn.click();
  });
  await sleep(600);
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    let last = -1;
    for (let y = 0; y < document.body.scrollHeight; y += 200) {
      window.scrollTo(0, y);
      await delay(100);
      if (document.body.scrollHeight === last) break;
      last = document.body.scrollHeight;
    }
    window.scrollTo(0, 0);
    await delay(200);
  });
  await sleep(400);
}

function docTop(el) {
  let top = 0;
  let node = el;
  while (node) {
    top += node.offsetTop || 0;
    node = node.offsetParent;
  }
  return top;
}

function extractInPage() {
  function styleOf(el) {
    if (!el) return null;
    const cs = getComputedStyle(el);
    return {
      text: el.textContent.trim().slice(0, 30),
      borderRadius: cs.borderRadius,
      padding: cs.padding,
      background: cs.backgroundColor,
      backdropFilter: cs.backdropFilter,
      border: cs.border,
      boxShadow: cs.boxShadow,
      color: cs.color,
      fontSize: cs.fontSize,
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
    };
  }
  function findByText(text, exact = true) {
    return Array.from(document.querySelectorAll("*")).find((el) => {
      const t = el.textContent.trim();
      return el.children.length === 0 && (exact ? t === text : t.includes(text));
    });
  }
  function docTopLocal(el) {
    let top = 0;
    let node = el;
    while (node) {
      top += node.offsetTop || 0;
      node = node.offsetParent;
    }
    return top;
  }

  const allCards = Array.from(document.querySelectorAll("div")).filter((el) => {
    const cs = getComputedStyle(el);
    return (
      cs.backdropFilter !== "none" &&
      /rgba?\([^)]*,\s*0\.0[5-9]|rgba?\([^)]*,\s*0\.1[0-9]\)/.test(cs.backgroundColor)
    );
  });
  const outermost = allCards.filter((el) => !allCards.some((other) => other !== el && other.contains(el)));
  outermost.sort((a, b) => docTopLocal(a) - docTopLocal(b));

  const bottomNavBtn = Array.from(document.querySelectorAll("button")).find((b) => {
    const t = b.textContent;
    return t.includes("موسيقى") || t.includes("تواصل") || t.includes("Music") || t.includes("Contact");
  });
  let nav = bottomNavBtn ? bottomNavBtn.parentElement : null;
  while (nav && getComputedStyle(nav).position !== "fixed") nav = nav.parentElement;

  return {
    pageScrollHeight: document.body.scrollHeight,
    firstCard: styleOf(outermost[0]),
    cardCount: outermost.length,
    cardSample: outermost.slice(0, 3).map(styleOf),
    bottomNav: nav
      ? {
          width: nav.getBoundingClientRect().width,
          height: nav.getBoundingClientRect().height,
          borderRadius: getComputedStyle(nav).borderRadius,
          background: getComputedStyle(nav).backgroundColor,
          backdropFilter: getComputedStyle(nav).backdropFilter,
        }
      : null,
    heroTitle: styleOf(findByText("حفل زفاف", true) || findByText("حـفـل زفـاف", true)),
  };
}

async function extractMetrics(page) {
  return page.evaluate(extractInPage);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({ headless: true });

  console.log("--- Reference ---");
  const refPage = await browser.newPage();
  await refPage.setViewport(VIEWPORT);
  await refPage.setUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  );
  await refPage.goto(REFERENCE_URL, { waitUntil: "networkidle2", timeout: 60000 });
  await openEnvelopeAndScroll(refPage);
  await refPage.screenshot({ path: path.join(OUT_DIR, "reference.png"), fullPage: true });
  const refMetrics = await extractMetrics(refPage);
  console.log("Reference scroll height:", refMetrics.pageScrollHeight);

  console.log("--- Local ---");
  const localPage = await browser.newPage();
  await localPage.setViewport(VIEWPORT);
  await localPage.setUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  );
  await localPage.goto(LOCAL_URL, { waitUntil: "networkidle2", timeout: 60000 });
  await openEnvelopeAndScroll(localPage);
  await localPage.screenshot({ path: path.join(OUT_DIR, "local.png"), fullPage: true });
  const localMetrics = await extractMetrics(localPage);
  console.log("Local scroll height:", localMetrics.pageScrollHeight);

  const report = {
    reference: refMetrics,
    local: localMetrics,
    diff: {
      scrollHeightDeltaPx: localMetrics.pageScrollHeight - refMetrics.pageScrollHeight,
      cardCountDelta: localMetrics.cardCount - refMetrics.cardCount,
    },
  };
  fs.writeFileSync(path.join(OUT_DIR, "parity-report.json"), JSON.stringify(report, null, 2), "utf-8");
  console.log("\nSaved screenshots + report to", OUT_DIR);
  console.log("Scroll height delta (local - reference):", report.diff.scrollHeightDeltaPx, "px");

  await browser.close();
}

main().catch((error) => {
  console.error("Parity check failed:", error);
  process.exit(1);
});
