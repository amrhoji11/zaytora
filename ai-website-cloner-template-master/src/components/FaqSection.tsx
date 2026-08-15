"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";

interface FaqItem {
  question: string;
  answer: string;
}

const COPY = {
  ar: {
    eyebrow: "الأسئلة الشائعة",
    heading: "الأسئلة الأكثر شيوعاً",
    items: [
      {
        question: "كم يستغرق إعداد الدعوة الرقمية؟",
        answer:
          "معظم الدعوات جاهزة للمشاركة خلال 10–15 دقيقة. فقط اختر القالب، وأدخل تفاصيل حدثك، وأكمل الدفع للنشر فوراً.",
      },
      {
        question: "هل يمكنني تعديل الدعوة بعد نشرها؟",
        answer:
          "نعم، يمكنك تعديل تفاصيل الدعوة في أي وقت من لوحة التحكم الخاصة بك حتى بعد نشرها ومشاركتها مع الضيوف.",
      },
      {
        question: "كيف يتتبع نظام الرد ردود الضيوف؟",
        answer:
          "يقوم كل ضيف بتأكيد حضوره مباشرة من صفحة الدعوة بلمسة واحدة، وتظهر جميع الردود مباشرة في لوحة التحكم الخاصة بك.",
      },
      {
        question: "هل يمكن للضيوف رفع الصور عبر ميزة كاميرا الحدث؟",
        answer:
          "نعم، ميزة كاميرا الحدث تتيح لضيوفك رفع صورهم ولحظاتهم المفضلة مباشرة أثناء المناسبة لمشاركتها معك.",
      },
      {
        question: "هل يوجد حد لعدد الضيوف أو المشاهدات؟",
        answer:
          "لا، يمكن لعدد غير محدود من الضيوف مشاهدة دعوتك وتأكيد حضورهم دون أي قيود إضافية.",
      },
      {
        question: "هل أحتاج إلى مهارات تقنية لإنشاء دعوتي؟",
        answer:
          "لا على الإطلاق. الاستوديو مصمم ليكون بسيطاً وسهل الاستخدام. فقط أدخل تفاصيلك وارفع صورك ودعوتك جاهزة.",
      },
    ] satisfies FaqItem[],
  },
  en: {
    eyebrow: "FAQ",
    heading: "Frequently Asked Questions",
    items: [
      {
        question: "How long does it take to set up a digital invitation?",
        answer:
          "Most invitations are ready to share within 10–15 minutes. Just pick a template, enter your event details, and complete payment to publish instantly.",
      },
      {
        question: "Can I edit the invitation after it's published?",
        answer:
          "Yes, you can edit your invitation details at any time from your dashboard, even after it's published and shared with guests.",
      },
      {
        question: "How does the RSVP system track guest responses?",
        answer:
          "Each guest confirms attendance directly from the invitation page with one tap, and every response shows up instantly in your dashboard.",
      },
      {
        question: "Can guests upload photos via the event camera feature?",
        answer:
          "Yes, the event camera feature lets your guests upload their favorite photos and moments directly during the event to share with you.",
      },
      {
        question: "Is there a limit on the number of guests or views?",
        answer:
          "No, an unlimited number of guests can view your invitation and confirm attendance with no extra restrictions.",
      },
      {
        question: "Do I need technical skills to create my invitation?",
        answer:
          "Not at all. The studio is designed to be simple and easy to use. Just enter your details, upload your photos, and your invitation is ready.",
      },
    ] satisfies FaqItem[],
  },
};

export function FaqSection() {
  const { language } = useLanguage();
  const t = COPY[language];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <section className="py-24">
      <div className="text-center mb-14">
        <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
          {t.eyebrow}
        </p>
        <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-foreground mb-4">
          {t.heading}
        </h2>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {t.items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question}>
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between py-5 text-right text-base font-medium text-foreground border-b border-border"
              >
                <span>{item.question}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <p className="text-sm text-body-foreground pb-5 leading-relaxed">
                  {item.answer}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
