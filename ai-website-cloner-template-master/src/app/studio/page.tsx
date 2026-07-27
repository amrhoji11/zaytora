import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "الاستوديو | Numinds",
};

export default function StudioPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-24 text-center">
      <div className="max-w-lg">
        <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
          الاستوديو
        </p>
        <h1 className="font-cinzel text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          استوديو إنشاء الدعوات قريباً
        </h1>
        <p className="text-gray-600 mb-8">
          نعمل على بناء تجربة تصميم الدعوات الرقمية الخاصة بك. تصفح قوالبنا
          الحالية في هذه الأثناء.
        </p>
        <Link
          href="/#templates"
          className="inline-block rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.97]"
          style={{ background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)" }}
        >
          تصفح القوالب
        </Link>
      </div>
    </section>
  );
}
