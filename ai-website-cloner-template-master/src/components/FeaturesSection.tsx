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

interface FeatureItem {
  id: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  title: string;
  description: string;
  badge?: string;
  accentRgb: string;
  video: string;
}

const LEFT_FEATURES: FeatureItem[] = [
  {
    id: "camera",
    icon: CameraIcon,
    title: "الكاميرا",
    badge: "NEW",
    accentRgb: "139, 92, 246",
    description: "يمكن للضيوف التقاط الصور مباشرة من الدعوة عبر الكاميرا المدمجة.",
    video: "/videos/features/camera.mp4",
  },
  {
    id: "music",
    icon: MusicIcon,
    title: "موسيقى",
    accentRgb: "200, 162, 74",
    description: "اضبط الأجواء المثالية بملف صوتي أو مقطوعة موسيقية مخصصة.",
    video: "/videos/features/music.mp4",
  },
  {
    id: "rsvp",
    icon: HeartIcon,
    title: "تأكيد الحضور",
    accentRgb: "225, 48, 108",
    description: "يؤكد الضيوف حضورهم مباشرة من الدعوة بلمسة واحدة.",
    video: "/videos/features/rsvp.mp4",
  },
];

const RIGHT_FEATURES: FeatureItem[] = [
  {
    id: "contact",
    icon: PhoneIcon,
    title: "تواصل",
    accentRgb: "37, 211, 102",
    description: "تواصل مع المضيف فوراً عبر الهاتف أو واتساب بلمسة واحدة.",
    video: "/videos/features/contact.mp4",
  },
  {
    id: "location",
    icon: MapPinIcon,
    title: "الموقع",
    accentRgb: "249, 115, 22",
    description: "خريطة Google Maps تفاعلية حتى لا يضيع الضيوف.",
    video: "/videos/features/location.mp4",
  },
  {
    id: "save-date",
    icon: CalendarIcon,
    title: "احفظ الموعد",
    accentRgb: "59, 130, 246",
    description: "حمّل الحدث على التقويم واضبط تذكيراً مباشرة من الدعوة.",
    video: "/videos/features/save-date.mp4",
  },
];

const ALL_FEATURES = [...LEFT_FEATURES, ...RIGHT_FEATURES];

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
        border: "1px solid rgba(0, 0, 0, 0.08)",
      };

  const iconBoxStyle: CSSProperties = active
    ? {
        background: `rgba(${item.accentRgb}, 0.1)`,
        boxShadow: `0 4px 16px rgba(${item.accentRgb}, 0.19)`,
      }
    : {
        background: "rgba(0, 0, 0, 0.04)",
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
        <span className="text-sm font-medium text-gray-800">{item.title}</span>
      </div>

      {active && (
        <p className={cn("text-xs text-gray-500", reverse ? "text-right pr-14" : "text-left pl-14")}>
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
      <div className="relative bg-white rounded-[2rem] overflow-hidden aspect-[9/19]">
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
  const [activeId, setActiveId] = useState<string>("rsvp");
  const activeFeature = ALL_FEATURES.find((item) => item.id === activeId) ?? ALL_FEATURES[0];

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
            المميزات
          </p>
          <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            كل ما تحتاجه
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm md:text-base">
            أنشئ دعوات رقمية احترافية بميزات قوية مصممة للاحتفالات العصرية.
          </p>
        </div>

        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
          <div className="flex flex-col gap-3">
            {LEFT_FEATURES.map((item) => (
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
            {RIGHT_FEATURES.map((item) => (
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
            {ALL_FEATURES.map((item) => (
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
