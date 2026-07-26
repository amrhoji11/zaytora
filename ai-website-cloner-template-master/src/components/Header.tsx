import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DashboardIcon,
  GlobeIcon,
  HomeIcon,
  StudioIcon,
  TemplatesIcon,
  UserIcon,
} from "@/components/icons";

const NAV_LINKS = [
  { label: "الرئيسية", active: true },
  { label: "القوالب" },
  { label: "الاستوديو" },
  { label: "الدليل" },
  { label: "الأسعار" },
  { label: "شركاؤنا" },
];

const MOBILE_NAV_ITEMS: { label: string; icon: LucideIcon; active?: boolean }[] = [
  { label: "الرئيسية", icon: HomeIcon, active: true },
  { label: "القوالب", icon: TemplatesIcon },
  { label: "الاستوديو", icon: StudioIcon },
  { label: "لوحة التحكم", icon: DashboardIcon },
];

export function Header() {
  return (
    <>
      <header className="glass-effect fixed inset-x-0 top-0 z-50 h-20 py-5">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a
            href="#"
            className="font-cinzel shrink-0 text-lg font-semibold tracking-widest text-gold uppercase"
          >
            NUMINDS
          </a>

          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href="#"
                className={cn(
                  "text-sm transition-colors duration-200 hover:text-gold",
                  link.active ? "text-gold font-medium" : "text-gray-700"
                )}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold transition-colors duration-200 hover:bg-gold/20"
            >
              تواصل معنا
            </a>
          </nav>

          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              className="relative flex items-center gap-2 rounded-full border border-gold/20 bg-white/60 px-3 py-1.5"
            >
              <span className="relative flex size-6 items-center justify-center rounded-full bg-gray-100">
                <UserIcon className="size-4 text-gray-600" />
                <span className="absolute -top-0.5 -left-0.5 size-2 rounded-full bg-gold ring-2 ring-white" />
              </span>
              <span className="hidden text-sm text-gray-700 sm:inline">الحساب</span>
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border border-gold/20 bg-white/60 px-3 py-1.5 text-sm text-gray-700"
            >
              <GlobeIcon className="size-4" />
              EN
            </button>
          </div>
        </div>
      </header>

      <nav className="glass-effect fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 md:hidden">
        {MOBILE_NAV_ITEMS.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs",
              item.active ? "text-gold" : "text-gray-600"
            )}
          >
            <item.icon className="size-5" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </>
  );
}
