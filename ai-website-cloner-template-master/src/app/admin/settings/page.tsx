"use client";

import { useEffect, useState } from "react";
import { WifiIcon, InboxIcon, MailIcon, LoaderIcon, TrashIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import {
  listSupportMessages,
  markSupportMessageRead,
  deleteSupportMessage,
  deleteAllSupportMessages,
} from "@/lib/services/supportMessages.service";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { ContactSettingsForm } from "@/components/admin/ContactSettingsForm";
import { PaymentSettingsForm } from "@/components/admin/PaymentSettingsForm";
import type { SupportMessageDto } from "@/types/api";

const COPY = {
  ar: {
    subtitle: "إعدادات الدفع اليدوي ومعلومات التواصل، وصندوق رسائل الدعم.",
    connections: "حالة الاتصال",
    api: "واجهة برمجة التطبيقات",
    apiDesc: "خادم ASP.NET Core الخلفي",
    connected: "متصل",
    inbox: "صندوق رسائل الدعم",
    markRead: "تعليم كمقروء",
    unread: "غير مقروءة",
    noMessages: "لا توجد رسائل.",
    loadError: "تعذّر تحميل رسائل الدعم.",
    deleteMessage: "حذف الرسالة",
    deleteAll: "حذف الكل",
  },
  en: {
    subtitle: "Manual payment and contact settings, and the support message inbox.",
    connections: "Connection status",
    api: "API",
    apiDesc: "ASP.NET Core backend server",
    connected: "Connected",
    inbox: "Support message inbox",
    markRead: "Mark as read",
    unread: "Unread",
    noMessages: "No messages.",
    loadError: "Couldn't load support messages.",
    deleteMessage: "Delete message",
    deleteAll: "Delete all",
  },
};

function formatDate(iso: string, language: "ar" | "en") {
  return new Date(iso).toLocaleString(language === "ar" ? "ar-EG" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSettingsPage() {
  const { language } = useLanguage();
  const t = COPY[language];
  const [messages, setMessages] = useState<SupportMessageDto[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listSupportMessages()
      .then((list) => {
        if (!cancelled) setMessages(list);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const unreadCount = messages?.filter((message) => !message.read).length ?? 0;

  async function markRead(id: string) {
    setMessages((current) => current?.map((message) => (message.id === id ? { ...message, read: true } : message)) ?? current);
    try {
      await markSupportMessageRead(id);
    } catch (error) {
      console.error("[admin/settings] failed to mark message read:", error);
    }
  }

  async function deleteMessage(id: string) {
    setBusyId(id);
    try {
      await deleteSupportMessage(id);
      setMessages((current) => current?.filter((message) => message.id !== id) ?? current);
    } catch (error) {
      console.error("[admin/settings] failed to delete message:", error);
    } finally {
      setBusyId(null);
    }
  }

  async function deleteAll() {
    setDeletingAll(true);
    try {
      await deleteAllSupportMessages();
      setMessages([]);
    } catch (error) {
      console.error("[admin/settings] failed to delete all messages:", error);
    } finally {
      setDeletingAll(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{t.subtitle}</p>

      <ContactSettingsForm language={language} />

      <PaymentSettingsForm language={language} />

      <div>
        <p className="mb-3 text-sm font-semibold text-foreground">{t.connections}</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400">
                <WifiIcon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{t.api}</p>
                <p className="text-xs text-muted-foreground">{t.apiDesc}</p>
              </div>
            </div>
            <StatusBadge tone="success">{t.connected}</StatusBadge>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]">
        <div className="mb-4 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <InboxIcon className="size-4 text-muted-foreground" />
            {t.inbox}
          </p>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && <StatusBadge tone="warning">{`${unreadCount} ${t.unread}`}</StatusBadge>}
            {messages !== null && messages.length > 0 && (
              <button
                type="button"
                onClick={deleteAll}
                disabled={deletingAll}
                className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-rose-100 hover:text-rose-700 disabled:opacity-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
              >
                {deletingAll ? <LoaderIcon className="size-3.5 animate-spin" /> : <TrashIcon className="size-3.5" />}
                {t.deleteAll}
              </button>
            )}
          </div>
        </div>

        {loadError ? (
          <p className="py-8 text-center text-sm text-rose-600 dark:text-rose-400">{t.loadError}</p>
        ) : messages === null ? (
          <div className="flex justify-center py-8">
            <LoaderIcon className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t.noMessages}</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {messages.map((message) => (
              <li key={message.id} className={cn("flex items-start gap-3 py-4", !message.read && "bg-blue-100 dark:bg-blue-950/20")}>
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background/10 text-muted-foreground">
                  <MailIcon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground">{message.subject}</p>
                    <span className="text-xs text-muted-foreground">{formatDate(message.receivedAt, language)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {message.name} · <span dir="ltr">{message.email}</span>
                  </p>
                  <p className="mt-1 text-sm text-body-foreground">{message.message}</p>
                  {!message.read && (
                    <button
                      type="button"
                      onClick={() => markRead(message.id)}
                      className="mt-2 text-xs font-medium text-[#C8A24A] hover:text-[#A68832]"
                    >
                      {t.markRead}
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => deleteMessage(message.id)}
                  disabled={busyId === message.id}
                  aria-label={t.deleteMessage}
                  title={t.deleteMessage}
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-rose-100 hover:text-rose-700 disabled:opacity-50 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
                >
                  {busyId === message.id ? (
                    <LoaderIcon className="size-3.5 animate-spin" />
                  ) : (
                    <TrashIcon className="size-3.5" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
