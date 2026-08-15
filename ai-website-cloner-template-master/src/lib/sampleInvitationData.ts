import type { InvitationDetail } from "@/types/studio";

// Standalone showcase data, independent from buildMockInvitation() (which
// backs the real Studio/Templates "Preview" flow) — this couple, date,
// venue, gallery and wishes are entirely invented for the /sample-invitation
// demo page and never touch the backend, so the page renders without an API
// running. The Unsplash photos are freely licensed and name-free, unlike the
// template screenshots under public/images/templates (those bake in other
// couples' names, unsuitable for a "moments" gallery here).
export const SAMPLE_HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1200&q=80";

export function buildSampleInvitation(): InvitationDetail {
  const now = new Date();
  const eventDate = new Date(now.getFullYear(), now.getMonth() + 5, 24, 20, 30, 0);

  return {
    id: "sample",
    status: "draft",
    editUrl: "",
    templateId: null,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),

    language: "ar",

    occasionType: "wedding",
    isCoupleEvent: true,

    eventTitle: "حفل زفاف",
    eventTitleFont: "font-cinzel",
    invitationType: "couple",
    firstName: "خالد",
    secondName: "نورة",
    namesFont: "font-cinzel",
    useNameImage: false,
    eventDateTime: eventDate.toISOString(),
    timezone: "Asia/Riyadh",
    useHijriDate: false,
    thankYouText: "WITH LOVE",
    thankYouTextColor: "#ffffff",

    hideFamilyNames: false,
    familyName1: "عائلة الغامدي",
    familyName2: "عائلة العتيبي",
    familyNamesFont: "font-cinzel",
    invitationText:
      "يتشرف آل الغامدي وآل العتيبي بدعوتكم لحضور حفل زفاف ابنهما خالد على الآنسة نورة، وتشريفكم بحضوركم أسعد لحظات فرحتنا",

    venues: [
      {
        name: "فندق فورسيزونز جدة",
        address: "طريق الكورنيش، حي الشاطئ، جدة، المملكة العربية السعودية",
        mapUrl: "https://maps.google.com/?q=Four+Seasons+Hotel+Jeddah",
      },
    ],

    showEventProgram: true,
    programItems: [
      { time: "8:00 PM", title: "استقبال الضيوف" },
      { time: "8:45 PM", title: "زفة العروسين" },
      { time: "9:15 PM", title: "حفل العشاء" },
      { time: "10:30 PM", title: "قص كيكة الزفاف" },
      { time: "11:00 PM", title: "فقرات فنية وسهرة" },
    ],

    showEventRules: true,
    eventRulesText: "التصوير للمصور الرسمي فقط · يرجى الحضور في الوقت المحدد · الحفل خاص بالكبار فقط",

    showAccommodation: true,
    accommodations: [{ name: "فندق فورسيزونز جدة", mapUrl: "https://maps.google.com/?q=Four+Seasons+Hotel+Jeddah" }],

    galleryImages: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&q=80",
      "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800&q=80",
      "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
      "https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800&q=80",
    ],

    showPersonalMessage: true,
    personalMessageTitle: "رسالة العروسين",
    personalMessageText:
      "بقلوب مفعمة بالحب والامتنان، ندعوكم لمشاركتنا بداية قصتنا معاً. حضوركم هو أجمل هدية يضيء بها هذا اليوم الاستثنائي في حياتنا.",
    personalMessageSignature: "خالد & نورة",

    contacts: [
      { name: "خالد", role: "العريس", phone: "+966501234567", whatsapp: "+966501234567" },
      { name: "نورة", role: "العروس", phone: "+966559876543", whatsapp: "+966559876543" },
    ],

    musicUrl: "https://www.youtube.com/watch?v=CUr_UwUUXzU",
    musicTitle: "Wildest Dreams",

    enableGifts: true,
    giftIban: "SA4420000001234567891234",
    giftFeeCoverage: false,
    giftMessage: "حضوركم يسعدنا، ولمن أراد المشاركة بهدية فبإمكانه ذلك عبر الحساب البنكي",
    giftBankTransferEnabled: true,
    giftAccountHolderName: "خالد & نورة",
    giftWishlistEnabled: false,
    giftWishlistItems: [],

    hideCameraButton: false,
    hideSaveButton: false,
    hideCapturedGallery: false,

    enableQrEntry: false,

    enableRsvp: true,
    rsvpShowAttendance: true,
    rsvpShowGuestCount: true,
    rsvpShowMessage: true,
    rsvpShowLiveCount: true,
    guestLimit: 400,
    rsvpAttendingCount: 312,
    rsvpWishes: [
      "ألف مبروك يا خالد ونورة، الله يتمم عليكم بالخير والسعادة",
      "بيت جديد وقلب واحد، مبروك الزواج وبالرفاه والبنين",
      "أجمل ثنائي، الله يحفظكم ويديم عليكم المحبة",
      "ما شاء الله تبارك الله، فرحة تستاهل كل هالجمال",
      "بانتظار الحفل بشوق، مبروك مقدماً لكما",
      "دعواتنا لكم بحياة مليئة بالحب والتوفيق",
      "كل التهاني للعروسين، فرحتكم فرحتنا",
      "مبروك 🤍 الله يبارك لكم ويبارك عليكم",
    ],

    generalTextFont: "font-sans",
    envelopeNameFont: "font-cinzel",
  };
}
