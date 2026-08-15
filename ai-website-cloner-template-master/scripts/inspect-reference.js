// One-off inspection tool: launches headless Chrome (Puppeteer), opens the
// reference numinds.me invitation page in a mobile viewport, opens the
// envelope, scrolls smoothly through the whole page to let every
// whileInView reveal settle, then extracts computed styles for every
// section type so they can be diffed against our own InvitationCanvas.tsx /
// PublicInvitationView.tsx / BottomBar.tsx implementation.
//
// Usage: node scripts/inspect-reference.js
// Output: scripts/extracted-styles.json

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const TARGET_URL =
  "https://numinds.me/invitationpublic?slug=invitation-rnevpi-1780523665381&fbclid=PAVERFWASSy81leHRuA2FlbQIxMABzcnRjBmFwcF9pZA8xMjQwMjQ1NzQyODc0MTQAAaccPAlm71wD24cpJmfn08HeT_ZecBiaw28-ZujYN_GDt49PV9GcagWrPCq-Ew_aem_noBd-b6dub566em-JOYyog";

const OUTPUT_PATH = path.join(__dirname, "extracted-styles.json");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  // Mobile viewport — matches the 393px-wide column both sites use.
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await page.setUserAgent(
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
  );

  console.log("Navigating to reference URL...");
  await page.goto(TARGET_URL, { waitUntil: "networkidle2", timeout: 60000 });
  await sleep(1200); // let initial mount/entry animations settle

  // Envelope, captured BEFORE it's opened/removed — dimensions, transform/
  // transition timing, and z-index/layering of the cover + its OPEN button.
  console.log("Extracting envelope (pre-open) metrics...");
  const envelope = await page.evaluate(() => {
    function computed(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        rect: { width: Math.round(rect.width), height: Math.round(rect.height) },
        position: cs.position,
        zIndex: cs.zIndex,
        transform: cs.transform,
        transition: cs.transition,
        animationName: cs.animationName,
        animationDuration: cs.animationDuration,
        animationTimingFunction: cs.animationTimingFunction,
        opacity: cs.opacity,
        borderRadius: cs.borderRadius,
        background: cs.backgroundColor,
        backdropFilter: cs.backdropFilter,
        boxShadow: cs.boxShadow,
        border: cs.border,
      };
    }
    const openBtn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.includes("OPEN"));
    // The full-bleed cover is the nearest fixed/absolute-positioned ancestor
    // of the OPEN button (mirrors how EnvelopeCover.tsx nests button inside
    // the cover div).
    let cover = openBtn ? openBtn.parentElement : null;
    while (cover && !["fixed", "absolute"].includes(getComputedStyle(cover).position)) {
      cover = cover.parentElement;
    }
    return {
      found: Boolean(openBtn),
      cover: computed(cover),
      openButton: computed(openBtn),
    };
  });
  console.log("Envelope metrics:", JSON.stringify(envelope, null, 2));

  // Open the envelope if present — the guest-facing content is mounted
  // underneath it the whole time, so opening it just reveals what's
  // already there rather than triggering new content to load.
  const openedEnvelope = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent.includes("OPEN"));
    if (btn) {
      btn.click();
      return true;
    }
    return false;
  });
  console.log("Envelope opened:", openedEnvelope);
  await sleep(800);

  // Smooth scroll top -> bottom in small steps so every whileInView
  // scroll-reveal actually triggers (matches how a real guest scrolls),
  // instead of jumping straight to the final scrollHeight.
  console.log("Scrolling through the page...");
  await page.evaluate(async () => {
    const step = 200;
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    let last = -1;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await delay(120);
      if (document.body.scrollHeight === last) break;
      last = document.body.scrollHeight;
    }
    window.scrollTo(0, document.body.scrollHeight);
    await delay(300);
  });
  await sleep(500);

  console.log("Extracting computed styles...");
  const extracted = await page.evaluate(() => {
    function styleOf(el) {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        text: el.textContent.trim().slice(0, 40),
        tag: el.tagName,
        rect: { width: Math.round(rect.width), height: Math.round(rect.height) },
        borderRadius: cs.borderRadius,
        padding: cs.padding,
        margin: cs.margin,
        gap: cs.gap,
        background: cs.backgroundColor,
        backdropFilter: cs.backdropFilter,
        border: cs.border,
        boxShadow: cs.boxShadow,
        color: cs.color,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        fontFamily: cs.fontFamily,
      };
    }

    function findByText(text, exact = true) {
      return Array.from(document.querySelectorAll("*")).find((el) => {
        const t = el.textContent.trim();
        return el.children.length === 0 && (exact ? t === text : t.includes(text));
      });
    }

    // Walk up from a text node to the first ancestor that actually has a
    // background/blur/border of its own (the glass card), rather than
    // relying on a specific class name substring which can vary.
    function closestCard(el) {
      let node = el ? el.parentElement : null;
      for (let i = 0; i < 8 && node; i++) {
        const cs = getComputedStyle(node);
        if (cs.backdropFilter !== "none" || /rgba?\([^)]*,\s*0\.[0-9]+\)/.test(cs.backgroundColor)) {
          return node;
        }
        node = node.parentElement;
      }
      return null;
    }

    const result = {};

    // Column + page-level containers
    const column = document.querySelector('[class*="max-w-[393px]"]');
    result.column = styleOf(column);

    // Content wrapper's own vertical-rhythm mechanism (space-y via child
    // margin-top, or a flex/grid gap) — read directly off whichever
    // wrapper element is the parent of the outermost cards, rather than
    // assumed from a class name.
    const heroLikeEl = findByText("يتــشرفـــون", false) || findByText("يتشرفون", false);
    const contentWrapper = heroLikeEl ? heroLikeEl.closest("[class*='space-y'], [class*='gap-']") : null;
    result.contentWrapper = contentWrapper
      ? {
          display: getComputedStyle(contentWrapper).display,
          gap: getComputedStyle(contentWrapper).gap,
          rowGap: getComputedStyle(contentWrapper).rowGap,
          className: contentWrapper.className,
        }
      : null;

    // Hero
    result.heroTitle = styleOf(findByText("حـفـل زفـاف") || findByText("حفل زفاف"));
    result.heroDate = findByText("السبت، 19 ديسمبر", false) ? styleOf(findByText("السبت، 19 ديسمبر", false)) : null;

    // Invitation text card
    const invitationText = findByText("يتــشرفـــون", false) || findByText("يتشرفون", false);
    result.invitationTextEl = styleOf(invitationText);
    result.invitationCard = styleOf(closestCard(invitationText));

    // Countdown chip (any unit card, e.g. "أيام")
    const daysLabel = findByText("أيام");
    result.countdownLabel = styleOf(daysLabel);
    result.countdownChip = styleOf(daysLabel ? daysLabel.closest("div") : null);

    // Program timeline
    const programHeading = findByText("برنامج المناسبة") || findByText("برنامج الحفل");
    result.programHeading = styleOf(programHeading);
    result.programCard = styleOf(closestCard(programHeading));
    const dot = programHeading
      ? Array.from(closestCard(programHeading)?.querySelectorAll("span, div") ?? []).find((el) => {
          const r = el.getBoundingClientRect();
          return getComputedStyle(el).position === "absolute" && r.width > 0 && r.width < 8;
        })
      : null;
    result.timelineDot = dot
      ? {
          width: dot.getBoundingClientRect().width,
          height: dot.getBoundingClientRect().height,
          background: getComputedStyle(dot).backgroundColor,
        }
      : null;

    // Rules
    const rulesHeading = findByText("تفاصيل الحفل");
    result.rulesHeading = styleOf(rulesHeading);
    result.rulesCard = styleOf(closestCard(rulesHeading));

    // Gallery
    const galleryHeading = findByText("لحظات من الحفل");
    result.galleryHeading = styleOf(galleryHeading);
    const galleryGrid = galleryHeading ? galleryHeading.parentElement.querySelector(".grid") : null;
    result.galleryGrid = galleryGrid
      ? {
          display: getComputedStyle(galleryGrid).display,
          gap: getComputedStyle(galleryGrid).gap,
          gridTemplateColumns: getComputedStyle(galleryGrid).gridTemplateColumns,
        }
      : null;
    const galleryImgWrap = galleryGrid ? galleryGrid.querySelector("img")?.parentElement : null;
    result.galleryImageWrap = galleryImgWrap
      ? {
          borderRadius: getComputedStyle(galleryImgWrap).borderRadius,
          backdropFilter: getComputedStyle(galleryImgWrap).backdropFilter,
          background: getComputedStyle(galleryImgWrap).backgroundColor,
          className: galleryImgWrap.className,
        }
      : null;

    // Body/root wrapper classes (checking for things like "notranslate") and
    // any real asset URLs actually referenced by the page (img src or CSS
    // background-image), rather than assuming a specific CDN host.
    result.bodyClassName = document.body.className;
    result.rootWrapperClassName = document.querySelector('[class*="max-w-[393px]"]')?.parentElement?.className ?? null;
    const assetUrls = new Set();
    document.querySelectorAll("img[src]").forEach((img) => assetUrls.add(img.src));
    document.querySelectorAll("*").forEach((el) => {
      const bg = getComputedStyle(el).backgroundImage;
      const match = bg && bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (match) assetUrls.add(match[1]);
    });
    result.assetUrls = Array.from(assetUrls).slice(0, 10);

    // Snowfall particle container — position/z-index of the wrapper itself,
    // not just the individual particle spans.
    const firstParticleSpan = Array.from(document.querySelectorAll("span, div")).find((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.position === "absolute" && r.width > 0 && r.width < 8 && r.height < 8;
    });
    let snowWrapper = firstParticleSpan ? firstParticleSpan.parentElement : null;
    result.snowfallWrapper = snowWrapper
      ? {
          position: getComputedStyle(snowWrapper).position,
          zIndex: getComputedStyle(snowWrapper).zIndex,
          className: snowWrapper.className,
        }
      : null;

    // Attendee count + wishes
    const attendeeLabel = findByText("عدد الحضور");
    result.attendeeLabel = styleOf(attendeeLabel);
    let attendeeSection = attendeeLabel ? attendeeLabel.parentElement : null;
    for (let i = 0; i < 4 && attendeeSection; i++) {
      if (/^\d+$/.test(attendeeSection.textContent.trim())) break;
      attendeeSection = attendeeSection.parentElement;
    }
    const countEl = attendeeSection
      ? Array.from(attendeeSection.querySelectorAll("*")).find(
          (el) => el.children.length === 0 && /^\d+$/.test(el.textContent.trim())
        )
      : null;
    result.attendeeCount = styleOf(countEl);
    const wishesHeading = findByText("التهاني");
    result.wishesHeading = styleOf(wishesHeading);
    const wishEl = findByText('"Heart"', false) || findByText("Heart", false);
    result.wishChip = styleOf(wishEl ? wishEl.closest("div") : null);

    // Footer
    const footerHeading = findByText("Made by Numinds");
    result.footer = styleOf(footerHeading);

    // Bottom nav
    const navBtn = Array.from(document.querySelectorAll("button")).find((b) => {
      const t = b.textContent;
      return t.includes("موسيقى") || t.includes("تواصل") || t.includes("الموقع") || t.includes("تأكيد الحضور");
    });
    let nav = navBtn ? navBtn.parentElement : null;
    while (nav && getComputedStyle(nav).position !== "fixed") nav = nav.parentElement;
    result.bottomNav = nav
      ? {
          rect: { width: nav.getBoundingClientRect().width, height: nav.getBoundingClientRect().height },
          borderRadius: getComputedStyle(nav).borderRadius,
          background: getComputedStyle(nav).backgroundColor,
          backdropFilter: getComputedStyle(nav).backdropFilter,
          boxShadow: getComputedStyle(nav).boxShadow,
          bottom: getComputedStyle(nav).bottom,
          className: nav.className,
        }
      : null;

    // Section vertical rhythm — gap between consecutive KNOWN card
    // sections (found by heading text above, not by blindly walking
    // column.children, which mixes in large multi-section wrapper
    // elements and produces meaningless deltas). Uses offsetTop (document-
    // absolute) so the numbers are scroll-position-independent.
    function docTop(el) {
      let top = 0;
      let node = el;
      while (node) {
        top += node.offsetTop || 0;
        node = node.offsetParent;
      }
      return top;
    }
    function docBottom(el) {
      return docTop(el) + el.offsetHeight;
    }
    // Find every glass-card DIV directly (backdrop-filter set + a
    // translucent rgba background), rather than walking up from specific
    // headings — sidesteps cases where that walk gives up before reaching
    // the real card. Dedupe nested matches (keep only outermost of any
    // ancestor/descendant pair).
    const allCards = Array.from(document.querySelectorAll("div")).filter((el) => {
      const cs = getComputedStyle(el);
      return cs.backdropFilter !== "none" && /rgba?\([^)]*,\s*0\.0[5-9]|rgba?\([^)]*,\s*0\.1[0-9]\)/.test(cs.backgroundColor);
    });
    const outermostCards = allCards.filter((el) => !allCards.some((other) => other !== el && other.contains(el)));
    outermostCards.sort((a, b) => docTop(a) - docTop(b));
    result.cardCount = outermostCards.length;
    result.sectionGaps = outermostCards.slice(1).map((card, i) => ({
      gapPx: Math.round(docTop(card) - docBottom(outermostCards[i])),
      prevText: outermostCards[i].textContent.trim().slice(0, 20),
      text: card.textContent.trim().slice(0, 20),
    }));

    // Ambient particles
    const particles = Array.from(document.querySelectorAll("div, span")).filter((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.position === "absolute" && r.width > 0 && r.width < 8 && r.height < 8;
    });
    result.particles = {
      count: particles.length,
      sample: particles.slice(0, 3).map((p) => ({
        style: p.getAttribute("style"),
        animationName: getComputedStyle(p).animationName,
      })),
    };

    return result;
  });

  extracted.envelope = envelope;

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(extracted, null, 2), "utf-8");
  console.log("Saved extracted styles to", OUTPUT_PATH);

  await browser.close();
}

main().catch((error) => {
  console.error("Inspection failed:", error);
  process.exit(1);
});
