"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "@/components/icons";
import { OliveMark } from "@/components/OliveMark";
import { useLanguage } from "@/context/LanguageContext";
import { ADMIN_NAV } from "./adminNav";

const COPY = {
  ar: { brand: "لوحة تحكم ZAYTORA", backToSite: "العودة للموقع" },
  en: { brand: "ZAYTORA Admin", backToSite: "Back to site" },
};

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const t = COPY[language];

  return (
    <aside className="fixed inset-y-0 start-0 z-30 hidden w-64 flex-col border-e border-border bg-card lg:flex">
      <div className="flex h-20 items-center border-b border-border px-6">
        <Link href="/admin" className="flex items-center gap-1.5 font-cinzel text-lg font-semibold tracking-widest text-olive-vivid uppercase">
          <OliveMark className="h-5 w-6 shrink-0" />
          ZAYTORA
        </Link>
      </div>

      <p className="px-6 pt-5 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{t.brand}</p>

      <nav className="flex-1 space-y-1 px-3">
        {ADMIN_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-[#C8A24A]/10 text-[#A68832]" : "text-body-foreground hover:bg-background/10 hover:text-foreground"
              )}
            >
              <Icon className={cn("size-5 shrink-0", active ? "text-[#C8A24A]" : "text-muted-foreground")} />
              {item.label[language]}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background/10 hover:text-foreground"
        >
          <ChevronLeftIcon className="size-5 shrink-0" />
          {t.backToSite}
        </Link>
      </div>
    </aside>
  );
}
