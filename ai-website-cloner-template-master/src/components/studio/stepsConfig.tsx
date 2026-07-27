import type { ComponentType } from "react";
import {
  GlobeIcon,
  SparklesIcon,
  LayoutGridIcon,
  SettingsIcon,
  MessageCircleIcon,
  MapPinIcon,
  CalendarIcon,
  ClipboardListIcon,
  BedDoubleIcon,
  ImageIcon,
  UsersIcon,
  MusicIcon,
  HeartIcon,
  CameraIcon,
  QrCodeIcon,
} from "@/components/icons";
import type { InvitationDetail } from "@/types/studio";

import { Step01Language } from "./steps/Step01Language";
import { Step02Occasion } from "./steps/Step02Occasion";
import { Step03Template } from "./steps/Step03Template";
import { Step04BasicInfo } from "./steps/Step04BasicInfo";
import { Step05InvitationText } from "./steps/Step05InvitationText";
import { Step06Location } from "./steps/Step06Location";
import { Step07Program } from "./steps/Step07Program";
import { Step08Rules } from "./steps/Step08Rules";
import { Step09Accommodation } from "./steps/Step09Accommodation";
import { Step10Gallery } from "./steps/Step10Gallery";
import { Step11PersonalMessage } from "./steps/Step11PersonalMessage";
import { Step12Contacts } from "./steps/Step12Contacts";
import { Step13Music } from "./steps/Step13Music";
import { Step14Gift } from "./steps/Step14Gift";
import { Step15Camera } from "./steps/Step15Camera";
import { Step16QrEntry } from "./steps/Step16QrEntry";
import { Step17Rsvp } from "./steps/Step17Rsvp";
import { Step18Additional } from "./steps/Step18Additional";

export interface StepDefinition {
  id: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  question: string;
  Component: ComponentType<{
    value: InvitationDetail;
    onChange: (patch: Partial<InvitationDetail>) => void;
  }>;
}

export const WIZARD_STEPS: StepDefinition[] = [
  { id: "language", icon: GlobeIcon, label: "لغة الدعوة", question: "هيا نبدأ! 🌟 ما لغة دعوتك؟", Component: Step01Language },
  { id: "occasion", icon: SparklesIcon, label: "نوع المناسبة", question: "🎉 ما نوع المناسبة؟", Component: Step02Occasion },
  { id: "template", icon: LayoutGridIcon, label: "اختيار القالب", question: "رائع! اختر قالباً يناسب احتفالك. ✨", Component: Step03Template },
  { id: "basic-info", icon: SettingsIcon, label: "المعلومات الأساسية", question: "📅 الآن، بعض التفاصيل الأساسية", Component: Step04BasicInfo },
  { id: "invitation-text", icon: MessageCircleIcon, label: "الدعوة", question: "📝 الآن نكتب نص الدعوة", Component: Step05InvitationText },
  { id: "location", icon: MapPinIcon, label: "الموقع", question: "📍 أين سيقام الاحتفال؟", Component: Step06Location },
  { id: "program", icon: CalendarIcon, label: "برنامج الحفل", question: "🎭 هل تريد مشاركة برنامج الحفل مع ضيوفك؟", Component: Step07Program },
  { id: "rules", icon: ClipboardListIcon, label: "تفاصيل الحدث", question: "📋 هل هناك قواعد أو ملاحظات خاصة؟", Component: Step08Rules },
  { id: "accommodation", icon: BedDoubleIcon, label: "أين تقيمون", question: "🏨 اقترح فنادق أو أماكن إقامة لضيوفك", Component: Step09Accommodation },
  { id: "gallery", icon: ImageIcon, label: "معرض الصور", question: "🖼️ أضف صوراً جميلة إلى معرض دعوتك", Component: Step10Gallery },
  { id: "personal-message", icon: MessageCircleIcon, label: "رسالة شخصية", question: "💬 هل تريد إضافة رسالة شخصية؟", Component: Step11PersonalMessage },
  { id: "contacts", icon: UsersIcon, label: "جهات الاتصال", question: "📞 أضف معلومات التواصل لضيوفك", Component: Step12Contacts },
  { id: "music", icon: MusicIcon, label: "الموسيقى", question: "🎵 اضبط الأجواء مع موسيقى خلفية!", Component: Step13Music },
  { id: "gift", icon: HeartIcon, label: "الهدية", question: "🎁 هل تريد استقبال الهدايا؟", Component: Step14Gift },
  { id: "camera", icon: CameraIcon, label: "الكاميرا", question: "📷 تحكّم في استخدام الضيوف للكاميرا أثناء الحدث", Component: Step15Camera },
  { id: "qr-entry", icon: QrCodeIcon, label: "دخول الضيوف عبر QR", question: "💳 هل تريد نظام الدخول الذكي بـ QR؟", Component: Step16QrEntry },
  { id: "rsvp", icon: HeartIcon, label: "إعدادات تأكيد الحضور", question: "📋 خصص نموذج تأكيد الحضور", Component: Step17Rsvp },
  { id: "additional", icon: SettingsIcon, label: "إعدادات إضافية", question: "👋 اقتربنا من النهاية! تفضيلات أخيرة؟", Component: Step18Additional },
];
