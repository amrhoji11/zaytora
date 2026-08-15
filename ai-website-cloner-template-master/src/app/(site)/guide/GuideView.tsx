"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import {
  CardIcon,
  ClipboardListIcon,
  GemIcon,
  GlobeIcon,
  ImageIcon,
  LayoutGridIcon,
  MusicIcon,
  PlayIcon,
  QrCodeIcon,
  StudioIcon,
  TemplatesIcon,
  UsersIcon,
} from "@/components/icons";

const STEP_ICONS = [TemplatesIcon, StudioIcon, CardIcon, QrCodeIcon, UsersIcon];
const FEATURE_ICONS = [GlobeIcon, GemIcon, ImageIcon, MusicIcon, LayoutGridIcon, ClipboardListIcon];

const COPY = {
  ar: {
    eyebrow: "كيف يعمل",
    heading: "أنشئ دعوتك",
    headingAccent: "الرقمية المثالية",
    subheading: "اتبع هذه الخطوات البسيطة لإنشاء دعوة مذهلة لمناسبتك الخاصة.",
    steps: [
      {
        label: "الخطوة 01",
        title: "اختر القالب الخاص بك",
        body: "تصفح مجموعتنا من القوالب الفاخرة واختر ما يناسب أسلوبك وموضوع حدثك.",
      },
      {
        label: "الخطوة 02",
        title: "خصص دعوتك",
        body: "أدخل تفاصيل حدثك، وأضف الصور، وخصص الألوان، واجعلها فريدة من نوعها بمحررنا السهل.",
      },
      {
        label: "الخطوة 03",
        title: "معاينة ودفع",
        body: "راجع دعوتك في الوقت الفعلي، وأجرِ التعديلات، وأكمل الدفع للنشر.",
      },
      {
        label: "الخطوة 04",
        title: "شارك في كل مكان",
        body: "احصل على رابطك الفريد ورمز QR وصور المشاركة. أرسل عبر واتساب أو وسائل التواصل أو اطبع رمز QR.",
      },
      {
        label: "الخطوة 05",
        title: "اجمع الردود",
        body: "تتبع ردود الضيوف والتهاني في الوقت الفعلي من لوحة التحكم.",
      },
    ],
    featuresHeading: "ميزات قوية",
    featuresSubheading: "كل ما تحتاجه لإنشاء الدعوة المثالية.",
    features: [
      { title: "دعم ثنائي اللغة", body: "أنشئ دعوات بالإنجليزية أو العربية أو كلتيهما في آنٍ واحد." },
      { title: "قوالب فاخرة", body: "قوالب مصممة احترافياً بجماليات راقية." },
      { title: "خلفيات مخصصة", body: "خلفيات أقسام يتحكم بها المسؤول لعلامة تجارية متسقة." },
      { title: "تكامل الموسيقى", body: "أضف موسيقى خلفية عبر الرفع أو رابط يوتيوب." },
      { title: "دعم المعرض", body: "اعرض حتى 6 صور جميلة في دعوتك." },
      { title: "برنامج الحفل", body: "اعرض جدول أعمال حدثك مع مطابقة الأيقونات التلقائية." },
    ],
    ctaHeading: "هل أنت مستعد لإنشاء دعوتك؟",
    ctaSubheading: "ابدأ تصميم دعوتك الرقمية المثالية اليوم.",
    ctaButton: "ابدأ الإنشاء الآن",
  },
  en: {
    eyebrow: "How It Works",
    heading: "Create Your Perfect",
    headingAccent: "Digital Invitation",
    subheading: "Follow these simple steps to create a stunning invitation for your special event.",
    steps: [
      {
        label: "Step 01",
        title: "Choose Your Template",
        body: "Browse our collection of premium templates and select the one that matches your style and event theme.",
      },
      {
        label: "Step 02",
        title: "Customize Your Invitation",
        body: "Fill in your event details, add photos, customize colors, and make it uniquely yours with our easy-to-use editor.",
      },
      {
        label: "Step 03",
        title: "Preview & Pay",
        body: "Review your invitation in real-time, make adjustments, and complete payment to publish.",
      },
      {
        label: "Step 04",
        title: "Share Everywhere",
        body: "Get your unique link, QR code, and share images. Send via WhatsApp, social media, or print the QR code.",
      },
      {
        label: "Step 05",
        title: "Collect RSVPs",
        body: "Track guest responses and wishes in real-time from your dashboard.",
      },
    ],
    featuresHeading: "Powerful Features",
    featuresSubheading: "Everything you need to create the perfect invitation.",
    features: [
      { title: "Bilingual Support", body: "Create invitations in English, Arabic, or both languages simultaneously." },
      { title: "Premium Templates", body: "Professionally designed templates with luxury aesthetics." },
      { title: "Custom Backgrounds", body: "Admin-controlled section backgrounds for consistent branding." },
      { title: "Music Integration", body: "Add background music via upload or YouTube link." },
      { title: "Gallery Support", body: "Showcase up to 6 beautiful photos in your invitation." },
      { title: "Event Program", body: "Display your event schedule with automatic icon matching." },
    ],
    ctaHeading: "Ready to Create Your Invitation?",
    ctaSubheading: "Start designing your perfect digital invitation today.",
    ctaButton: "Start Creating Now",
  },
};

export function GuideView() {
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="px-4 pb-16 pt-20 text-center">
        <p className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#C8A24A]/30 bg-[#C8A24A]/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#C8A24A]">
          <PlayIcon className="size-3.5 fill-current" />
          {t.eyebrow}
        </p>
        <h1 className="font-cinzel text-4xl font-bold text-foreground md:text-5xl">
          {t.heading}
          <br />
          <span className="text-[#C8A24A]">{t.headingAccent}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-body-foreground">{t.subheading}</p>
      </section>

      {/* Steps */}
      <section className="px-4 pb-20">
        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {t.steps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            return (
              <div
                key={step.label}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-[#C8A24A]/10 text-[#C8A24A]">
                    <Icon className="size-5" />
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A24A]/70">
                    {step.label}
                  </span>
                </div>
                <h3 className="mb-2 font-cinzel text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-body-foreground">{step.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-black/15 px-4 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-cinzel text-3xl font-bold text-foreground md:text-4xl">{t.featuresHeading}</h2>
            <p className="mt-3 text-body-foreground">{t.featuresSubheading}</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index];
              return (
                <div key={feature.title} className="rounded-2xl border border-border bg-card p-6">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-xl bg-[#C8A24A]/10 text-[#C8A24A]">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm leading-relaxed text-body-foreground">{feature.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="relative mx-auto max-w-4xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#C8A24A] to-[#A68832] px-6 py-14 text-center text-white md:px-16">
          <div className="absolute -top-10 -start-10 size-72 rounded-full bg-background opacity-20 blur-3xl" />
          <div className="absolute -bottom-10 -end-10 size-72 rounded-full bg-background opacity-20 blur-3xl" />

          <div className="relative">
            <h2 className="mb-3 font-cinzel text-3xl font-bold md:text-4xl">{t.ctaHeading}</h2>
            <p className="mx-auto mb-8 max-w-lg text-white/85">{t.ctaSubheading}</p>
            <Link
              href="/studio"
              className="inline-flex items-center gap-2 rounded-xl bg-background px-8 py-3 text-sm font-semibold text-[#A68832] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
            >
              {t.ctaButton}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
