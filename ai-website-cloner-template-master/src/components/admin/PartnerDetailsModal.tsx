"use client";

import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/format";
import {
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  MailIcon,
  MapPinIcon,
  TicketIcon,
  TikTokIcon,
  WalletIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/icons";
import type { PartnerDto } from "@/types/api";

const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  eventPlanner: { ar: "منظم مناسبات", en: "Event Planner" },
  photographer: { ar: "مصور", en: "Photographer" },
  designer: { ar: "مصمم", en: "Designer" },
  other: { ar: "أخرى", en: "Other" },
};

const SOCIAL_ICONS = { instagram: InstagramIcon, tiktok: TikTokIcon, facebook: FacebookIcon, website: GlobeIcon } as const;

const COPY = {
  ar: {
    title: "ملف الشريك",
    close: "إغلاق",
    contactEmail: "البريد الإلكتروني",
    whatsapp: "واتساب",
    country: "الدولة",
    joinedDate: "تاريخ الانضمام",
    socialLinks: "روابط التواصل الاجتماعي",
    noSocialLinks: "لم يتم إضافة روابط تواصل.",
    promoCode: "كود الشريك",
    usageCount: "مرات الاستخدام",
    totalEarnings: "إجمالي الأرباح المحققة",
    socials: { instagram: "إنستغرام", tiktok: "تيك توك", facebook: "فيسبوك", website: "الموقع الإلكتروني" },
  },
  en: {
    title: "Partner Profile",
    close: "Close",
    contactEmail: "Contact Email",
    whatsapp: "WhatsApp",
    country: "Country",
    joinedDate: "Joined Date",
    socialLinks: "Social Links",
    noSocialLinks: "No social links added.",
    promoCode: "Promo Code",
    usageCount: "Uses",
    totalEarnings: "Total Earnings Driven",
    socials: { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", website: "Website" },
  },
};

function formatDate(iso: string, language: "ar" | "en") {
  return new Date(iso).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-background px-3.5 py-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-card text-muted-foreground ring-1 ring-white/10">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}

const SOCIAL_URL_KEYS = {
  instagram: "instagramUrl",
  tiktok: "tikTokUrl",
  facebook: "facebookUrl",
  website: "websiteUrl",
} as const;

export function PartnerDetailsModal({
  partner,
  language,
  onClose,
}: {
  partner: PartnerDto | null;
  language: "ar" | "en";
  onClose: () => void;
}) {
  const t = COPY[language];
  if (!partner) return null;

  const socialEntries = (Object.keys(SOCIAL_ICONS) as (keyof typeof SOCIAL_ICONS)[]).filter(
    (key) => partner[SOCIAL_URL_KEYS[key]]
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[85vh] w-full max-w-md flex-col overflow-y-auto rounded-2xl bg-card shadow-2xl animate-in fade-in zoom-in-95 duration-200"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-border bg-card px-6 pb-4 pt-6">
          <div className="flex min-w-0 items-center gap-3">
            {partner.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- cross-origin (API host), not worth next.config remotePatterns for a small avatar
              <img src={partner.logoUrl} alt="" className="size-11 shrink-0 rounded-xl object-cover" />
            )}
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-foreground">{partner.businessName}</p>
              <p className="text-sm text-muted-foreground">
                {partner.applicantName} · {CATEGORY_LABELS[partner.category]?.[language] ?? partner.category}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={t.close}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/10 hover:text-foreground"
          >
            <XIcon className="size-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <InfoRow icon={MailIcon} label={t.contactEmail} value={<span dir="ltr">{partner.email}</span>} />
            <InfoRow icon={WhatsAppIcon} label={t.whatsapp} value={<span dir="ltr">{partner.whatsapp}</span>} />
            <InfoRow
              icon={MapPinIcon}
              label={t.country}
              value={
                <span>
                  {partner.countryFlag} {partner.country}
                </span>
              }
            />
            <InfoRow
              icon={TicketIcon}
              label={t.joinedDate}
              value={formatDate(partner.approvedAt ?? partner.submittedAt, language)}
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <InfoRow icon={TicketIcon} label={t.promoCode} value={<span dir="ltr">{partner.promoCode ?? "—"}</span>} />
            <InfoRow
              icon={WalletIcon}
              label={t.totalEarnings}
              value={<span dir="ltr">{formatUsd(partner.revenueUsd ?? 0)}</span>}
            />
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.socialLinks}</p>
            {socialEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.noSocialLinks}</p>
            ) : (
              <div className="space-y-2">
                {socialEntries.map((key) => {
                  const Icon = SOCIAL_ICONS[key];
                  return (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl border border-border px-3.5 py-2.5 text-sm text-body-foreground"
                      )}
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      <span className="shrink-0 text-muted-foreground">{t.socials[key]}</span>
                      <span className="truncate text-foreground" dir="ltr" title={partner[SOCIAL_URL_KEYS[key]] ?? undefined}>
                        {partner[SOCIAL_URL_KEYS[key]]}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
