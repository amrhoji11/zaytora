import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "لوحة التحكم | Numinds",
};

export default function DashboardPage() {
  return (
    <section className="min-h-[70vh] flex items-center justify-center px-4 py-24 text-center">
      <div className="max-w-lg">
        <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
          لوحة التحكم
        </p>
        <h1 className="font-cinzel text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          لوحة التحكم قريباً
        </h1>
        <p className="text-gray-600 mb-8">
          إدارة دعواتك، ردود الضيوف، والمزيد ستكون متاحة هنا قريباً.
        </p>
        <Link
          href="/"
          className="inline-block rounded-2xl px-6 py-3.5 text-sm font-semibold text-gray-800 bg-white/72 border border-[#C8A24A]/30"
        >
          العودة للرئيسية
        </Link>
      </div>
    </section>
  );
}
