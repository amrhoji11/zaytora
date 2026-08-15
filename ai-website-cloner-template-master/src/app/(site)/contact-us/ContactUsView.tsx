"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getContactSettings } from "@/lib/services/contactSettings.service";
import { submitSupportMessage } from "@/lib/services/supportMessages.service";
import { useEmailCopyToast } from "@/hooks/useEmailCopyToast";
import { ApiError } from "@/lib/api/client";
import type { ContactSettingsDto } from "@/types/api";
import { ClockIcon, GlobeIcon, InstagramIcon, LoaderIcon, MailIcon, TikTokIcon, WhatsAppIcon } from "@/components/icons";

const COPY = {
  ar: {
    heading: "اتصل بنا",
    subheading:
      "24 ساعة في اليوم، 7 أيام في الأسبوع — لا يوجد سؤال صغير. تواصل معنا عبر أي قناة وسيكون أحد أعضاء فريقنا معك قريباً.",
    emailLabel: "راسلنا",
    whatsappLabel: (code: string) => `WHATSAPP ${code}`,
    responseTimesHeading: "أوقات الرد",
    availableDaily: "24 ساعة في اليوم",
    availableWeekly: "7 أيام في الأسبوع",
    emailCta: "أرسل لنا بريداً إلكترونياً",
    supportEyebrow: "دعم العملاء",
    heroHeading: "نحن هنا من أجلك",
    heroBody: "نسعى للرد على جميع الاستفسارات في أقرب وقت ممكن.",
    responseTimeStat: "وقت الاستجابة",
    availabilityStat: "أوقات التواجد",
    availableWorldwide: "متوفرون حول العالم",
    stayInTouch: "ابق على تواصل",
    followUs: "تابعنا",
    email: "Email",
    copied: (address: string) => `تم نسخ ${address} — الصقه في تطبيق البريد الذي تفضّله.`,
  },
  en: {
    heading: "Contact Us",
    subheading:
      "24 hours a day, 7 days a week — no question is too small. Reach us through any channel and a team member will be with you shortly.",
    emailLabel: "Email us",
    whatsappLabel: (code: string) => `WHATSAPP ${code}`,
    responseTimesHeading: "Response times",
    availableDaily: "24 hours a day",
    availableWeekly: "7 days a week",
    emailCta: "Send us an email",
    supportEyebrow: "Customer support",
    heroHeading: "We're here for you",
    heroBody: "We aim to reply to every inquiry as soon as possible.",
    responseTimeStat: "Response time",
    availabilityStat: "Availability",
    availableWorldwide: "Available worldwide",
    stayInTouch: "Stay in touch",
    followUs: "Follow us",
    email: "Email",
    copied: (address: string) => `Copied ${address} — paste it into your preferred mail app.`,
  },
};

const FORM_COPY = {
  ar: {
    heading: "أرسل لنا رسالة",
    subheading: "عبّي الفورم وبنرد عليك أقرب وقت ممكن.",
    name: "الاسم",
    email: "البريد الإلكتروني",
    subject: "الموضوع",
    message: "الرسالة",
    send: "إرسال",
    sending: "جارٍ الإرسال...",
    success: "تم إرسال رسالتك بنجاح — بنتواصل معك قريباً.",
    genericError: "تعذّر إرسال الرسالة، حاول مرة أخرى.",
  },
  en: {
    heading: "Send us a message",
    subheading: "Fill in the form and we'll get back to you as soon as possible.",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    send: "Send",
    sending: "Sending...",
    success: "Your message was sent — we'll be in touch soon.",
    genericError: "Couldn't send your message. Please try again.",
  },
};

// ISO 3166-1 alpha-2 -> flag emoji (each letter maps to a regional indicator
// symbol) — lets the admin add any country's WhatsApp number without this
// page needing a matching flag image shipped for it.
function flagEmoji(countryCode: string) {
  const code = countryCode.trim().toUpperCase();
  if (code.length !== 2) return "🌐";
  return String.fromCodePoint(...[...code].map((char) => 127397 + char.charCodeAt(0)));
}

export function ContactUsView() {
  const { language } = useLanguage();
  const t = COPY[language];
  const ft = FORM_COPY[language];
  const [settings, setSettings] = useState<ContactSettingsDto | null>(null);
  const { copiedAddress, handleEmailClick } = useEmailCopyToast();

  const [name, setName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSending(true);
    setFormError(null);
    try {
      await submitSupportMessage({ name, email: formEmail, subject, message });
      setSent(true);
      setName("");
      setFormEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      setFormError(error instanceof ApiError ? error.message : ft.genericError);
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    getContactSettings()
      .then((data) => {
        if (!cancelled) setSettings(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const email = settings?.email ?? "";
  const whatsAppNumbers = settings?.whatsAppNumbers ?? [];

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 text-center">
          <h1 className="font-cinzel text-4xl font-bold text-foreground md:text-5xl">{t.heading}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-body-foreground">{t.subheading}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: channel list + response-time box + email CTA */}
          <div className="rounded-3xl border border-border bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.15)]">
            <div className="space-y-5">
              {email && (
                <a
                  href={`mailto:${email}`}
                  onClick={() => handleEmailClick(email)}
                  className="flex items-center justify-between gap-4 border-b border-white/10 pb-5 transition-opacity hover:opacity-70"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.emailLabel}</p>
                    <p className="mt-1 text-sm font-medium text-foreground" dir="ltr">
                      {email}
                    </p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#C8A24A]/10 text-[#C8A24A]">
                    <MailIcon className="size-5" />
                  </span>
                </a>
              )}

              {whatsAppNumbers.map((entry) => (
                <a
                  key={entry.countryCode + entry.phoneNumber}
                  href={`https://wa.me/${entry.phoneNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 border-b border-white/10 pb-5 transition-opacity last:border-b-0 last:pb-0 hover:opacity-70"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {flagEmoji(entry.countryCode)} {t.whatsappLabel(entry.countryCode)}
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground" dir="ltr">
                      {entry.phoneNumber}
                    </p>
                  </div>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#25D366]/10 text-[#20BA5A]">
                    <WhatsAppIcon className="size-5" />
                  </span>
                </a>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-background/5 p-5">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-card text-[#C8A24A] shadow-sm">
                <ClockIcon className="size-5" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.responseTimesHeading}</p>
                <p className="text-sm font-semibold text-foreground">{t.availableDaily}</p>
                <p className="text-sm font-semibold text-foreground">{t.availableWeekly}</p>
              </div>
            </div>

            {email && (
              <a
                href={`mailto:${email}`}
                onClick={() => handleEmailClick(email)}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                <MailIcon className="size-4" />
                {t.emailCta}
              </a>
            )}
          </div>

          {/* Right: "we're here for you" panel + stats + full contact list + socials */}
          <div className="flex flex-col rounded-3xl border border-border bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.15)]">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-[#C8A24A]">{t.supportEyebrow}</p>
              <h2 className="mt-2 font-cinzel text-2xl font-bold text-foreground">{t.heroHeading}</h2>
              <p className="mt-2 text-sm text-body-foreground">{t.heroBody}</p>
            </div>

            {settings && (
              <div className="mt-6 flex items-center gap-8 border-b border-white/10 pb-6">
                <div>
                  <p className="text-xl font-bold text-foreground" dir="ltr">
                    {settings.responseTimeText}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.responseTimeStat}</p>
                </div>
                <div className="h-8 w-px bg-background/10" />
                <div>
                  <p className="text-xl font-bold text-foreground" dir="ltr">
                    {settings.availabilityText}
                  </p>
                  <p className="text-xs text-muted-foreground">{t.availabilityStat}</p>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {email && (
                <a
                  href={`mailto:${email}`}
                  onClick={() => handleEmailClick(email)}
                  className="flex items-center gap-3 text-sm text-body-foreground hover:text-foreground"
                >
                  <MailIcon className="size-4 text-muted-foreground" />
                  <span dir="ltr">{email}</span>
                </a>
              )}
              {settings?.secondaryEmail && (
                <a
                  href={`mailto:${settings.secondaryEmail}`}
                  onClick={() => handleEmailClick(settings.secondaryEmail!)}
                  className="flex items-center gap-3 text-sm text-body-foreground hover:text-foreground"
                >
                  <MailIcon className="size-4 text-muted-foreground" />
                  <span dir="ltr">{settings.secondaryEmail}</span>
                </a>
              )}
              {whatsAppNumbers.map((entry) => (
                <a
                  key={`right-${entry.countryCode}-${entry.phoneNumber}`}
                  href={`https://wa.me/${entry.phoneNumber.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-body-foreground hover:text-foreground"
                >
                  <WhatsAppIcon className="size-4 text-muted-foreground" />
                  <span dir="ltr">{entry.phoneNumber}</span>
                </a>
              ))}
              {settings?.availableWorldwide && (
                <div className="flex items-center gap-3 text-sm text-body-foreground">
                  <GlobeIcon className="size-4 text-muted-foreground" />
                  {t.availableWorldwide}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact form — public submissions land in the admin's support
            inbox (/admin/settings) via POST /api/support-messages. */}
        <div className="mt-8 rounded-3xl border border-border bg-card p-8 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.15)]">
          <h2 className="font-cinzel text-2xl font-bold text-foreground">{ft.heading}</h2>
          <p className="mt-2 text-sm text-body-foreground">{ft.subheading}</p>

          {sent ? (
            <p className="mt-6 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-100 dark:bg-emerald-950/30 px-5 py-4 text-sm text-emerald-700 dark:text-emerald-400">
              {ft.success}
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm text-body-foreground">{ft.name}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background/5 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-body-foreground">{ft.email}</label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={formEmail}
                  onChange={(event) => setFormEmail(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background/5 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm text-body-foreground">{ft.subject}</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="w-full rounded-xl border border-border bg-background/5 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm text-body-foreground">{ft.message}</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="w-full resize-none rounded-xl border border-border bg-background/5 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gold"
                />
              </div>

              {formError && (
                <p className="sm:col-span-2 rounded-lg border border-red-200 dark:border-red-900/40 bg-red-100 dark:bg-red-950/30 px-3 py-2 text-sm text-red-700 dark:text-red-400" dir="auto">
                  {formError}
                </p>
              )}

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#C8A24A] to-[#A68832] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {sending ? <LoaderIcon className="size-4 animate-spin" /> : null}
                  {sending ? ft.sending : ft.send}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Full-width "follow us" row — always shows Email/Instagram/TikTok
            (not gated on instagramUrl/tikTokUrl being set yet) so the section
            reads the same as the reference design from day one; Instagram/
            TikTok just link nowhere useful (#) until an admin fills in the
            real handle via /admin/settings. */}
        <div className="mt-16 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-[#C8A24A]">{t.stayInTouch}</p>
          <h2 className="mt-2 font-cinzel text-2xl font-bold text-foreground">{t.followUs}</h2>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <a
              href={email ? `mailto:${email}` : "#"}
              onClick={email ? () => handleEmailClick(email) : undefined}
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background/5 px-6 py-8 transition-colors hover:bg-background/10"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-[#C8A24A]/15 text-[#C8A24A]">
                <MailIcon className="size-6" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#C8A24A]">{t.email}</span>
            </a>
            <a
              href={settings?.instagramUrl || "#"}
              target={settings?.instagramUrl ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background/5 px-6 py-8 transition-colors hover:bg-background/10"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-400">
                <InstagramIcon className="size-6" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-pink-700 dark:text-pink-400">Instagram</span>
            </a>
            <a
              href={settings?.tikTokUrl || "#"}
              target={settings?.tikTokUrl ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-background/5 px-6 py-8 transition-colors hover:bg-background/10"
            >
              <span className="flex size-14 items-center justify-center rounded-full bg-background/10 text-foreground">
                <TikTokIcon className="size-6" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground">TikTok</span>
            </a>
          </div>
        </div>
      </div>

      {copiedAddress && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <p className="rounded-full bg-gray-900 px-5 py-2.5 text-xs font-medium text-white shadow-lg" dir="auto">
            {t.copied(copiedAddress)}
          </p>
        </div>
      )}
    </div>
  );
}
