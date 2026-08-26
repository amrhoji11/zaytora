"use client";

import { useLanguage } from "@/context/LanguageContext";

const FONT_OPTIONS = {
  ar: [
    { value: "font-cinzel", label: "Cinzel (كلاسيكي)" },
    { value: "font-serif", label: "Serif" },
    { value: "font-sans", label: "Sans" },
    { value: "italic font-serif", label: "مائل" },
    { value: "font-cairo", label: "Cairo" },
    { value: "font-ibm-plex-arabic", label: "IBM Plex Arabic" },
    { value: "font-aref-ruqaa", label: "Aref Ruqaa (رقعة)" },
    { value: "font-rakkas", label: "Rakkas" },
    { value: "font-lalezar", label: "Lalezar" },
    { value: "font-jomhuria", label: "Jomhuria" },
    { value: "font-katibeh", label: "Katibeh" },
    { value: "font-changa", label: "Changa" },
    { value: "font-amiri", label: "Amiri (نسخ كلاسيكي)" },
    { value: "font-reem-kufi", label: "Reem Kufi" },
    { value: "font-el-messiri", label: "El Messiri" },
    { value: "font-marhey", label: "Marhey" },
    { value: "font-mada", label: "Mada" },
    { value: "font-harmattan", label: "Harmattan" },
    { value: "font-tajawal", label: "Tajawal" },
    { value: "font-almarai", label: "Almarai" },
    { value: "font-noto-naskh", label: "Noto Naskh Arabic" },
    { value: "font-scheherazade", label: "Scheherazade (تقليدي)" },
    { value: "font-lateef", label: "Lateef (نستعليق)" },
    { value: "font-playfair", label: "Playfair Display" },
    { value: "font-dancing-script", label: "Dancing Script" },
    { value: "font-cormorant", label: "Cormorant Garamond" },
    { value: "font-herr-von-muellerhoff", label: "Herr Von Muellerhoff (خط أسماء فاخر)" },
    { value: "font-noto-nastaliq", label: "Nastaliq (خط عربي انسيابي متصل)" },
    { value: "font-alex-brush", label: "Alex Brush (خط يد أنيق)" },
    { value: "font-parisienne", label: "Parisienne (خط كلاسيكي راقٍ)" },
  ],
  en: [
    { value: "font-cinzel", label: "Cinzel (Classic)" },
    { value: "font-serif", label: "Serif" },
    { value: "font-sans", label: "Sans" },
    { value: "italic font-serif", label: "Italic" },
    { value: "font-cairo", label: "Cairo" },
    { value: "font-ibm-plex-arabic", label: "IBM Plex Arabic" },
    { value: "font-aref-ruqaa", label: "Aref Ruqaa" },
    { value: "font-rakkas", label: "Rakkas" },
    { value: "font-lalezar", label: "Lalezar" },
    { value: "font-jomhuria", label: "Jomhuria" },
    { value: "font-katibeh", label: "Katibeh" },
    { value: "font-changa", label: "Changa" },
    { value: "font-amiri", label: "Amiri (Classic Naskh)" },
    { value: "font-reem-kufi", label: "Reem Kufi" },
    { value: "font-el-messiri", label: "El Messiri" },
    { value: "font-marhey", label: "Marhey" },
    { value: "font-mada", label: "Mada" },
    { value: "font-harmattan", label: "Harmattan" },
    { value: "font-tajawal", label: "Tajawal" },
    { value: "font-almarai", label: "Almarai" },
    { value: "font-noto-naskh", label: "Noto Naskh Arabic" },
    { value: "font-scheherazade", label: "Scheherazade" },
    { value: "font-lateef", label: "Lateef (Nastaliq)" },
    { value: "font-playfair", label: "Playfair Display" },
    { value: "font-dancing-script", label: "Dancing Script" },
    { value: "font-cormorant", label: "Cormorant Garamond" },
    { value: "font-herr-von-muellerhoff", label: "Herr Von Muellerhoff (Elegant Script)" },
    { value: "font-noto-nastaliq", label: "Nastaliq (Flowing Arabic Script)" },
    { value: "font-alex-brush", label: "Alex Brush (Elegant Handwriting)" },
    { value: "font-parisienne", label: "Parisienne (Refined Classic Script)" },
  ],
};

const COPY = { ar: "اختر خطاً", en: "Choose a font" };

export function FontSelect({
  label,
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { language } = useLanguage();
  const options = FONT_OPTIONS[language];

  return (
    <div>
      {label && <label className="mb-1.5 block text-sm text-body-foreground">{label}</label>}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground outline-none transition-colors [color-scheme:dark] focus:border-gold"
      >
        <option value="">{COPY[language]}</option>
        {options.map((font) => (
          <option key={font.value} value={font.value}>
            {font.label}
          </option>
        ))}
      </select>
    </div>
  );
}
