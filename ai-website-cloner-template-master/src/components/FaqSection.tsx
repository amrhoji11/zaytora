"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@/components/icons";

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
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
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((current) => (current === index ? null : index));
  }

  return (
    <section className="py-24">
      <div className="text-center mb-14">
        <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
          الأسئلة الشائعة
        </p>
        <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          الأسئلة الأكثر شيوعاً
        </h2>
      </div>

      <div className="max-w-3xl mx-auto px-4">
        {FAQ_ITEMS.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={item.question}>
              <button
                type="button"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between py-5 text-right text-base font-medium text-gray-900 border-b border-gray-100"
              >
                <span>{item.question}</span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <p className="text-sm text-gray-600 pb-5 leading-relaxed">
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
