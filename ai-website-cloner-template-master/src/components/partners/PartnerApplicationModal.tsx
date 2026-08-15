"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  CheckIcon,
  FacebookIcon,
  GlobeIcon,
  InstagramIcon,
  TikTokIcon,
  UploadIcon,
  UserIcon,
  XIcon,
} from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { APPLICATION_COUNTRIES, PHONE_CODES } from "@/lib/partnersData";
import { submitPartnerApplication, uploadPartnerLogo } from "@/lib/services/partners.service";
import { ApiError } from "@/lib/api/client";
import type { PartnerCategory } from "@/types/partners";

const CLOSE_ANIMATION_MS = 180;

const BUSINESS_TYPES: PartnerCategory[] = ["eventPlanner", "photographer", "designer", "other"];

// Saudi Arabia is the site's primary market, so it's the sensible default
// dial code — looked up by name rather than array index since PHONE_CODES
// is sorted alphabetically.
const DEFAULT_PHONE_CODE =
  PHONE_CODES.find((entry) => entry.country === "Saudi Arabia")?.code ?? PHONE_CODES[0].code;

// "+" followed by 1-4 digits, no leading zero — covers every real-world
// country calling code (e.g. +1, +20, +966, +1876).
const DIAL_CODE_PATTERN = /^\+[1-9]\d{0,3}$/;

function getDialCodeError(value: string, message: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null; // emptiness is handled by the field's `required`
  return DIAL_CODE_PATTERN.test(trimmed) ? null : message;
}

type SocialPlatform = "instagram" | "tiktok" | "facebook" | "website";
const SOCIAL_PLATFORMS: SocialPlatform[] = ["instagram", "tiktok", "facebook", "website"];
const SOCIAL_ICONS: Record<SocialPlatform, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
  website: GlobeIcon,
};

const COPY = {
  ar: {
    title: "طلب الشراكة",
    subtitle: "أدخل بيانات نشاطك التجاري",
    close: "إغلاق",
    logoLabel: "شعار النشاط التجاري",
    logoHint: "الصورة المربعة هي الأنسب",
    uploadCta: "رفع الشعار",
    uploadTitle: "اختر شعارك",
    uploadHint: "JPG أو PNG · بحد أقصى 5 ميجابايت",
    uploadSize: "المقاس الأنسب: 400×400 بكسل (مربع)",
    personalInfo: "المعلومات الشخصية",
    fullName: "الاسم الكامل *",
    fullNamePlaceholder: "اسمك الكامل",
    email: "البريد الإلكتروني *",
    emailPlaceholder: "you@example.com",
    businessInfo: "معلومات النشاط التجاري",
    businessName: "اسم النشاط التجاري *",
    businessNamePlaceholder: "اسم نشاطك التجاري",
    businessType: "نوع النشاط التجاري *",
    otherBusinessTypePlaceholder: "صف نوع نشاطك التجاري...",
    locationContact: "الموقع والتواصل",
    country: "الدولة *",
    selectCountry: "اختر الدولة",
    whatsapp: "رقم واتساب *",
    whatsappPlaceholder: "5XXXXXXXX",
    dialCodeError: "أدخل رمز اتصال صالح، مثال: ‎+970",
    socialMedia: "وسائل التواصل الاجتماعي",
    socialHint: "أضف رابطاً واحداً على الأقل",
    linkPlaceholder: "الرابط أو المعرّف",
    description: "نبذة مختصرة",
    descriptionHint: "اختياري — حدّثنا عن عملك",
    descriptionPlaceholder: "أخبرنا عن نشاطك التجاري وخدماتك وما يميزك...",
    submit: "🤝 إرسال الطلب",
    submitting: "جارٍ الإرسال...",
    submitError: "تعذّر إرسال الطلب. حاول مرة أخرى.",
    reviewNote: "سنراجع جميع الطلبات خلال 24 ساعة",
    successTitle: "تم إرسال طلبك!",
    successBody: "شكراً لتقديم طلبك. سيقوم فريقنا بمراجعته والتواصل معك خلال 24 ساعة.",
    successClose: "إغلاق",
    businessTypes: { eventPlanner: "🎪 منظم مناسبات", photographer: "📸 مصور", designer: "🎨 مصمم", other: "✨ أخرى" },
    socials: { instagram: "إنستغرام", tiktok: "تيك توك", facebook: "فيسبوك", website: "الموقع الإلكتروني" },
    authRequiredTitle: "سجّل الدخول أولاً",
    authRequiredBody: "بما إنك بتقدر تدير ملف شراكتك لاحقاً (تعديل الشعار والبيانات ومتابعة كود الخصم)، لازم يكون عندك حساب على الموقع قبل تقديم الطلب.",
    loginCta: "تسجيل الدخول",
    signupCta: "إنشاء حساب",
  },
  en: {
    title: "Partner Application",
    subtitle: "Fill in your business details",
    close: "Close",
    logoLabel: "Business Logo",
    logoHint: "Square image works best",
    uploadCta: "Upload",
    uploadTitle: "Upload your logo",
    uploadHint: "JPG or PNG · Max 5MB",
    uploadSize: "Best size: 400 × 400 px (square)",
    personalInfo: "Personal Info",
    fullName: "Full Name *",
    fullNamePlaceholder: "Your full name",
    email: "Email *",
    emailPlaceholder: "you@example.com",
    businessInfo: "Business Info",
    businessName: "Business Name *",
    businessNamePlaceholder: "Your business name",
    businessType: "Type of Business *",
    otherBusinessTypePlaceholder: "Please describe your business type...",
    locationContact: "Location & Contact",
    country: "Country *",
    selectCountry: "Select Country",
    whatsapp: "Whatsapp Number *",
    whatsappPlaceholder: "5XXXXXXXX",
    dialCodeError: "Enter a valid dial code, e.g. +970",
    socialMedia: "Social Media",
    socialHint: "Add at least one link",
    linkPlaceholder: "Link or username",
    description: "Short Description",
    descriptionHint: "Optional — tell us about your work",
    descriptionPlaceholder: "Tell us about your business, services, and what makes you unique...",
    submit: "🤝 Submit Application",
    submitting: "Submitting...",
    submitError: "Couldn't submit your application. Please try again.",
    reviewNote: "We review all applications within 24 hours",
    successTitle: "Application sent!",
    successBody: "Thanks for applying. Our team will review it and reach out within 24 hours.",
    successClose: "Close",
    businessTypes: { eventPlanner: "🎪 Event Planner", photographer: "📸 Photographer", designer: "🎨 Designer", other: "✨ Other" },
    socials: { instagram: "Instagram", tiktok: "TikTok", facebook: "Facebook", website: "Website" },
    authRequiredTitle: "Sign in first",
    authRequiredBody: "You'll be able to manage your partner profile later (edit your logo, details, and track your discount code), so you need an account before applying.",
    loginCta: "Log in",
    signupCta: "Create account",
  },
};

const EMPTY_SOCIAL_LINKS: Record<SocialPlatform, string> = { instagram: "", tiktok: "", facebook: "", website: "" };

function fieldClass(extra?: string) {
  return cn(
    "w-full rounded-xl border border-border px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-[#C8A24A]",
    extra
  );
}

export function PartnerApplicationModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { language, dir } = useLanguage();
  const t = COPY[language];
  const { user, loading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mounted, setMounted] = useState(open);
  const [closing, setClosing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState<PartnerCategory | null>(null);
  const [otherBusinessType, setOtherBusinessType] = useState("");
  const [country, setCountry] = useState("");
  const [phoneCode, setPhoneCode] = useState(DEFAULT_PHONE_CODE);
  const [whatsapp, setWhatsapp] = useState("");
  const [activeSocials, setActiveSocials] = useState<Record<SocialPlatform, boolean>>({
    instagram: false,
    tiktok: false,
    facebook: false,
    website: false,
  });
  const [socialLinks, setSocialLinks] = useState(EMPTY_SOCIAL_LINKS);
  const [description, setDescription] = useState("");

  function resetForm() {
    setLogoPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setLogoFile(null);
    setFullName("");
    setEmail("");
    setBusinessName("");
    setBusinessType(null);
    setOtherBusinessType("");
    setCountry("");
    setPhoneCode(DEFAULT_PHONE_CODE);
    setWhatsapp("");
    setActiveSocials({ instagram: false, tiktok: false, facebook: false, website: false });
    setSocialLinks(EMPTY_SOCIAL_LINKS);
    setDescription("");
    setSubmitted(false);
  }

  function requestClose() {
    setClosing(true);
    window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
      resetForm();
    }, CLOSE_ANIMATION_MS);
  }

  useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      if (user) {
        setFullName(user.displayName);
        setEmail(user.email);
      }
    } else if (mounted) {
      requestClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!mounted) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [mounted, onClose]);

  if (!mounted) return null;

  const phoneCodeError = getDialCodeError(phoneCode, t.dialCodeError);
  const matchedPhoneEntry = PHONE_CODES.find((entry) => entry.code === phoneCode.trim());

  function handleCountryChange(name: string) {
    setCountry(name);
    // Auto-sync the dial code to match — the shopper can still edit it
    // manually afterward if it's wrong for their case.
    const match = PHONE_CODES.find((entry) => entry.country === name);
    if (match) setPhoneCode(match.code);
  }

  function handleLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return URL.createObjectURL(file);
    });
  }

  function handleBusinessTypeSelect(type: PartnerCategory) {
    setBusinessType(type);
    if (type !== "other") setOtherBusinessType("");
  }

  function toggleSocial(platform: SocialPlatform) {
    setActiveSocials((current) => ({ ...current, [platform]: !current[platform] }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (phoneCodeError || !businessType) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const activeLinks = SOCIAL_PLATFORMS.filter((platform) => activeSocials[platform] && socialLinks[platform].trim());
      const logoUrl = logoFile ? (await uploadPartnerLogo(logoFile)).url : null;
      await submitPartnerApplication({
        businessName,
        applicantName: fullName,
        email,
        category: businessType,
        country,
        countryFlag: matchedPhoneEntry?.flag ?? "",
        whatsapp: `${phoneCode}${whatsapp}`,
        // The free-text "other" business type has no dedicated field on the
        // backend — folded into the tagline so it isn't silently dropped.
        tagline: [businessType === "other" ? otherBusinessType : null, description.trim() || null]
          .filter(Boolean)
          .join(" — ") || null,
        instagramUrl: activeLinks.includes("instagram") ? socialLinks.instagram.trim() : null,
        tikTokUrl: activeLinks.includes("tiktok") ? socialLinks.tiktok.trim() : null,
        facebookUrl: activeLinks.includes("facebook") ? socialLinks.facebook.trim() : null,
        websiteUrl: activeLinks.includes("website") ? socialLinks.website.trim() : null,
        logoUrl,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof ApiError ? error.message : t.submitError);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t.title}
      dir={dir}
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4",
        closing ? "animate-out fade-out duration-150" : "animate-in fade-in duration-200"
      )}
      onClick={onClose}
    >
      <div
        className={cn(
          "relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-y-auto rounded-2xl bg-background shadow-2xl",
          closing ? "animate-out fade-out zoom-out-95 duration-150" : "animate-in fade-in zoom-in-95 duration-200"
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {authLoading ? (
          <div className="flex items-center justify-center px-8 py-24">
            <span className="size-6 animate-spin rounded-full border-2 border-border border-t-[#C8A24A]" />
          </div>
        ) : !user ? (
          <div className="flex flex-col items-center gap-4 px-8 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-[#C8A24A]/10 text-[#C8A24A]">
              <UserIcon className="size-7" />
            </span>
            <h2 className="font-cinzel text-2xl font-bold text-foreground">{t.authRequiredTitle}</h2>
            <p className="max-w-sm text-sm text-body-foreground">{t.authRequiredBody}</p>
            <div className="mt-2 flex items-center gap-3">
              <Link
                href="/login"
                onClick={onClose}
                className="rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg"
              >
                {t.loginCta}
              </Link>
              <Link
                href="/signup"
                onClick={onClose}
                className="rounded-xl border border-border px-6 py-2.5 text-sm font-medium text-body-foreground transition-colors hover:border-border"
              >
                {t.signupCta}
              </Link>
            </div>
          </div>
        ) : submitted ? (
          <div className="flex flex-col items-center gap-4 px-8 py-14 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckIcon className="size-7" />
            </span>
            <h2 className="font-cinzel text-2xl font-bold text-foreground">{t.successTitle}</h2>
            <p className="max-w-sm text-sm text-body-foreground">{t.successBody}</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] px-8 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:shadow-lg"
            >
              {t.successClose}
            </button>
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-10 flex shrink-0 items-start justify-between gap-3 rounded-t-2xl border-b border-border bg-background px-6 pb-5 pt-6">
              <div>
                <h2 className="font-cinzel text-xl font-bold text-foreground">{t.title}</h2>
                <p className="text-sm text-muted-foreground">{t.subtitle}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t.close}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-muted hover:text-body-foreground"
              >
                <XIcon className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
              {/* Business Logo */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t.logoLabel}
                  </label>
                  <span className="text-xs text-gray-400">{t.logoHint}</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex w-full items-center gap-4 rounded-xl border border-dashed border-border p-4 text-start transition-colors hover:border-[#C8A24A] hover:bg-[#C8A24A]/5"
                >
                  <span className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted">
                    {logoPreview ? (
                      <Image src={logoPreview} alt="" width={64} height={64} className="size-16 object-cover" unoptimized />
                    ) : (
                      <UploadIcon className="size-6 text-gray-400" />
                    )}
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-body-foreground">
                      {logoPreview ? t.uploadCta : t.uploadTitle}
                    </span>
                    <span className="block text-xs text-gray-400">{t.uploadHint}</span>
                    <span className="block text-xs text-gray-400">{t.uploadSize}</span>
                  </span>
                </button>
              </div>

              {/* Personal Info */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.personalInfo}</p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm text-body-foreground">{t.fullName}</label>
                    <input
                      required
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      placeholder={t.fullNamePlaceholder}
                      className={fieldClass()}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-body-foreground">{t.email}</label>
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={t.emailPlaceholder}
                      dir="ltr"
                      className={fieldClass("text-left")}
                    />
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.businessInfo}</p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm text-body-foreground">{t.businessName}</label>
                    <input
                      required
                      value={businessName}
                      onChange={(event) => setBusinessName(event.target.value)}
                      placeholder={t.businessNamePlaceholder}
                      className={fieldClass()}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-body-foreground">{t.businessType}</label>
                    <div className="grid grid-cols-2 gap-2">
                      {BUSINESS_TYPES.map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => handleBusinessTypeSelect(type)}
                          className={cn(
                            "rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors",
                            businessType === type
                              ? "border-[#C8A24A] bg-[#C8A24A]/10 text-[#A68832]"
                              : "border-border text-body-foreground hover:border-border"
                          )}
                        >
                          {t.businessTypes[type]}
                        </button>
                      ))}
                    </div>
                    {businessType === "other" && (
                      <input
                        required
                        value={otherBusinessType}
                        onChange={(event) => setOtherBusinessType(event.target.value)}
                        placeholder={t.otherBusinessTypePlaceholder}
                        className={fieldClass("mt-2 animate-in fade-in slide-in-from-top-1 duration-200")}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Location & Contact */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.locationContact}</p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1.5 block text-sm text-body-foreground">{t.country}</label>
                    <select
                      required
                      value={country}
                      onChange={(event) => handleCountryChange(event.target.value)}
                      className={fieldClass()}
                    >
                      <option value="" disabled>
                        {t.selectCountry}
                      </option>
                      {APPLICATION_COUNTRIES.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm text-body-foreground">{t.whatsapp}</label>
                    <div className="flex gap-2">
                      <div
                        className={cn(
                          "flex w-[104px] shrink-0 items-center gap-1.5 rounded-xl border px-2.5 py-2.5 transition-colors",
                          phoneCodeError
                            ? "border-red-400"
                            : "border-border focus-within:border-[#C8A24A]"
                        )}
                      >
                        <span className="shrink-0 text-sm" aria-hidden="true">
                          {matchedPhoneEntry ? matchedPhoneEntry.flag : "🌐"}
                        </span>
                        <input
                          required
                          value={phoneCode}
                          onChange={(event) => setPhoneCode(event.target.value)}
                          dir="ltr"
                          inputMode="tel"
                          aria-invalid={!!phoneCodeError}
                          placeholder="+966"
                          className="w-full min-w-0 bg-transparent text-sm text-foreground outline-none"
                        />
                      </div>
                      <input
                        required
                        type="tel"
                        value={whatsapp}
                        onChange={(event) => setWhatsapp(event.target.value)}
                        placeholder={t.whatsappPlaceholder}
                        dir="ltr"
                        className={fieldClass("text-left")}
                      />
                    </div>
                    {phoneCodeError ? (
                      <p className="mt-1.5 text-xs text-red-500">{phoneCodeError}</p>
                    ) : (
                      matchedPhoneEntry && (
                        <p className="mt-1.5 text-xs text-gray-400" dir="ltr">
                          {matchedPhoneEntry.iso} {matchedPhoneEntry.code}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.socialMedia}</p>
                  <span className="text-xs text-gray-400">{t.socialHint}</span>
                </div>
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
                              active ? "bg-[#C8A24A]" : "bg-gray-200"
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
                            onChange={(event) =>
                              setSocialLinks((current) => ({ ...current, [platform]: event.target.value }))
                            }
                            placeholder={t.linkPlaceholder}
                            dir="ltr"
                            className={cn(fieldClass("text-left mt-2.5 animate-in fade-in slide-in-from-top-1 duration-200"))}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Short Description */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.description}</label>
                  <span className="text-xs text-gray-400">{t.descriptionHint}</span>
                </div>
                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder={t.descriptionPlaceholder}
                  rows={3}
                  className={fieldClass("resize-none")}
                />
              </div>

              {submitError && <p className="text-center text-sm text-rose-500">{submitError}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.01] disabled:opacity-60"
              >
                {submitting ? t.submitting : t.submit}
              </button>
              <p className="text-center text-xs text-gray-400">{t.reviewNote}</p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
