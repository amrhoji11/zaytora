"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { formatUsd } from "@/lib/format";
import {
  CheckIcon,
  CopyIcon,
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  LoaderIcon,
  SaveIcon,
  TicketIcon,
  TikTokIcon,
  UploadIcon,
  WalletIcon,
} from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { getMyPartnerProfile, updateMyPartnerProfile, uploadPartnerLogo } from "@/lib/services/partners.service";
import { ApiError } from "@/lib/api/client";
import type { PartnerDto } from "@/types/api";

const CATEGORY_LABELS: Record<string, { ar: string; en: string }> = {
  eventPlanner: { ar: "منظم مناسبات", en: "Event Planner" },
  photographer: { ar: "مصور", en: "Photographer" },
  designer: { ar: "مصمم", en: "Designer" },
  other: { ar: "أخرى", en: "Other" },
};

type SocialPlatform = "instagram" | "tiktok" | "facebook" | "website";
const SOCIAL_PLATFORMS: SocialPlatform[] = ["instagram", "tiktok", "facebook", "website"];
const SOCIAL_ICONS: Record<SocialPlatform, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
  website: GlobeIcon,
};
const SOCIAL_URL_KEYS = {
  instagram: "instagramUrl",
  tiktok: "tikTokUrl",
  facebook: "facebookUrl",
  website: "websiteUrl",
} as const;

const COPY = {
  ar: {
    title: "ملف الشراكة",
    subtitle: "أدر بيانات نشاطك التجاري وتابع كود الخصم الخاص بك.",
    signInRequired: "يجب تسجيل الدخول لعرض ملف شراكتك.",
    signInCta: "تسجيل الدخول",
    noProfile: "لم تقدّم طلب شراكة بعد.",
    applyCta: "قدّم طلب شراكة",
    statusPendingTitle: "طلبك قيد المراجعة",
    statusPendingBody: "سنراجع طلبك ونتواصل معك خلال 24 ساعة. بمجرد الموافقة، بتقدر تدير ملفك من هون.",
    statusRejectedTitle: "تم رفض طلبك",
    statusRejectedBody: "للأسف تم رفض طلب الشراكة هذا. تواصل معنا لمعرفة السبب أو لإعادة التقديم.",
    logoLabel: "الشعار",
    changeLogo: "تغيير الشعار",
    businessName: "اسم النشاط التجاري",
    whatsapp: "رقم واتساب",
    tagline: "نبذة مختصرة",
    taglinePlaceholder: "أخبر زوارك عن نشاطك التجاري...",
    socialMedia: "وسائل التواصل الاجتماعي",
    linkPlaceholder: "الرابط أو المعرّف",
    save: "حفظ التغييرات",
    saved: "تم حفظ التغييرات بنجاح.",
    saveError: "تعذّر حفظ التغييرات. حاول مرة أخرى.",
    promoTitle: "كود الخصم الخاص بك",
    promoCode: "الكود",
    promoNotReady: "سيظهر كودك هنا بمجرد اعتماده من الإدارة.",
    discount: "نسبة الخصم",
    usage: "مرات الاستخدام",
    revenue: "إجمالي المبيعات المحققة عبر كودك",
    copied: "تم النسخ",
    category: "الفئة",
    email: "البريد الإلكتروني",
    loadError: "تعذّر تحميل ملف الشراكة.",
    socials: { instagram: "إنستغرام", tiktok: "تيك توك", facebook: "فيسبوك", website: "الموقع الإلكتروني" },
  },
  en: {
    title: "Partner Profile",
    subtitle: "Manage your business info and track your discount code.",
    signInRequired: "Sign in to view your partner profile.",
    signInCta: "Log in",
    noProfile: "You haven't submitted a partner application yet.",
    applyCta: "Apply for partnership",
    statusPendingTitle: "Your application is under review",
    statusPendingBody: "We'll review it and reach out within 24 hours. Once approved, you'll be able to manage your profile from here.",
    statusRejectedTitle: "Your application was rejected",
    statusRejectedBody: "Unfortunately this partner application was rejected. Contact us to learn why or to reapply.",
    logoLabel: "Logo",
    changeLogo: "Change logo",
    businessName: "Business name",
    whatsapp: "WhatsApp number",
    tagline: "Short description",
    taglinePlaceholder: "Tell visitors about your business...",
    socialMedia: "Social media",
    linkPlaceholder: "Link or username",
    save: "Save changes",
    saved: "Changes saved successfully.",
    saveError: "Couldn't save your changes. Please try again.",
    promoTitle: "Your discount code",
    promoCode: "Code",
    promoNotReady: "Your code will appear here once approved by our team.",
    discount: "Discount",
    usage: "Times used",
    revenue: "Total sales driven through your code",
    copied: "Copied",
    category: "Category",
    email: "Email",
    loadError: "Couldn't load your partner profile.",
    socials: { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", website: "Website" },
  },
};

const GLASS_CARD =
  "rounded-3xl border border-border bg-card/80 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md";

function fieldClass(extra?: string) {
  return cn(
    "w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold",
    extra
  );
}

function CopyableRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <button
        type="button"
        onClick={handleCopy}
        className="flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-gold"
        dir="ltr"
      >
        {value}
        {copied ? <CheckIcon className="size-3.5 text-emerald-700 dark:text-emerald-400" /> : <CopyIcon className="size-3.5 text-muted-foreground" />}
      </button>
    </div>
  );
}

export function PartnerProfileView() {
  const { language } = useLanguage();
  const t = COPY[language];
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [partner, setPartner] = useState<PartnerDto | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [tagline, setTagline] = useState("");
  const [activeSocials, setActiveSocials] = useState<Record<SocialPlatform, boolean>>({
    instagram: false,
    tiktok: false,
    facebook: false,
    website: false,
  });
  const [socialLinks, setSocialLinks] = useState<Record<SocialPlatform, string>>({
    instagram: "",
    tiktok: "",
    facebook: "",
    website: "",
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoUploading, setLogoUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    setLoadError(false);
    try {
      const data = await getMyPartnerProfile();
      setPartner(data);
      setBusinessName(data.businessName);
      setWhatsapp(data.whatsapp);
      setTagline(data.tagline ?? "");
      setLogoUrl(data.logoUrl ?? null);
      const active: Record<SocialPlatform, boolean> = { instagram: false, tiktok: false, facebook: false, website: false };
      const links: Record<SocialPlatform, string> = { instagram: "", tiktok: "", facebook: "", website: "" };
      for (const platform of SOCIAL_PLATFORMS) {
        const value = data[SOCIAL_URL_KEYS[platform]];
        if (value) {
          active[platform] = true;
          links[platform] = value;
        }
      }
      setActiveSocials(active);
      setSocialLinks(links);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setNotFound(true);
      } else {
        setLoadError(true);
        console.error("[dashboard/partner] failed to load profile:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) load();
    else setLoading(false);
  }, [user, load]);

  function toggleSocial(platform: SocialPlatform) {
    setActiveSocials((current) => ({ ...current, [platform]: !current[platform] }));
  }

  async function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      const { url } = await uploadPartnerLogo(file);
      setLogoUrl(url);
    } catch (error) {
      console.error("[dashboard/partner] failed to upload logo:", error);
    } finally {
      setLogoUploading(false);
    }
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaved(false);
    try {
      const activeLinks = SOCIAL_PLATFORMS.filter((platform) => activeSocials[platform] && socialLinks[platform].trim());
      const updated = await updateMyPartnerProfile({
        businessName,
        whatsapp,
        tagline: tagline.trim() || null,
        instagramUrl: activeLinks.includes("instagram") ? socialLinks.instagram.trim() : null,
        tikTokUrl: activeLinks.includes("tiktok") ? socialLinks.tiktok.trim() : null,
        facebookUrl: activeLinks.includes("facebook") ? socialLinks.facebook.trim() : null,
        websiteUrl: activeLinks.includes("website") ? socialLinks.website.trim() : null,
        logoUrl,
      });
      setPartner(updated);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      setSaveError(error instanceof ApiError ? error.message : t.saveError);
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background py-24">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">{t.signInRequired}</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-[0_4px_16px_rgba(200,162,74,0.35)] transition-colors hover:bg-gold/90"
        >
          {t.signInCta}
        </Link>
      </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md space-y-4 px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">{t.noProfile}</p>
        <Link
          href="/OurPartners"
          className="inline-flex items-center gap-1.5 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-white shadow-[0_4px_16px_rgba(200,162,74,0.35)] transition-colors hover:bg-gold/90"
        >
          {t.applyCta}
        </Link>
      </div>
      </div>
    );
  }

  if (loadError || !partner) {
    return (
      <p className="min-h-screen bg-background px-4 py-16 text-center text-sm text-rose-700 dark:text-rose-400">{t.loadError}</p>
    );
  }

  if (partner.status === "pending") {
    return (
      <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className={cn("space-y-2 p-6 text-center", GLASS_CARD)}>
          <h1 className="font-cinzel text-xl font-semibold text-foreground">{t.statusPendingTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.statusPendingBody}</p>
        </div>
      </div>
      </div>
    );
  }

  if (partner.status === "rejected") {
    return (
      <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-lg px-4 py-16">
        <div className={cn("space-y-2 p-6 text-center", GLASS_CARD)}>
          <h1 className="font-cinzel text-xl font-semibold text-foreground">{t.statusRejectedTitle}</h1>
          <p className="text-sm text-muted-foreground">{t.statusRejectedBody}</p>
        </div>
      </div>
      </div>
    );
  }

  // status === "approved"
  return (
    <div className="min-h-screen bg-background">
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div>
        <h1 className="font-cinzel text-2xl font-semibold text-foreground">{t.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Promo code / stats — read-only, admin-controlled */}
      <div className={cn("space-y-3 p-5", GLASS_CARD)}>
        <p className="text-sm font-semibold text-foreground">{t.promoTitle}</p>
        {partner.promoCode ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{t.category}</span>
              <span className="text-sm font-semibold text-foreground">
                {CATEGORY_LABELS[partner.category]?.[language] ?? partner.category}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <TicketIcon className="size-3.5 text-gold" />
                {t.email}
              </span>
              <span className="text-sm font-semibold text-foreground" dir="ltr">
                {partner.email}
              </span>
            </div>
            <div className="border-t border-white/10 pt-2">
              <CopyableRow label={t.promoCode} value={partner.promoCode} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{t.discount}</span>
              <span className="text-sm font-semibold text-foreground" dir="ltr">
                {partner.discountType === "fixed" ? `$${partner.discountValue}` : `${partner.discountValue}%`}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground">{t.usage}</span>
              <span className="text-sm font-semibold text-foreground" dir="ltr">
                {partner.usageCount}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <WalletIcon className="size-3.5 text-gold" />
                {t.revenue}
              </span>
              <span className="text-sm font-semibold text-gold" dir="ltr">
                {formatUsd(partner.revenueUsd)}
              </span>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{t.promoNotReady}</p>
        )}
      </div>

      {/* Editable business info */}
      <form onSubmit={handleSave} className={cn("space-y-5 p-5", GLASS_CARD)}>
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.logoLabel}</p>
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" onChange={handleLogoChange} className="hidden" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={logoUploading}
            className="flex items-center gap-4 rounded-xl border border-dashed border-border p-3 text-start transition-colors hover:border-gold hover:bg-gold/5 disabled:opacity-60"
          >
            <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-background/10">
              {logoUploading ? (
                <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
              ) : logoUrl ? (
                <Image src={logoUrl} alt="" width={64} height={64} className="size-16 object-cover" unoptimized />
              ) : (
                <UploadIcon className="size-6 text-muted-foreground" />
              )}
            </span>
            <span className="text-sm font-medium text-body-foreground">{t.changeLogo}</span>
          </button>
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-body-foreground">{t.businessName}</label>
          <input required value={businessName} onChange={(event) => setBusinessName(event.target.value)} className={fieldClass()} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-body-foreground">{t.whatsapp}</label>
          <input
            required
            type="tel"
            value={whatsapp}
            onChange={(event) => setWhatsapp(event.target.value)}
            dir="ltr"
            className={fieldClass("text-left")}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm text-body-foreground">{t.tagline}</label>
          <textarea
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
            placeholder={t.taglinePlaceholder}
            rows={3}
            className={fieldClass("resize-none")}
          />
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.socialMedia}</p>
          <div className="space-y-2">
            {SOCIAL_PLATFORMS.map((platform) => {
              const Icon = SOCIAL_ICONS[platform];
              const active = activeSocials[platform];
              return (
                <div key={platform} className="rounded-xl border border-border px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2.5 text-sm text-body-foreground">
                      <Icon className="size-4 text-muted-foreground" />
                      {t.socials[platform]}
                    </span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={active}
                      onClick={() => toggleSocial(platform)}
                      className={cn(
                        "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
                        active ? "bg-gold" : "bg-background/10"
                      )}
                    >
                      <span
                        className={cn(
                          "absolute top-0.5 size-4 rounded-full bg-background shadow transition-all duration-200",
                          active ? "start-[18px]" : "start-0.5"
                        )}
                      />
                    </button>
                  </div>
                  {active && (
                    <input
                      value={socialLinks[platform]}
                      onChange={(event) => setSocialLinks((current) => ({ ...current, [platform]: event.target.value }))}
                      placeholder={t.linkPlaceholder}
                      dir="ltr"
                      className={fieldClass("text-left mt-2.5")}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {saveError && <p className="text-sm text-rose-700 dark:text-rose-400">{saveError}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-xl bg-gold px-5 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg disabled:opacity-60"
          >
            {saving ? <LoaderIcon className="size-4 animate-spin" /> : <SaveIcon className="size-4" />}
            {t.save}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-emerald-700 dark:text-emerald-400">
              <CheckIcon className="size-4" />
              {t.saved}
            </span>
          )}
        </div>
      </form>
    </div>
    </div>
  );
}
