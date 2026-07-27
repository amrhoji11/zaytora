"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ComponentType } from "react";
import {
  WhatsAppIcon,
  CalendarIcon,
  MailIcon,
  PhoneIcon,
  HeartIcon,
  MusicIcon,
  CameraIcon,
  QrCodeIcon,
  EyeIcon,
} from "@/components/icons";
import { InvitationPreviewModal } from "@/components/InvitationPreviewModal";
import { createInvitation } from "@/lib/services/invitations.service";

interface FloatingBadge {
  icon: ComponentType<{ className?: string }>;
  iconColorClass: string;
  bgClass: string;
  borderClass: string;
  top: number;
  baseOffset: number;
}

const LEFT_BADGES: FloatingBadge[] = [
  {
    icon: WhatsAppIcon,
    iconColorClass: "text-[#25D366]",
    bgClass: "bg-[#25D366]/10",
    borderClass: "border-[#25D366]/20",
    top: 10,
    baseOffset: -5,
  },
  {
    icon: CalendarIcon,
    iconColorClass: "text-[#C8A24A]",
    bgClass: "bg-[#C8A24A]/10",
    borderClass: "border-[#C8A24A]/20",
    top: 32,
    baseOffset: 5,
  },
  {
    icon: MailIcon,
    iconColorClass: "text-[#C8A24A]",
    bgClass: "bg-[#C8A24A]/10",
    borderClass: "border-[#C8A24A]/20",
    top: 54,
    baseOffset: -5,
  },
  {
    icon: PhoneIcon,
    iconColorClass: "text-[#C8A24A]",
    bgClass: "bg-[#C8A24A]/10",
    borderClass: "border-[#C8A24A]/20",
    top: 76,
    baseOffset: 5,
  },
];

const RIGHT_BADGES: FloatingBadge[] = [
  {
    icon: HeartIcon,
    iconColorClass: "text-[#C8A24A]",
    bgClass: "bg-[#C8A24A]/10",
    borderClass: "border-[#C8A24A]/20",
    top: 10,
    baseOffset: 4,
  },
  {
    icon: MusicIcon,
    iconColorClass: "text-[#C8A24A]",
    bgClass: "bg-[#C8A24A]/10",
    borderClass: "border-[#C8A24A]/20",
    top: 32,
    baseOffset: -4,
  },
  {
    icon: CameraIcon,
    iconColorClass: "text-[#C8A24A]",
    bgClass: "bg-[#C8A24A]/10",
    borderClass: "border-[#C8A24A]/20",
    top: 54,
    baseOffset: 4,
  },
  {
    icon: QrCodeIcon,
    iconColorClass: "text-[#C8A24A]",
    bgClass: "bg-[#C8A24A]/10",
    borderClass: "border-[#C8A24A]/20",
    top: 76,
    baseOffset: -4,
  },
];

function FloatingBadgeStack({
  badges,
  side,
}: {
  badges: FloatingBadge[];
  side: "left" | "right";
}) {
  const sideClass = side === "left" ? "-left-12" : "-right-12";

  return (
    <>
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={index}
            className={`absolute ${sideClass}`}
            style={{ top: `${badge.top}%`, transform: `translateY(${badge.baseOffset}px)` }}
          >
            <div
              className={`float-badge w-12 h-12 rounded-2xl backdrop-blur-sm border flex items-center justify-center shadow-lg ${badge.bgClass} ${badge.borderClass}`}
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <Icon className={`w-5 h-5 ${badge.iconColorClass}`} />
            </div>
          </div>
        );
      })}
    </>
  );
}

export function Hero() {
  const router = useRouter();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  function scrollToTemplates() {
    document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleCreateInvitation() {
    setIsCreating(true);
    try {
      const invitation = await createInvitation();
      router.push(`/studio?invitationId=${invitation.id}`);
    } catch (error) {
      // API not reachable yet during frontend development — still let the
      // user reach the studio instead of dead-ending the CTA.
      console.error("[invitations] create invitation failed, continuing without an id:", error);
      router.push("/studio");
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Faint grid/dot pattern layer */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #000 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Soft blurred gold glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C8A24A]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#C8A24A]/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Col 1: text */}
        <div className="text-center lg:text-left">
          <h1 className="font-cinzel text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-4">
            صمّم دعوتك الرقمية{" "}
            <span className="text-gradient-gold">المثالية</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0">
            تصاميم فاخرة. مشاركة فورية. استجابات سلسة.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleCreateInvitation}
              disabled={isCreating}
              className="w-full sm:w-auto rounded-2xl px-7 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.97] disabled:opacity-60 disabled:pointer-events-none"
              style={{
                background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
              }}
            >
              {isCreating ? "جارٍ الإنشاء..." : "✨ إنشاء دعوة"}
            </button>

            <button
              type="button"
              onClick={scrollToTemplates}
              className="w-full sm:w-auto rounded-2xl px-6 py-3.5 text-sm font-semibold text-gray-800 bg-white/72 border border-[#C8A24A]/30"
            >
              تصفح القوالب
            </button>

            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-3.5 text-sm text-gray-600"
            >
              <EyeIcon className="w-4 h-4" />
              عرض نموذج الدعوة
            </button>
          </div>
        </div>

        {/* Col 2: phone mockup */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative mx-14">
            {/* Outer glow */}
            <div className="absolute inset-0 bg-[#C8A24A]/20 rounded-[3rem] blur-3xl scale-110" />

            {/* Frame */}
            <div className="relative bg-gray-900 rounded-[2rem] p-[3px] shadow-2xl w-64">
              {/* Notch */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-3 bg-gray-900 rounded-full z-20" />

              {/* Screen */}
              <div className="relative bg-white rounded-[1.85rem] overflow-hidden aspect-[9/18]">
                <Image
                  src="/images/hero/invitation-preview.jpg"
                  alt="Invitation preview"
                  fill
                  sizes="256px"
                  className="object-cover"
                />
              </div>
            </div>

            <FloatingBadgeStack badges={LEFT_BADGES} side="left" />
            <FloatingBadgeStack badges={RIGHT_BADGES} side="right" />
          </div>
        </div>
      </div>

      <InvitationPreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </section>
  );
}
