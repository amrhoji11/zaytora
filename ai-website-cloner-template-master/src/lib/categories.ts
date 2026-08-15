import type { LucideIcon } from "lucide-react";
import {
  HeartIcon,
  GemIcon,
  HandshakeIcon,
  LeafIcon,
  SparklesIcon,
  StarIcon,
  BabyIcon,
  GraduationCapIcon,
  CakeIcon,
} from "@/components/icons";

// Single source of truth for the 9 occasion categories — shared by the
// homepage category icons, the /templates filter tabs, and template data.
// Ids and order deliberately mirror the backend's Template.Category strings
// (see SeedTemplates.cs) and Step02Occasion.tsx's OCCASION_META, so a
// category id always maps to the same real templates everywhere instead of
// three subtly different category lists drifting apart.
export type CategoryId =
  | "wedding"
  | "engagement"
  | "marriage_contract"
  | "henna"
  | "bridal_shower"
  | "gender_reveal"
  | "aqeeqah"
  | "graduation"
  | "birthday";

export interface CategoryMeta {
  id: CategoryId;
  icon: LucideIcon;
  color: string;
}

export const CATEGORY_META: CategoryMeta[] = [
  { id: "wedding", icon: HeartIcon, color: "#C0627A" },
  { id: "engagement", icon: GemIcon, color: "#7B68C8" },
  { id: "marriage_contract", icon: HandshakeIcon, color: "#8A6D3B" },
  { id: "henna", icon: LeafIcon, color: "#4A9E6E" },
  { id: "bridal_shower", icon: SparklesIcon, color: "#C87AB0" },
  { id: "gender_reveal", icon: StarIcon, color: "#5AACE0" },
  { id: "aqeeqah", icon: BabyIcon, color: "#E08A4A" },
  { id: "graduation", icon: GraduationCapIcon, color: "#A08040" },
  { id: "birthday", icon: CakeIcon, color: "#E0604A" },
];

export const CATEGORY_IDS: CategoryId[] = CATEGORY_META.map((category) => category.id);

export const CATEGORY_LABELS: Record<"ar" | "en", Record<CategoryId, string>> = {
  ar: {
    wedding: "زفاف",
    engagement: "خطوبة",
    marriage_contract: "عقد قران",
    henna: "حنة",
    bridal_shower: "حفلة العروس",
    gender_reveal: "الكشف عن الجنس",
    aqeeqah: "عقيقة",
    graduation: "تخرج",
    birthday: "عيد ميلاد",
  },
  en: {
    wedding: "Wedding",
    engagement: "Engagement",
    marriage_contract: "Marriage Contract",
    henna: "Henna",
    bridal_shower: "Bridal Shower",
    gender_reveal: "Gender Reveal",
    aqeeqah: "Aqeeqah",
    graduation: "Graduation",
    birthday: "Birthday",
  },
};

export function isCategoryId(value: string | null): value is CategoryId {
  return !!value && (CATEGORY_IDS as string[]).includes(value);
}
