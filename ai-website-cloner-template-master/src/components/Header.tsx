"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { OliveMark } from "@/components/OliveMark";
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
import { Moon, Sun } from "lucide-react";
import { deleteAccount } from "@/lib/services/account.service";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { DeleteAccountDialog } from "@/components/DeleteAccountDialog";
import { useAccountNotifications, warmUpAudio } from "@/hooks/useAccountNotifications";

const NAV_KEYS = ["home", "templates", "studio", "guide", "pricing", "partners"] as const;
const NAV_HREFS: Record<(typeof NAV_KEYS)[number], string> = {
  home: "/",
  templates: "/#templates",
  studio: "/studio",
  guide: "/guide",
  pricing: "/Prices",
  partners: "/OurPartners",
};

const MOBILE_NAV_KEYS = ["home", "templates", "studio", "dashboard"] as const;
const MOBILE_NAV_ICONS: Record<(typeof MOBILE_NAV_KEYS)[number], LucideIcon> = {
  home: HomeIcon,
  templates: TemplatesIcon,
  studio: StudioIcon,
  dashboard: DashboardIcon,
};
const MOBILE_NAV_HREFS: Record<(typeof MOBILE_NAV_KEYS)[number], string> = {
  home: "/",
  templates: "/#templates",
  studio: "/studio",
  dashboard: "/dashboard",
};

// Hash links (e.g. "/#templates") point at sections of the home page rather
// than a distinct route, so they never register as the active page.
function isActiveHref(pathname: string, href: string) {
  return !href.includes("#") && pathname === href;
}

const ACCOUNT_MENU_ITEMS = [
  {
    id: "myInvitations",
    emoji: "🗂️",
    href: "/dashboard",
    className: "text-gray-700 hover:bg-[#C8A24A]/8 hover:text-[#C8A24A]",
  },
  {
    id: "accountSettings",
    emoji: "⚙️",
    href: "/account",
    className: "text-gray-700 hover:bg-[#C8A24A]/8 hover:text-[#C8A24A]",
  },
  {
    id: "admin",
    emoji: "🛠️",
    href: "/admin",
    className: "text-gray-700 hover:bg-[#C8A24A]/8 hover:text-[#C8A24A]",
  },
  {
    id: "business-mode",
    emoji: "🤝",
    href: "/OurPartners",
    className: "text-gray-700 hover:bg-[#C8A24A]/8 hover:text-[#C8A24A]",
  },
  { id: "divider", divider: true },
  {
    id: "logout",
    emoji: "🚪",
    className: "text-red-500 hover:bg-red-50",
  },
  {
    id: "delete-account",
    emoji: "🗑️",
    className: "text-red-600 hover:bg-red-50",
  },
] as const;

const COPY = {
  ar: {
    nav: { home: "الرئيسية", templates: "القوالب", studio: "الاستوديو", guide: "الدليل", pricing: "الأسعار", partners: "شركاؤنا" },
    mobileNav: { home: "الرئيسية", templates: "القوالب", studio: "الاستوديو", dashboard: "لوحة التحكم" },
    contact: "تواصل معنا",
    account: "الحساب",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    accountMenu: {
      myInvitations: "دعواتي",
      accountSettings: "إعدادات الحساب",
      admin: "لوحة التحكم",
      "business-mode": "Business Mode",
      logout: "تسجيل الخروج",
      "delete-account": "Delete Account",
    } as Record<string, string>,
    toggleLanguageAria: "تبديل اللغة",
    toggleThemeAria: "تبديل الوضع الداكن/الفاتح",
    notifications: {
      newOrders: "طلبات جديدة",
      newPartners: "طلب شراكة جديد",
      newRsvp: (count: number) => `${count} ${count === 1 ? "رد جديد" : "ردود جديدة"}`,
    },
  },
  en: {
    nav: { home: "Home", templates: "Templates", studio: "Studio", guide: "Guide", pricing: "Pricing", partners: "Our Partners" },
    mobileNav: { home: "Home", templates: "Templates", studio: "Studio", dashboard: "Dashboard" },
    contact: "Contact Us",
    account: "Account",
    login: "Log In",
    signup: "Sign Up",
    accountMenu: {
      myInvitations: "My Invitations",
      accountSettings: "Account Settings",
      admin: "Admin Dashboard",
      "business-mode": "Business Mode",
      logout: "Log Out",
      "delete-account": "Delete Account",
    } as Record<string, string>,
    toggleLanguageAria: "Toggle language",
    toggleThemeAria: "Toggle dark/light mode",
    notifications: {
      newOrders: "New orders",
      newPartners: "New partner application",
      newRsvp: (count: number) => `${count} new response${count === 1 ? "" : "s"}`,
    },
  },
};

// Native-script label for the language the switcher will change *to* (not
// the current one) — matches numinds.me, where the button reads "EN" while
// browsing in Arabic and "عربي" once switched to English.
const TOGGLE_LABEL: Record<string, string> = { ar: "EN", en: "عربي" };

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, toggleLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, loading: authLoading, logout: authLogout, refresh: authRefresh } = useAuth();
  const t = COPY[language];
  const [accountOpen, setAccountOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  const { hasUnread, hasNewOrders, hasNewPartners, newRsvpCount, markAllSeen } = useAccountNotifications();

  // AudioContext playback is blocked until the page has seen a user
  // gesture — warm it up on the first click/keypress so it's ready by the
  // time a notification actually needs to chime.
  useEffect(() => {
    function handleFirstGesture() {
      warmUpAudio();
      document.removeEventListener("pointerdown", handleFirstGesture);
      document.removeEventListener("keydown", handleFirstGesture);
    }
    document.addEventListener("pointerdown", handleFirstGesture);
    document.addEventListener("keydown", handleFirstGesture);
    return () => {
      document.removeEventListener("pointerdown", handleFirstGesture);
      document.removeEventListener("keydown", handleFirstGesture);
    };
  }, []);

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

  // Snapshot of what triggered the badge, captured at the moment the menu
  // opens (before markAllSeen clears the underlying flags) so the dropdown
  // can still show what was new, then cleared once the menu closes.
  const [justSeenSummary, setJustSeenSummary] = useState<{
    orders: boolean;
    partners: boolean;
    rsvp: number;
  } | null>(null);

  useEffect(() => {
    if (!accountOpen) setJustSeenSummary(null);
  }, [accountOpen]);

  function handleToggleAccount() {
    setAccountOpen((open) => {
      const opening = !open;
      if (opening && hasUnread) {
        setJustSeenSummary({ orders: hasNewOrders, partners: hasNewPartners, rsvp: newRsvpCount });
        markAllSeen();
      }
      return opening;
    });
  }

  async function handleMenuAction(id: string) {
    if (id === "logout") {
      setPendingAction("logout");
      try {
        await authLogout();
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
      setAccountOpen(false);
      setDeleteDialogOpen(true);
      return;
    }

    setAccountOpen(false);
  }

  async function handleConfirmDeleteAccount() {
    setPendingAction("delete-account");
    try {
      await deleteAccount();
      await authRefresh();
      setDeleteDialogOpen(false);
      router.push("/");
    } catch (error) {
      console.error("[account] delete account request failed:", error);
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <>
      <header className="glass-effect fixed inset-x-0 top-0 z-50 h-20 py-5">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-1 font-cinzel text-base font-semibold tracking-widest text-olive-vivid uppercase sm:gap-1.5 sm:text-lg"
          >
            <OliveMark className="h-5 w-6 shrink-0" />
            ZAYTORA
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {NAV_KEYS.map((key) => (
              <Link
                key={key}
                href={NAV_HREFS[key]}
                className={cn(
                  "text-sm transition-colors duration-200 hover:text-gold",
                  isActiveHref(pathname, NAV_HREFS[key]) ? "text-gold font-medium" : "text-gray-700"
                )}
              >
                {t.nav[key]}
              </Link>
            ))}
            <Link
              href="/contact-us"
              className="rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-sm text-gold transition-colors duration-200 hover:bg-gold/20"
            >
              {t.contact}
            </Link>
          </nav>

          {/* gap-1.5 on mobile (sm:gap-4 restores the roomier desktop spacing)
              — at gap-4 across every breakpoint, this cluster's total width
              (auth links + language toggle + theme toggle) ran wider than a
              narrow phone's viewport, pushing the language/theme buttons
              off-screen entirely (negative getBoundingClientRect x) instead
              of wrapping or scrolling into view. */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-4">
            {authLoading ? (
              <div className="h-8 w-24 animate-pulse rounded-full bg-gray-100" />
            ) : user ? (
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={handleToggleAccount}
                  aria-expanded={accountOpen}
                  aria-haspopup="menu"
                  className="relative flex items-center gap-2 rounded-full border border-gold/20 bg-white/60 px-3 py-1.5"
                >
                  <span className="relative flex size-6 items-center justify-center rounded-full bg-gray-100">
                    <UserIcon className="size-4 text-gray-600" />
                    {hasUnread && (
                      <span className="absolute -top-0.5 -left-0.5 size-2.5 animate-pulse rounded-full bg-rose-500 ring-2 ring-white" />
                    )}
                  </span>
                  <span className="hidden text-sm text-gray-700 sm:inline">{user.displayName || t.account}</span>
                </button>

                {accountOpen && (
                  <div
                    role="menu"
                    className="absolute left-0 top-[calc(100%+0.5rem)] w-52 overflow-hidden rounded-xl border border-gray-100 bg-white p-1 shadow-xl"
                  >
                    {justSeenSummary && (
                      <div className="mb-1 space-y-1 rounded-lg bg-[#C8A24A]/8 px-2.5 py-2 text-xs text-gray-700">
                        {justSeenSummary.orders && (
                          <Link href="/admin/orders" onClick={() => setAccountOpen(false)} className="block hover:text-[#C8A24A]">
                            📦 {t.notifications.newOrders}
                          </Link>
                        )}
                        {justSeenSummary.partners && (
                          <Link href="/admin/partners" onClick={() => setAccountOpen(false)} className="block hover:text-[#C8A24A]">
                            🤝 {t.notifications.newPartners}
                          </Link>
                        )}
                        {justSeenSummary.rsvp > 0 && (
                          <Link href="/dashboard" onClick={() => setAccountOpen(false)} className="block hover:text-[#C8A24A]">
                            💌 {t.notifications.newRsvp(justSeenSummary.rsvp)}
                          </Link>
                        )}
                      </div>
                    )}
                    {ACCOUNT_MENU_ITEMS.filter((item) => item.id !== "admin" || user.isAdmin).map((item) =>
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
                          {t.accountMenu[item.id]}
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
                          {pendingAction === item.id ? "..." : t.accountMenu[item.id]}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Link
                  href="/login"
                  className="rounded-full border border-gold/20 bg-white/60 px-2 py-1 text-xs text-gray-700 transition-colors hover:bg-white sm:px-3.5 sm:py-1.5 sm:text-sm"
                >
                  {t.login}
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-gold px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-gold/90 sm:px-3.5 sm:py-1.5 sm:text-sm"
                >
                  {t.signup}
                </Link>
              </div>
            )}

            <button
              type="button"
              onClick={toggleLanguage}
              aria-label={t.toggleLanguageAria}
              className="flex items-center gap-1.5 rounded-full border border-gold/20 bg-white/60 px-1.5 py-1.5 text-sm text-gray-700 sm:px-3"
            >
              <GlobeIcon className="size-4" />
              {/* Text label only past sm — on mobile this button stays
                  icon-only (matching the theme toggle beside it) purely to
                  save width; the aria-label still names it for a11y. */}
              <span className="hidden sm:inline">{TOGGLE_LABEL[language]}</span>
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t.toggleThemeAria}
              className="flex items-center justify-center rounded-full border border-gold/20 bg-white/60 p-1.5 text-gray-700 sm:p-2"
            >
              {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>
          </div>
        </div>
      </header>

      <nav className="glass-effect fixed inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 md:hidden">
        {MOBILE_NAV_KEYS.map((key) => {
          const Icon = MOBILE_NAV_ICONS[key];
          const href = MOBILE_NAV_HREFS[key];
          return (
            <Link
              key={key}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs",
                isActiveHref(pathname, href) ? "text-gold" : "text-gray-600"
              )}
            >
              <Icon className="size-5" />
              <span>{t.mobileNav[key]}</span>
            </Link>
          );
        })}
      </nav>

      <DeleteAccountDialog
        open={deleteDialogOpen}
        pending={pendingAction === "delete-account"}
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => setDeleteDialogOpen(false)}
      />
    </>
  );
}
