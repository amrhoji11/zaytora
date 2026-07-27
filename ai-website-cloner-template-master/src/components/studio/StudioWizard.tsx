"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, LoaderIcon } from "@/components/icons";
import { createInvitation, getInvitation, updateInvitation } from "@/lib/services/invitations.service";
import type { InvitationDetail, UpdateInvitationPatch } from "@/types/studio";
import { WizardStepper } from "./WizardStepper";
import { DraftBanner, readLastInvitationId, rememberInvitation } from "./DraftBanner";
import { PhonePreview } from "./PhonePreview";
import { WIZARD_STEPS } from "./stepsConfig";

function buildPatch(detail: InvitationDetail): UpdateInvitationPatch {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, status, editUrl, createdAt, updatedAt, ...patch } = detail;
  return patch;
}

export function StudioWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invitationIdParam = searchParams.get("invitationId");

  const [form, setForm] = useState<InvitationDetail | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loadError, setLoadError] = useState(false);
  // Captured on first render, before this page load's own rememberInvitation()
  // call (below) can overwrite it — this is what makes it possible to detect
  // "you were previously working on a different draft".
  const [previousDraftId] = useState(readLastInvitationId);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      if (invitationIdParam) {
        try {
          const detail = await getInvitation(invitationIdParam);
          if (!cancelled) {
            setForm(detail);
            rememberInvitation(detail.id);
          }
          return;
        } catch (error) {
          console.error("[studio] failed to load invitation, starting a new draft:", error);
        }
      }

      try {
        const created = await createInvitation();
        if (cancelled) return;
        rememberInvitation(created.id);
        router.replace(`/studio?invitationId=${created.id}`);
        const detail = await getInvitation(created.id);
        if (!cancelled) setForm(detail);
      } catch (error) {
        console.error("[studio] failed to start a new draft:", error);
        if (!cancelled) setLoadError(true);
      }
    }

    init();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitationIdParam]);

  function updateForm(patch: Partial<InvitationDetail>) {
    setForm((current) => (current ? { ...current, ...patch } : current));
  }

  async function saveProgress() {
    if (!form) return;
    setSaving(true);
    try {
      await updateInvitation(form.id, buildPatch(form));
    } catch (error) {
      console.error("[studio] auto-save failed:", error);
    } finally {
      setSaving(false);
    }
  }

  async function handleNext() {
    await saveProgress();
    if (stepIndex === WIZARD_STEPS.length - 1) {
      setFinished(true);
    } else {
      setStepIndex((index) => index + 1);
    }
  }

  function handleBack() {
    setStepIndex((index) => Math.max(0, index - 1));
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg py-24 text-center">
        <p className="text-gray-600">تعذّر بدء الاستوديو. تأكد من تشغيل الخادم الخلفي وحاول مرة أخرى.</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex items-center justify-center py-32 text-gray-400">
        <LoaderIcon className="size-6 animate-spin" />
      </div>
    );
  }

  const step = WIZARD_STEPS[stepIndex];
  const StepIcon = step.icon;
  const StepComponent = step.Component;
  const remaining = WIZARD_STEPS.length - (stepIndex + 1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-lg font-semibold text-gray-900">إنشاء دعوة</h1>

      <WizardStepper activePhase="design" />
      <DraftBanner previousDraftId={previousDraftId} currentInvitationId={form.id} />

      <div className="grid gap-8 lg:grid-cols-[auto_1fr]">
        <div className="flex justify-center lg:justify-start">
          <PhonePreview value={form} />
        </div>

        <div className="rounded-2xl border border-gray-100 shadow-sm">
          {finished ? (
            <div className="flex flex-col items-center gap-4 px-6 py-16 text-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-gold/10 text-gold">
                <CheckIcon className="size-7" />
              </span>
              <div>
                <p className="text-lg font-semibold text-gray-900">تم حفظ دعوتك!</p>
                <p className="mt-1 text-sm text-gray-500">
                  المعاينة والدفع والمشاركة ستكون متاحة قريباً. يمكنك متابعة التعديل في أي وقت.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setFinished(false)}
                  className="rounded-xl border border-gold/30 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gold/5"
                >
                  متابعة التعديل
                </button>
                <Link
                  href="/"
                  className="rounded-xl bg-gold px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gold/90"
                >
                  العودة للرئيسية
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <StepIcon className="size-4" />
                  </span>
                  <span className="text-sm font-medium text-gray-700">{step.label}</span>
                </div>
                <span className="rounded-full border border-gold/20 bg-gold/5 px-3 py-1 text-xs text-gold">
                  {stepIndex + 1} / {WIZARD_STEPS.length}
                </span>
              </div>

              <div className="px-5 pb-2 pt-4">
                <p className="text-base font-medium text-gray-900">{step.question}</p>
              </div>

              <div className="px-5 py-4">
                <StepComponent value={form} onChange={updateForm} />
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3 text-xs text-gray-400">
                <span>خطوة {stepIndex + 1} / {WIZARD_STEPS.length}</span>
                <span>{remaining > 0 ? `${remaining} خطوة متبقية` : "الخطوة الأخيرة"}</span>
              </div>

              {/* Kept in physical left-to-right order (dir="ltr" on the row)
                  to match the reference site: Back stays on the left with
                  "<", Next/gold stays on the right with ">", regardless of
                  the page's overall RTL flow. */}
              <div dir="ltr" className="flex items-center justify-between gap-3 border-t border-gray-100 px-5 py-4">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={stepIndex === 0 || saving}
                  className="flex items-center gap-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors disabled:opacity-40"
                >
                  <ChevronLeftIcon className="size-4" />
                  رجوع
                </button>
                <span className="hidden text-sm text-gray-400 sm:inline">{step.label}</span>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={saving}
                  className={cn(
                    "flex items-center gap-1 rounded-xl bg-gold px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gold/90 disabled:opacity-60"
                  )}
                >
                  {saving ? (
                    <LoaderIcon className="size-4 animate-spin" />
                  ) : stepIndex === WIZARD_STEPS.length - 1 ? (
                    "إنهاء"
                  ) : (
                    <>
                      التالي
                      <ChevronRightIcon className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
