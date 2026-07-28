"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
import { deleteAccount, logout } from "@/lib/services/account.service";

const NAV_LINKS = [
  { label: "الرئيسية", href: "/" },
  { label: "القوالب", href: "/#templates" },
  { label: "الاستوديو", href: "/studio" },
  { label: "الدليل", href: "/guide" },
  { label: "الأسعار", href: "/#pricing" },
  { label: "شركاؤنا", href: "/#partners" },
];

const MOBILE_NAV_ITEMS: { label: string; icon: LucideIcon; href: string }[] = [
  { label: "الرئيسية", icon: HomeIcon, href: "/" },
  { label: "القوالب", icon: TemplatesIcon, href: "/#templates" },
  { label: "الاستوديو", icon: StudioIcon, href: "/studio" },
  { label: "لوحة التحكم", icon: DashboardIcon, href: "/dashboard" },
];

// Hash links (e.g. "/#templates") point at sections of the home page rather
// than a distinct route, so they never register as the active page.
function isActiveHref(pathname: string, href: string) {
  return !href.includes("#") && pathname === href;
}

const ACCOUNT_MENU_ITEMS = [
  {
    id: "dashboard",
    label: "لوحة التحكم",
    emoji: "🗂️",
    href: "/dashboard",
    className: "text-gray-700 hover:bg-[#C8A24A]/8 hover:text-[#C8A24A]",
  },
  {
    id: "business-mode",
    label: "Business Mode",
    emoji: "🤝",
    className: "text-gray-700 hover:bg-[#C8A24A]/8 hover:text-[#C8A24A]",
  },
  { id: "divider", divider: true },
  {
    id: "logout",
    label: "تسجيل الخروج",
    emoji: "🚪",
    className: "text-red-500 hover:bg-red-50",
  },
  {
    id: "delete-account",
    label: "Delete Account",
    emoji: "🗑️",
    className: "text-red-600 hover:bg-red-50",
  },
] as const;

const LANGUAGES = ["AR", "EN"] as const;
type Language = (typeof LANGUAGES)[number];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [accountOpen, setAccountOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("AR");
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accountOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setAccountOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [accountOpen]);

  useEffect(() => {
    document.documentElement.dir = language === "AR" ? "rtl" : "ltr";
    document.documentElement.lang = language === "AR" ? "ar" : "en";
  }, [language]);

  function toggleLanguage() {
    setLanguage((current) => LANGUAGES[(LANGUAGES.indexOf(current) + 1) % LANGUAGES.length]);
  }

  async function handleMenuAction(id: string) {
    if (id === "logout") {
      setPendingAction("logout");
      try {
        await logout();
      } catch (error) {
        console.error("[account] logout request failed:", error);
      } finally {
        setPendingAction(null);
        setAccountOpen(false);
        router.push("/");
      }
      return;
    }

    if (id === "delete-account") {
      if (!window.confirm("هل أنت متأكد من حذف حسابك؟ لا يمكن التراجع عن هذا الإجراء.")) {
        return;
      }
      setPendingAction("delete-account");
      try {
        await deleteAccount();
        router.push("/");
      } catch (error) {
        console.error("[account] delete account request failed:", error);
      } finally {
        setPendingAction(null);
        setAccountOpen(false);
      }
      return;
    }

    setAccountOpen(false);
  }

  return (
    <>
      <header className="glass-effect fixed inset-x-0 top-0 z-50 h-20 py-5">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="font-cinzel shrink-0 text-lg font-semibold tracking-widest text-gold uppercase"
          >
            NUMINDS
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm transition-colors duration-200 hover:text-gold",
                  isActiveHref(pathname, link.href) ? "text-gold font-medium" : "text-gray-700"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/#contact"
              className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold transition-colors duration-200 hover:bg-gold/20"
            >
              تواصل معنا
            </Link>
          </nav>

          <div className="flex shrink-0 items-center gap-4">
            <div ref={accountRef} className="relative">
              <button
                type="button"
                onClick={() => setAccountOpen((open) => !open)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                className="relative flex items-center gap-2 rounded-full border border-gold/20 bg-white/60 px-3 py-1.5"
              >
                <span className="relative flex size-6 items-center justify-center rounded-full bg-gray-100">
                  <UserIcon className="size-4 text-gray-600" />
                  <span className="absolute -top-0.5 -left-0.5 size-2 rounded-full bg-gold ring-2 ring-white" />
                </span>
                <span className="hidden text-sm text-gray-700 sm:inline">الحساب</span>
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="absolute left-0 top-[calc(100%+0.5rem)] w-52 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl"
                >
                  {ACCOUNT_MENU_ITEMS.map((item) =>
                    "divider" in item ? (
                      <div key={item.id} className="my-1 h-px bg-gray-200/60" />
                    ) : "href" in item && item.href ? (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setAccountOpen(false)}
                        className={cn(
                          "flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
                          item.className
                        )}
                      >
                        <span>{item.emoji}</span>
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        key={item.id}
                        type="button"
                        role="menuitem"
                        disabled={pendingAction === item.id}
                        onClick={() => handleMenuAction(item.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-right text-sm font-medium transition-colors disabled:opacity-50",
                          item.className
                        )}
                      >
                        <span>{item.emoji}</span>
                        {pendingAction === item.id ? "..." : item.label}
                      </button>
                    )
                  )}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleLanguage}
              aria-label="تبديل اللغة"
              className="flex items-center gap-1.5 rounded-full border border-gold/20 bg-white/60 px-3 py-1.5 text-sm text-gray-700"
            >
              <GlobeIcon className="size-4" />
              {language}
            </button>
          </div>
        </div>
      </header>

      <nav className="glass-effect fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 md:hidden">
        {MOBILE_NAV_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs",
              isActiveHref(pathname, item.href) ? "text-gold" : "text-gray-600"
            )}
          >
            <item.icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
