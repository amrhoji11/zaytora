"use client";

import { useState } from "react";
import type { ComponentType, CSSProperties } from "react";
import { cn } from "@/lib/utils";
import {
  CameraIcon,
  MusicIcon,
  HeartIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
} from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";

interface FeatureItem {
  id: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  title: string;
  description: string;
  badge?: string;
  accentRgb: string;
  video: string;
}

const LEFT_FEATURE_META = [
  { id: "camera", icon: CameraIcon, badge: "NEW", accentRgb: "139, 92, 246", video: "/videos/features/camera.mp4" },
  { id: "music", icon: MusicIcon, accentRgb: "200, 162, 74", video: "/videos/features/music.mp4" },
  { id: "rsvp", icon: HeartIcon, accentRgb: "225, 48, 108", video: "/videos/features/rsvp.mp4" },
] as const;

const RIGHT_FEATURE_META = [
  { id: "contact", icon: PhoneIcon, accentRgb: "37, 211, 102", video: "/videos/features/contact.mp4" },
  { id: "location", icon: MapPinIcon, accentRgb: "249, 115, 22", video: "/videos/features/location.mp4" },
  { id: "save-date", icon: CalendarIcon, accentRgb: "59, 130, 246", video: "/videos/features/save-date.mp4" },
] as const;

const COPY = {
  ar: {
    eyebrow: "المميزات",
    heading: "كل ما تحتاجه",
    subheading: "أنشئ دعوات رقمية احترافية بميزات قوية مصممة للاحتفالات العصرية.",
    text: {
      camera: { title: "الكاميرا", description: "يمكن للضيوف التقاط الصور مباشرة من الدعوة عبر الكاميرا المدمجة." },
      music: { title: "موسيقى", description: "اضبط الأجواء المثالية بملف صوتي أو مقطوعة موسيقية مخصصة." },
      rsvp: { title: "تأكيد الحضور", description: "يؤكد الضيوف حضورهم مباشرة من الدعوة بلمسة واحدة." },
      contact: { title: "تواصل", description: "تواصل مع المضيف فوراً عبر الهاتف أو واتساب بلمسة واحدة." },
      location: { title: "الموقع", description: "خريطة Google Maps تفاعلية حتى لا يضيع الضيوف." },
      "save-date": { title: "احفظ الموعد", description: "حمّل الحدث على التقويم واضبط تذكيراً مباشرة من الدعوة." },
    },
  },
  en: {
    eyebrow: "Features",
    heading: "Everything you need",
    subheading: "Create professional digital invitations with powerful features designed for modern celebrations.",
    text: {
      camera: { title: "Camera", description: "Guests can take photos right from the invitation via the built-in camera." },
      music: { title: "Music", description: "Set the perfect mood with a custom audio track or song." },
      rsvp: { title: "RSVP", description: "Guests confirm their attendance directly from the invitation with one tap." },
      contact: { title: "Contact", description: "Reach the host instantly by phone or WhatsApp with one tap." },
      location: { title: "Location", description: "An interactive Google Maps view so guests never get lost." },
      "save-date": { title: "Save the Date", description: "Add the event to a calendar and set a reminder right from the invitation." },
    },
  },
} as const;

type FeatureTextKey = keyof (typeof COPY)["ar"]["text"];
type FeatureText = Record<FeatureTextKey, { title: string; description: string }>;

function buildFeatures(
  meta: readonly { id: FeatureTextKey; icon: ComponentType<{ className?: string; style?: CSSProperties }>; badge?: string; accentRgb: string; video: string }[],
  text: FeatureText
): FeatureItem[] {
  return meta.map((item) => ({ ...item, ...text[item.id] }));
}

function FeatureRow({
  item,
  active,
  reverse,
  onSelect,
}: {
  item: FeatureItem;
  active: boolean;
  reverse?: boolean;
  onSelect: () => void;
}) {
  const Icon = item.icon;

  const rowStyle: CSSProperties = active
    ? {
        background: `rgba(${item.accentRgb}, 0.063)`,
        border: `1px solid rgba(${item.accentRgb}, 0.19)`,
      }
    : {
        background: "transparent",
        border: "1px solid rgba(255, 255, 255, 0.08)",
      };

  const iconBoxStyle: CSSProperties = active
    ? {
        background: `rgba(${item.accentRgb}, 0.1)`,
        boxShadow: `0 4px 16px rgba(${item.accentRgb}, 0.19)`,
      }
    : {
        background: "rgba(255, 255, 255, 0.06)",
      };

  const iconStyle: CSSProperties = {
    color: active ? `rgb(${item.accentRgb})` : "rgb(153, 153, 153)",
  };

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      style={rowStyle}
      className="relative w-full flex flex-col gap-1 p-3 rounded-2xl transition-all duration-300 cursor-pointer"
    >
      <div className={cn("flex items-center gap-3", reverse ? "flex-row-reverse text-right" : "flex-row text-left")}>
        <div
          style={iconBoxStyle}
          className="relative shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300"
        >
          <Icon className="w-5 h-5" style={iconStyle} />
          {item.badge && (
            <span className="absolute -top-1 -right-1 bg-[#C8A24A] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase">
              {item.badge}
            </span>
          )}
        </div>
        <span className="text-sm font-medium text-foreground">{item.title}</span>
      </div>

      {active && (
        <p className={cn("text-xs text-muted-foreground", reverse ? "text-right pr-14" : "text-left pl-14")}>
          {item.description}
        </p>
      )}
    </button>
  );
}

function PhoneMock({ feature }: { feature: FeatureItem }) {
  return (
    <div className="relative bg-gray-900 rounded-[2.2rem] p-[3px] shadow-2xl w-56 md:w-64">
      <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-900 rounded-full z-20" />
      <div className="relative bg-background rounded-[2rem] overflow-hidden aspect-[9/19]">
        <video
          key={feature.id}
          src={feature.video}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const { language } = useLanguage();
  const t = COPY[language];
  const leftFeatures = buildFeatures(LEFT_FEATURE_META, t.text);
  const rightFeatures = buildFeatures(RIGHT_FEATURE_META, t.text);
  const allFeatures = [...leftFeatures, ...rightFeatures];

  const [activeId, setActiveId] = useState<string>("rsvp");
  const activeFeature = allFeatures.find((item) => item.id === activeId) ?? allFeatures[0];

  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
            {t.eyebrow}
          </p>
          <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-foreground mb-4">
            {t.heading}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
            {t.subheading}
          </p>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          <div className="flex flex-col gap-3">
            {leftFeatures.map((item) => (
              <FeatureRow
                key={item.id}
                item={item}
                active={item.id === activeId}
                reverse
                onSelect={() => setActiveId(item.id)}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <PhoneMock feature={activeFeature} />
          </div>

          <div className="flex flex-col gap-3">
            {rightFeatures.map((item) => (
              <FeatureRow
                key={item.id}
                item={item}
                active={item.id === activeId}
                onSelect={() => setActiveId(item.id)}
              />
            ))}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex flex-col gap-6">
          <div className="flex justify-center">
            <PhoneMock feature={activeFeature} />
          </div>
          <div className="flex flex-col gap-3">
            {allFeatures.map((item) => (
              <FeatureRow
                key={item.id}
                item={item}
                active={item.id === activeId}
                onSelect={() => setActiveId(item.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
