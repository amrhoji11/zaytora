import type { ComponentType } from "react";
import {
  CameraIcon,
  MusicIcon,
  HeartIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
} from "@/components/icons";

interface FeatureItem {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  badge?: string;
}

const LEFT_FEATURES: FeatureItem[] = [
  { icon: CameraIcon, title: "الكاميرا", badge: "NEW" },
  { icon: MusicIcon, title: "موسيقى" },
  {
    icon: HeartIcon,
    title: "تأكيد الحضور",
    description: "يؤكد الضيوف حضورهم مباشرة من الدعوة بلمسة واحدة.",
  },
];

const RIGHT_FEATURES: FeatureItem[] = [
  { icon: PhoneIcon, title: "تواصل" },
  { icon: MapPinIcon, title: "الموقع" },
  { icon: CalendarIcon, title: "احفظ الموعد" },
];

function FeatureRow({ item }: { item: FeatureItem }) {
  const Icon = item.icon;
  const row = (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0 w-10 h-10 rounded-xl bg-[#F5F0E8] flex items-center justify-center">
        <Icon className="w-5 h-5 text-[#C8A24A]" />
        {item.badge && (
          <span className="absolute -top-1 -right-1 bg-[#C8A24A] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase">
            {item.badge}
          </span>
        )}
      </div>
      <span className="text-sm font-medium text-gray-800">{item.title}</span>
    </div>
  );

  if (item.description) {
    return (
      <div className="bg-white rounded-2xl border border-[#C8A24A]/20 shadow-sm p-4">
        {row}
        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
      </div>
    );
  }

  return row;
}

function PhonePlaceholder() {
  return (
    <div className="bg-gray-900 rounded-[2rem] p-[3px] shadow-2xl w-32">
      <div className="relative bg-white rounded-[1.85rem] overflow-hidden aspect-[9/18]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F5F0E8] to-white" />
      </div>
    </div>
  );
}

export function FeaturesSection() {
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
              <FeatureRow key={item.title} item={item} />
            ))}
          </div>

          <div className="flex justify-center">
            <PhonePlaceholder />
          </div>

          <div className="flex flex-col gap-3">
            {RIGHT_FEATURES.map((item) => (
              <FeatureRow key={item.title} item={item} />
            ))}
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex flex-col gap-3">
          {[...LEFT_FEATURES, ...RIGHT_FEATURES].map((item) => (
            <FeatureRow key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
