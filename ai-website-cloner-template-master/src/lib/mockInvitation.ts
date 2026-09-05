import type { ContactItem, InvitationDetail } from "@/types/studio";

// Per-category demo content for the Templates Preview flow (Home page /
// templates grid "Preview" button, and the /templates catalog). Keyed by
// the same occasionType strings Step02Occasion.tsx and SeedTemplates.cs use,
// so every category (couple or individual, per Step02Occasion's OCCASION_META)
// gets its own coherent title/names/text instead of every non-wedding
// template still showing a bride-and-groom mock (which read as broken when
// e.g. a graduation template preview said "حفل زفاف" / "أسامة & كريستالا").
interface CategoryContent {
  eventTitle: string;
  isCoupleEvent: boolean;
  invitationType: "individual" | "couple";
  firstName: string;
  secondName?: string;
  invitationText: string;
  thankYouText: string;
  familyName1: string;
  familyName2?: string;
  personalMessageTitle: string;
  personalMessageText: string;
  personalMessageSignature: string;
  contacts: ContactItem[];
  giftAccountHolderName: string;
  rsvpWishes: string[];
}

const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  wedding: {
    eventTitle: "حفل زفاف",
    isCoupleEvent: true,
    invitationType: "couple",
    firstName: "أسامة",
    secondName: "كريستالا",
    invitationText: "يتشرفون بدعوتكم لحضور حفل زفافنا ومشاركتنا أجمل لحظات حياتنا",
    thankYouText: "WITH LOVE",
    familyName1: "عائلة الأحمد",
    familyName2: "عائلة السالم",
    personalMessageTitle: "رسالة العروسين",
    personalMessageText: "بقلوب يملؤها الفرح والامتنان، يسعدنا أن نشاركم أجمل لحظات حياتنا وبداية رحلتنا معاً.",
    personalMessageSignature: "أسامة & كريستالا",
    contacts: [
      { name: "أسامة", role: "العريس", phone: "+966500000001", whatsapp: "+966500000001" },
      { name: "كريستالا", role: "العروس", phone: "+966500000002", whatsapp: "+966500000002" },
    ],
    giftAccountHolderName: "أسامة & كريستالا",
    rsvpWishes: [
      "الف مبروك ونتمنى لكم حياة سعيدة مليئة بالمحبة",
      "بانتظار الحفل بفارغ الصبر، مبروك مقدماً",
      "أجمل التهاني للعروسين، الله يديم عليكم الفرحة",
      "ما شاء الله، بيت جديد وبداية سعيدة بإذن الله",
      "مبروك الزواج 🤍",
    ],
  },
  engagement: {
    eventTitle: "حفل خطوبة",
    isCoupleEvent: true,
    invitationType: "couple",
    firstName: "ماجد",
    secondName: "العنود",
    invitationText: "يتشرفون بدعوتكم لحضور حفل خطوبتنا ومشاركتنا هذه اللحظة السعيدة",
    thankYouText: "WITH LOVE",
    familyName1: "عائلة القحطاني",
    familyName2: "عائلة الدوسري",
    personalMessageTitle: "رسالة الخطيبين",
    personalMessageText: "يسعدنا مشاركتكم بداية قصتنا، وحضوركم يزيد الفرحة جمالاً.",
    personalMessageSignature: "ماجد & العنود",
    contacts: [
      { name: "ماجد", role: "الخطيب", phone: "+966500000003", whatsapp: "+966500000003" },
      { name: "العنود", role: "الخطيبة", phone: "+966500000004", whatsapp: "+966500000004" },
    ],
    giftAccountHolderName: "ماجد & العنود",
    rsvpWishes: [
      "مبروك الخطوبة، الله يتمم بخير",
      "بالتوفيق للخطيبين وعقبال الفرح",
      "فرحة تستاهلوها، مبروك",
      "الله يديم عليكم المحبة والسعادة",
    ],
  },
  marriage_contract: {
    eventTitle: "حفل عقد قران",
    isCoupleEvent: true,
    invitationType: "couple",
    firstName: "فهد",
    secondName: "لمى",
    invitationText: "يتشرفون بدعوتكم لحضور حفل عقد قراننا",
    thankYouText: "WITH LOVE",
    familyName1: "عائلة العتيبي",
    familyName2: "عائلة الحربي",
    personalMessageTitle: "رسالة العروسين",
    personalMessageText: "يسرنا مشاركتكم فرحة عقد قراننا، وجودكم شرف لنا.",
    personalMessageSignature: "فهد & لمى",
    contacts: [
      { name: "فهد", role: "العريس", phone: "+966500000005", whatsapp: "+966500000005" },
      { name: "لمى", role: "العروسة", phone: "+966500000006", whatsapp: "+966500000006" },
    ],
    giftAccountHolderName: "فهد & لمى",
    rsvpWishes: ["مبروك عقد القران", "الله يتمم على خير ويسعدكم", "ألف مبروك ونتمنى لكم القبول"],
  },
  henna: {
    eventTitle: "ليلة الحنة",
    isCoupleEvent: true,
    invitationType: "couple",
    firstName: "سلطان",
    secondName: "ريم",
    invitationText: "يتشرفون بدعوتكم لمشاركتنا ليلة الحنة، ليلة من ليالي الفرح",
    thankYouText: "WITH LOVE",
    familyName1: "عائلة الشهري",
    familyName2: "عائلة الغامدي",
    personalMessageTitle: "رسالة العروسين",
    personalMessageText: "احتفالاً بأجمل الليالي، يسعدنا تواجدكم معنا في ليلة الحنة.",
    personalMessageSignature: "سلطان & ريم",
    contacts: [{ name: "ريم", role: "العروس", phone: "+966500000007", whatsapp: "+966500000007" }],
    giftAccountHolderName: "سلطان & ريم",
    rsvpWishes: ["ليلة حنة سعيدة ومباركة", "مبروك، ليلة تستاهل كل هالفرحة", "الله يسعدكم دايماً"],
  },
  bridal_shower: {
    eventTitle: "حفلة العروس",
    isCoupleEvent: false,
    invitationType: "individual",
    firstName: "نوف",
    invitationText: "يسعدني دعوتكم لحضور حفلتي، ومشاركتي هذه اللحظة الجميلة قبل الزفاف",
    thankYouText: "WITH LOVE",
    familyName1: "عائلة المطيري",
    personalMessageTitle: "رسالة العروس",
    personalMessageText: "وجودكم بجانبي في هذه المرحلة يعني لي الكثير، شكراً لحبكم ودعمكم.",
    personalMessageSignature: "نوف",
    contacts: [{ name: "نوف", role: "العروس", phone: "+966500000008", whatsapp: "+966500000008" }],
    giftAccountHolderName: "نوف",
    rsvpWishes: ["مبروك مقدماً ومبسوطين لأجلك", "أجمل حفلة لأجمل عروس", "الله يسعدك يا قمر"],
  },
  gender_reveal: {
    eventTitle: "حفل كشف الجنس",
    isCoupleEvent: false,
    invitationType: "individual",
    firstName: "منيرة وخالد",
    invitationText: "يسعدنا دعوتكم لمشاركتنا لحظة الكشف عن جنس مولودنا القادم",
    thankYouText: "WITH LOVE",
    familyName1: "عائلة العنزي",
    personalMessageTitle: "رسالتنا لكم",
    personalMessageText: "بانتظار هذه اللحظة بفارغ الصبر، ويسعدنا أن تكونوا معنا فيها.",
    personalMessageSignature: "منيرة & خالد",
    contacts: [{ name: "خالد", role: "الأب", phone: "+966500000009", whatsapp: "+966500000009" }],
    giftAccountHolderName: "منيرة & خالد",
    rsvpWishes: ["الله يسهّل ويتمم بالسلامة", "بانتظار الخبر السعيد", "ألف مبروك مقدماً"],
  },
  aqeeqah: {
    eventTitle: "حفل عقيقة",
    isCoupleEvent: false,
    invitationType: "individual",
    firstName: "يوسف",
    invitationText: "بمناسبة عقيقة مولودنا الغالي يوسف، يسرنا دعوتكم لمشاركتنا الفرحة",
    thankYouText: "WITH LOVE",
    familyName1: "عائلة الزهراني",
    personalMessageTitle: "رسالتنا لكم",
    personalMessageText: "الحمد لله على نعمته، ويسعدنا أن نشاركم فرحة استقبال يوسف.",
    personalMessageSignature: "عائلة الزهراني",
    contacts: [{ name: "سعود", role: "والد المولود", phone: "+966500000010", whatsapp: "+966500000010" }],
    giftAccountHolderName: "عائلة الزهراني",
    rsvpWishes: ["الله يبارك بالمولود ويحفظه", "مبروك المولود الجديد", "بالرفاه والبنين"],
  },
  graduation: {
    eventTitle: "حفل تخرج",
    isCoupleEvent: false,
    invitationType: "individual",
    firstName: "عبدالله",
    invitationText: "بمناسبة تخرجي، يسعدني دعوتكم لمشاركتي هذا الإنجاز والاحتفال معي",
    thankYouText: "THANK YOU",
    familyName1: "عائلة الحارثي",
    personalMessageTitle: "رسالتي لكم",
    personalMessageText: "بعد سنوات من الجهد والتعب، يشرفني أن أشاركم لحظة تخرجي.",
    personalMessageSignature: "عبدالله",
    contacts: [{ name: "عبدالله", role: "الخريج", phone: "+966500000011", whatsapp: "+966500000011" }],
    giftAccountHolderName: "عبدالله",
    rsvpWishes: ["ألف مبروك التخرج ومزيد من التوفيق", "مبروك يا مهندس، بالتوفيق بمشوارك الجديد", "خطوة أولى نحو النجاح، مبروك"],
  },
  birthday: {
    eventTitle: "حفل عيد ميلاد",
    isCoupleEvent: false,
    invitationType: "individual",
    firstName: "ليان",
    invitationText: "بمناسبة عيد ميلادي، يسعدني دعوتكم للاحتفال معي بهذا اليوم المميز",
    thankYouText: "THANK YOU",
    familyName1: "عائلة الشمري",
    personalMessageTitle: "رسالتي لكم",
    personalMessageText: "سنة حلوة يا جميع، وحضوركم معي هو أجمل هدية.",
    personalMessageSignature: "ليان",
    contacts: [{ name: "ليان", role: "صاحبة المناسبة", phone: "+966500000012", whatsapp: "+966500000012" }],
    giftAccountHolderName: "ليان",
    rsvpWishes: ["كل عام وأنتِ بخير", "عيد ميلاد سعيد ومليء بالفرح", "الله يطول بعمرك ويسعدك"],
  },
};

// Complete, fully-populated placeholder content for the Templates Preview
// flow (Home page / templates grid "Preview" button) — unlike the Studio
// Preview flow, there's no real draft behind this, so every section is
// filled with demo data purely to show off the template's structure.
export function buildMockInvitation(templateId: string | null, category?: string | null): InvitationDetail {
  const now = new Date();
  const eventDate = new Date(now.getFullYear(), now.getMonth() + 3, 19, 21, 0, 0);
  const content = (category && CATEGORY_CONTENT[category]) || CATEGORY_CONTENT.wedding;

  return {
    id: "demo",
    status: "draft",
    editUrl: "",
    templateId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),

    language: "ar",

    occasionType: category ?? "wedding",
    isCoupleEvent: content.isCoupleEvent,

    eventTitle: content.eventTitle,
    // Left unset (rather than hardcoded) so a template's own configured
    // default font (Template.DefaultNamesFont) actually shows in this
    // preview instead of being silently overridden by this mock data --
    // the whole point of previewing an unedited template is seeing its own
    // real look.
    eventTitleFont: null,
    invitationType: content.invitationType,
    firstName: content.firstName,
    secondName: content.secondName ?? null,
    namesFont: null,
    useNameImage: false,
    eventDateTime: eventDate.toISOString(),
    timezone: "Asia/Riyadh",
    useHijriDate: false,
    thankYouText: content.thankYouText,
    thankYouTextColor: "#ffffff",

    hideFamilyNames: false,
    familyName1: content.familyName1,
    familyName2: content.familyName2 ?? null,
    familyNamesFont: null,
    invitationText: content.invitationText,

    venues: [
      {
        name: "فندق الريتز كارلتون",
        address: "حي الهدا، طريق مكة المكرمة، الرياض، المملكة العربية السعودية",
        mapUrl: "https://maps.google.com/?q=Ritz+Carlton+Riyadh",
      },
    ],

    showEventProgram: true,
    programItems: [
      { time: "7:00 PM", title: "استقبال الضيوف" },
      { time: "8:00 PM", title: "بداية الحفل" },
      { time: "9:00 PM", title: "حفل العشاء" },
      { time: "10:00 PM", title: "التصوير التذكاري" },
    ],

    showEventRules: true,
    eventRulesText: "ممنوع التصوير · يرجى الحضور في الوقت المحدد · فعالية خاصة",

    showAccommodation: true,
    accommodations: [{ name: "فندق الريتز كارلتون", mapUrl: "https://maps.google.com/?q=Ritz+Carlton+Riyadh" }],

    galleryImages: [
      "/images/templates/w024.png",
      "/images/templates/w031.jpeg",
      "/images/templates/w029.png",
      "/images/templates/w019.png",
      "/images/templates/w024.png",
      "/images/templates/w031.jpeg",
    ],

    showPersonalMessage: true,
    personalMessageTitle: content.personalMessageTitle,
    personalMessageText: content.personalMessageText,
    personalMessageSignature: content.personalMessageSignature,

    contacts: content.contacts,

    musicUrl: "https://www.youtube.com/watch?v=NPBCbTZWnq0",
    musicTitle: "River Flows in You",

    enableGifts: true,
    giftIban: "SA0000000000000000000000",
    giftFeeCoverage: false,
    giftMessage: "وجودكم يكفينا، ولمن أراد المشاركة",
    giftBankTransferEnabled: true,
    giftAccountHolderName: content.giftAccountHolderName,
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
    guestLimit: 500,
    rsvpAttendingCount: 447,
    rsvpWishes: content.rsvpWishes,

    generalTextFont: null,
    envelopeNameFont: null,
  };
}
