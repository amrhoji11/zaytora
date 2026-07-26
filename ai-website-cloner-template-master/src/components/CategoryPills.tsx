import type { LucideIcon } from "lucide-react";
import {
  HeartIcon,
  GemIcon,
  LeafIcon,
  SparklesIcon,
  StarIcon,
  BabyIcon,
  GraduationCapIcon,
  CakeIcon,
} from "@/components/icons";

interface Category {
  label: string;
  icon: LucideIcon;
  color: string;
}

const categories: Category[] = [
  { label: "زفاف", icon: HeartIcon, color: "#C0627A" },
  { label: "خطوبة", icon: GemIcon, color: "#7B68C8" },
  { label: "حنه", icon: LeafIcon, color: "#4A9E6E" },
  { label: "حفلة العروس", icon: SparklesIcon, color: "#C87AB0" },
  { label: "الكشف عن الجنس", icon: StarIcon, color: "#5AACE0" },
  { label: "مواليد", icon: BabyIcon, color: "#E08A4A" },
  { label: "تخرج", icon: GraduationCapIcon, color: "#A08040" },
  { label: "عيد ميلاد", icon: CakeIcon, color: "#E0604A" },
];

export function CategoryPills() {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {categories.map(({ label, icon: Icon, color }) => (
        <a key={label} href="#" className="flex flex-col items-center gap-2 group">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110"
            style={{ backgroundColor: "#F5F0E8" }}
          >
            <Icon size={24} style={{ color }} />
          </div>
          <span className="text-sm text-gray-700 text-center">{label}</span>
        </a>
      ))}
    </div>
  );
}
