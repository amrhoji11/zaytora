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
import type { Language } from "@/context/LanguageContext";
import type { InvitationDetail } from "@/types/studio";

// Returned by a step's `validate` to block "Next" — StudioWizard maps each
// code to a localized message (see its COPY.stepErrors). null/undefined
// means the step's current data is fine to advance past.
export type StepErrorCode =
  | "missingEventTitle"
  | "missingFirstName"
  | "missingSecondName"
  | "missingEventDate"
  | "pastEventDate"
  | "missingVenueName"
  | "missingWishlistItemName"
  | "invalidQrScanRange";

import dynamic from "next/dynamic";

// Code-split per step instead of one static import each: a fresh /studio
// visit only ever renders step 1 first, so eagerly bundling all 18 steps'
// code (plus their own icon/motion/field imports) up front was pure dead
// weight on that first load — this is the biggest single chunk of what made
// "إنشاء جديد" feel slow to open. Each step's code now downloads only when
// the wizard actually reaches it.
const Step01Language = dynamic(() => import("./steps/Step01Language").then((m) => m.Step01Language));
const Step02Occasion = dynamic(() => import("./steps/Step02Occasion").then((m) => m.Step02Occasion));
const Step03Template = dynamic(() => import("./steps/Step03Template").then((m) => m.Step03Template));
const Step04BasicInfo = dynamic(() => import("./steps/Step04BasicInfo").then((m) => m.Step04BasicInfo));
const Step05InvitationText = dynamic(() => import("./steps/Step05InvitationText").then((m) => m.Step05InvitationText));
const Step06Location = dynamic(() => import("./steps/Step06Location").then((m) => m.Step06Location));
const Step07Program = dynamic(() => import("./steps/Step07Program").then((m) => m.Step07Program));
const Step08Rules = dynamic(() => import("./steps/Step08Rules").then((m) => m.Step08Rules));
const Step09Accommodation = dynamic(() => import("./steps/Step09Accommodation").then((m) => m.Step09Accommodation));
const Step10Gallery = dynamic(() => import("./steps/Step10Gallery").then((m) => m.Step10Gallery));
const Step11PersonalMessage = dynamic(() => import("./steps/Step11PersonalMessage").then((m) => m.Step11PersonalMessage));
const Step12Contacts = dynamic(() => import("./steps/Step12Contacts").then((m) => m.Step12Contacts));
const Step13Music = dynamic(() => import("./steps/Step13Music").then((m) => m.Step13Music));
const Step14Gift = dynamic(() => import("./steps/Step14Gift").then((m) => m.Step14Gift));
const Step15Camera = dynamic(() => import("./steps/Step15Camera").then((m) => m.Step15Camera));
const Step16QrEntry = dynamic(() => import("./steps/Step16QrEntry").then((m) => m.Step16QrEntry));
const Step17Rsvp = dynamic(() => import("./steps/Step17Rsvp").then((m) => m.Step17Rsvp));
const Step18Additional = dynamic(() => import("./steps/Step18Additional").then((m) => m.Step18Additional));

export interface StepDefinition {
  id: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  question: string;
  Component: ComponentType<{
    value: InvitationDetail;
    onChange: (patch: Partial<InvitationDetail>) => void;
  }>;
  validate?: (form: InvitationDetail) => StepErrorCode | null;
}

const STEP_META = [
  { id: "language", icon: GlobeIcon, Component: Step01Language },
  { id: "occasion", icon: SparklesIcon, Component: Step02Occasion },
  { id: "template", icon: LayoutGridIcon, Component: Step03Template },
  {
    id: "basic-info",
    icon: SettingsIcon,
    Component: Step04BasicInfo,
    validate: (form: InvitationDetail): StepErrorCode | null => {
      if (!form.eventTitle?.trim()) return "missingEventTitle";
      if (!form.firstName?.trim()) return "missingFirstName";
      if (form.invitationType === "couple" && !form.secondName?.trim()) return "missingSecondName";
      if (!form.eventDateTime) return "missingEventDate";
      if (new Date(form.eventDateTime).getTime() < Date.now()) return "pastEventDate";
      return null;
    },
  },
  { id: "invitation-text", icon: MessageCircleIcon, Component: Step05InvitationText },
  {
    id: "location",
    icon: MapPinIcon,
    Component: Step06Location,
    validate: (form: InvitationDetail): StepErrorCode | null =>
      form.venues.some((venue) => !venue.name.trim()) ? "missingVenueName" : null,
  },
  { id: "program", icon: CalendarIcon, Component: Step07Program },
  { id: "rules", icon: ClipboardListIcon, Component: Step08Rules },
  { id: "accommodation", icon: BedDoubleIcon, Component: Step09Accommodation },
  { id: "gallery", icon: ImageIcon, Component: Step10Gallery },
  { id: "personal-message", icon: MessageCircleIcon, Component: Step11PersonalMessage },
  { id: "contacts", icon: UsersIcon, Component: Step12Contacts },
  { id: "music", icon: MusicIcon, Component: Step13Music },
  {
    id: "gift",
    icon: HeartIcon,
    Component: Step14Gift,
    validate: (form: InvitationDetail): StepErrorCode | null =>
      form.giftWishlistEnabled && (form.giftWishlistItems ?? []).some((item) => !item.name.trim())
        ? "missingWishlistItemName"
        : null,
  },
  { id: "camera", icon: CameraIcon, Component: Step15Camera },
  {
    id: "qr-entry",
    icon: QrCodeIcon,
    Component: Step16QrEntry,
    validate: (form: InvitationDetail): StepErrorCode | null =>
      form.enableQrEntry && form.qrScanStart && form.qrScanEnd && form.qrScanEnd <= form.qrScanStart
        ? "invalidQrScanRange"
        : null,
  },
  { id: "rsvp", icon: HeartIcon, Component: Step17Rsvp },
  { id: "additional", icon: SettingsIcon, Component: Step18Additional },
] as const;

const STEP_TEXT: Record<Language, Record<string, { label: string; question: string }>> = {
  ar: {
    language: { label: "لغة الدعوة", question: "هيا نبدأ! 🌟 ما لغة دعوتك؟" },
    occasion: { label: "نوع المناسبة", question: "🎉 ما نوع المناسبة؟" },
    template: { label: "اختيار القالب", question: "رائع! اختر قالباً يناسب احتفالك. ✨" },
    "basic-info": { label: "المعلومات الأساسية", question: "📅 الآن، بعض التفاصيل الأساسية" },
    "invitation-text": { label: "الدعوة", question: "📝 الآن نكتب نص الدعوة" },
    location: { label: "الموقع", question: "📍 أين سيقام الاحتفال؟" },
    program: { label: "برنامج الحفل", question: "🎭 هل تريد مشاركة برنامج الحفل مع ضيوفك؟" },
    rules: { label: "تفاصيل الحدث", question: "📋 هل هناك قواعد أو ملاحظات خاصة؟" },
    accommodation: { label: "أين تقيمون", question: "🏨 اقترح فنادق أو أماكن إقامة لضيوفك" },
    gallery: { label: "معرض الصور", question: "🖼️ أضف صوراً جميلة إلى معرض دعوتك" },
    "personal-message": { label: "رسالة شخصية", question: "💬 هل تريد إضافة رسالة شخصية؟" },
    contacts: { label: "جهات الاتصال", question: "📞 أضف معلومات التواصل لضيوفك" },
    music: { label: "الموسيقى", question: "🎵 اضبط الأجواء مع موسيقى خلفية!" },
    gift: { label: "الهدية", question: "🎁 هل تريد استقبال الهدايا؟" },
    camera: { label: "الكاميرا", question: "📷 تحكّم في استخدام الضيوف للكاميرا أثناء الحدث" },
    "qr-entry": { label: "دخول الضيوف عبر QR", question: "💳 هل تريد نظام الدخول الذكي بـ QR؟" },
    rsvp: { label: "إعدادات تأكيد الحضور", question: "📋 خصص نموذج تأكيد الحضور" },
    additional: { label: "إعدادات إضافية", question: "👋 اقتربنا من النهاية! تفضيلات أخيرة؟" },
  },
  en: {
    language: { label: "Invitation Language", question: "Let's start! 🌟 What language is your invitation in?" },
    occasion: { label: "Occasion Type", question: "🎉 What's the occasion?" },
    template: { label: "Choose a Template", question: "Great! Pick a template that fits your celebration. ✨" },
    "basic-info": { label: "Basic Info", question: "📅 Now, some basic details" },
    "invitation-text": { label: "Invitation", question: "📝 Now let's write the invitation text" },
    location: { label: "Location", question: "📍 Where will the celebration be held?" },
    program: { label: "Event Program", question: "🎭 Want to share the event program with your guests?" },
    rules: { label: "Event Details", question: "📋 Any special rules or notes?" },
    accommodation: { label: "Where to Stay", question: "🏨 Suggest hotels or places to stay for your guests" },
    gallery: { label: "Photo Gallery", question: "🖼️ Add some beautiful photos to your invitation's gallery" },
    "personal-message": { label: "Personal Message", question: "💬 Want to add a personal message?" },
    contacts: { label: "Contacts", question: "📞 Add contact info for your guests" },
    music: { label: "Music", question: "🎵 Set the mood with background music!" },
    gift: { label: "Gift", question: "🎁 Want to accept gifts?" },
    camera: { label: "Camera", question: "📷 Control how guests use the camera during the event" },
    "qr-entry": { label: "QR Guest Entry", question: "💳 Want the smart QR entry system?" },
    rsvp: { label: "RSVP Settings", question: "📋 Customize the RSVP form" },
    additional: { label: "Additional Settings", question: "👋 Almost there! Any final preferences?" },
  },
};

export function getWizardSteps(language: Language): StepDefinition[] {
  const text = STEP_TEXT[language];
  return STEP_META.map((meta) => ({ ...meta, ...text[meta.id] }));
}
