"use client";

import { useState } from "react";
import { cn, getInitials } from "@/lib/utils";
import {
  ChevronDownIcon,
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  TikTokIcon,
  WhatsAppIcon,
  CheckCircleIcon,
} from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";
import type { ApprovedPartnerDto, PartnerCategory } from "@/types/api";

const CATEGORY_COPY: Record<PartnerCategory, { ar: string; en: string; className: string }> = {
  eventPlanner: {
    ar: "منظم مناسبات",
    en: "Event Planner",
    className: "bg-violet-100 dark:bg-violet-950/50 text-violet-700 dark:text-violet-400",
  },
  photographer: {
    ar: "مصور",
    en: "Photographer",
    className: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400",
  },
  designer: {
    ar: "مصمم",
    en: "Designer",
    className: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400",
  },
  other: {
    ar: "أخرى",
    en: "Other",
    className: "bg-background/10 text-body-foreground",
  },
};

const COPY = {
  ar: { more: "المزيد", less: "أقل", verified: "شريك موثوق" },
  en: { more: "More", less: "Less", verified: "Verified" },
};

type SocialLink = {
  key: string;
  href: string;
  className: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

function buildSocialLinks(partner: ApprovedPartnerDto): SocialLink[] {
  const links: SocialLink[] = [];
  if (partner.whatsapp) {
    const digits = partner.whatsapp.replace(/[^\d]/g, "");
    links.push({ key: "whatsapp", href: `https://wa.me/${digits}`, className: "bg-[#25D366] text-white", Icon: WhatsAppIcon });
  }
  if (partner.tikTokUrl) {
    links.push({ key: "tiktok", href: partner.tikTokUrl, className: "bg-black text-white", Icon: TikTokIcon });
  }
  if (partner.instagramUrl) {
    links.push({
      key: "instagram",
      href: partner.instagramUrl,
      className: "bg-gradient-to-br from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white",
      Icon: InstagramIcon,
    });
  }
  if (partner.facebookUrl) {
    links.push({ key: "facebook", href: partner.facebookUrl, className: "bg-[#1877F2] text-white", Icon: FacebookIcon });
  }
  if (partner.websiteUrl) {
    links.push({ key: "website", href: partner.websiteUrl, className: "bg-gray-700 text-white", Icon: GlobeIcon });
  }
  return links;
}

export function PartnerCard({ partner }: { partner: ApprovedPartnerDto }) {
  const { language } = useLanguage();
  const t = COPY[language];
  const categoryMeta = CATEGORY_COPY[partner.category];
  const [expanded, setExpanded] = useState(false);
  // Falls back to the initials avatar if logoUrl 404s (e.g. an upload from
  // before the R2 migration whose file no longer exists) instead of a
  // broken-image icon — the same fallback already used when there's no
  // logoUrl at all.
  const [logoFailed, setLogoFailed] = useState(false);
  const socialLinks = buildSocialLinks(partner);

  return (
    <div className="relative pt-3">
      {partner.tagline && (
        <div className="absolute inset-x-3 -top-0 z-10 truncate rounded-full border border-[#C8A24A]/30 bg-card px-3 py-1 text-center text-[11px] text-muted-foreground shadow-sm">
          {partner.tagline}
        </div>
      )}

      <div className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-5 pt-7 transition-shadow duration-300 hover:shadow-lg">
        <span
          className={cn(
            "absolute top-3 end-3 rounded-full px-2.5 py-1 text-[11px] font-semibold",
            categoryMeta.className
          )}
        >
          {categoryMeta[language]}
        </span>

        <div className="flex items-center gap-3">
          {partner.logoUrl && !logoFailed ? (
            // eslint-disable-next-line @next/next/no-img-element -- cross-origin (API host), not worth next.config remotePatterns for a small avatar
            <img
              src={partner.logoUrl}
              alt=""
              onError={() => setLogoFailed(true)}
              className="size-14 shrink-0 rounded-xl object-cover"
            />
          ) : (
            <span className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#C8A24A] to-[#A68832] text-lg font-semibold text-white">
              {getInitials(partner.name)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate font-semibold text-foreground">{partner.name}</p>
            <p className="text-sm text-muted-foreground">
              {partner.countryFlag} {partner.country}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-3 flex items-center gap-1 self-start text-sm font-medium text-[#C8A24A] transition-colors hover:text-[#A68832]"
        >
          {expanded ? t.less : t.more}
          <ChevronDownIcon className={cn("size-3.5 transition-transform duration-200", expanded && "rotate-180")} />
        </button>

        {expanded && (
          <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200 space-y-3">
            <p className="text-sm leading-relaxed text-body-foreground">{partner.tagline ?? categoryMeta[language]}</p>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2.5">
                {socialLinks.map(({ key, href, className, Icon }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-150 hover:scale-110",
                      className
                    )}
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1.5 text-sm font-medium text-[#C8A24A]">
              <CheckCircleIcon className="size-4" />
              {t.verified}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
