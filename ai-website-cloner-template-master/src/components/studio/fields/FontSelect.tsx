"use client";

import { useLanguage } from "@/context/LanguageContext";

// Exported so the admin's per-template "default font" picker (see
// TemplateEditModal.tsx) offers this same full catalog instead of
// maintaining its own separate, easily-stale shortlist.
export const FONT_OPTIONS = {
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
    { value: "font-markazi-text", label: "Markazi (نسخ صحفي أنيق)" },
    { value: "font-lemonada", label: "Lemonada (مدوّر عصري)" },
    { value: "font-noto-kufi-arabic", label: "Kufi عصري" },
    { value: "font-vazirmatn", label: "Vazirmatn (عصري بسيط)" },
    { value: "font-baloo-bhaijaan-2", label: "Baloo (عريض مدوّر)" },
    { value: "font-marcellus", label: "Marcellus (سيريف أنيق)" },
    { value: "font-italiana", label: "Italiana (سيريف فاخر رفيع)" },
    { value: "font-bodoni-moda", label: "Bodoni Moda (كلاسيكي راقٍ)" },
    { value: "font-sacramento", label: "Sacramento (خط يد أنيق)" },
    { value: "font-allura", label: "Allura (خط يد انسيابي)" },
    { value: "font-tangerine", label: "Tangerine (خط يد رقيق)" },
    { value: "font-cinzel-decorative", label: "Cinzel Decorative (زخرفي فخم)" },
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
    { value: "font-markazi-text", label: "Markazi Text (Editorial Serif)" },
    { value: "font-lemonada", label: "Lemonada (Rounded Modern)" },
    { value: "font-noto-kufi-arabic", label: "Noto Kufi Arabic (Modern Kufi)" },
    { value: "font-vazirmatn", label: "Vazirmatn (Modern Sans)" },
    { value: "font-baloo-bhaijaan-2", label: "Baloo Bhaijaan (Bold Rounded)" },
    { value: "font-marcellus", label: "Marcellus (Elegant Serif)" },
    { value: "font-italiana", label: "Italiana (Slim Luxury Serif)" },
    { value: "font-bodoni-moda", label: "Bodoni Moda (High-Fashion Classic)" },
    { value: "font-sacramento", label: "Sacramento (Elegant Handwriting)" },
    { value: "font-allura", label: "Allura (Flowing Script)" },
    { value: "font-tangerine", label: "Tangerine (Delicate Script)" },
    { value: "font-cinzel-decorative", label: "Cinzel Decorative (Ornate Display)" },
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
