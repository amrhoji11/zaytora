"use client";

import { motion, type Variants } from "framer-motion";
import { Divider } from "../elements/Divider";
import type { SacredIvoryHeritageTheme } from "../sacred-ivory-heritage.types";

interface InvitationCardProps {
  groomName: string;
  brideName: string;
  tagline: string;
  dateLabel: string;
  theme: SacredIvoryHeritageTheme;
  backgroundVideoSrc?: string;
  backgroundPosterSrc: string;
}

const REVEAL: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.25 + i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

// The names/tagline/date block, staggered in over the mandap backdrop --
// mirrors the reference markup's structure (names -> "&" -> tagline ->
// divider -> uppercase date range) with the same relative type scale.
export function InvitationCard({
  groomName,
  brideName,
  tagline,
  dateLabel,
  theme,
  backgroundVideoSrc,
  backgroundPosterSrc,
}: InvitationCardProps) {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {backgroundVideoSrc ? (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={backgroundVideoSrc}
          poster={backgroundPosterSrc}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- runtime prop, not a static asset next/image can optimize
        <img src={backgroundPosterSrc} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <motion.h1
          className="font-light italic"
          style={{ fontFamily: theme.fonts.names, fontSize: 26, color: theme.colors.primary }}
          custom={0}
          initial="hidden"
          animate="visible"
          variants={REVEAL}
        >
          {groomName}
        </motion.h1>

        <motion.span
          className="my-1"
          style={{ fontFamily: theme.fonts.names, fontSize: 15, color: theme.colors.primary }}
          custom={1}
          initial="hidden"
          animate="visible"
          variants={REVEAL}
        >
          &amp;
        </motion.span>

        <motion.h1
          className="font-light italic"
          style={{ fontFamily: theme.fonts.names, fontSize: 26, color: theme.colors.primary }}
          custom={2}
          initial="hidden"
          animate="visible"
          variants={REVEAL}
        >
          {brideName}
        </motion.h1>

        <motion.p
          className="mt-4 mb-2 font-light tracking-[0.3em]"
          style={{ fontFamily: theme.fonts.tagline, fontSize: 18, color: "#ffffff" }}
          custom={3}
          initial="hidden"
          animate="visible"
          variants={REVEAL}
        >
          {tagline}
        </motion.p>

        <motion.div custom={4} initial="hidden" animate="visible" variants={REVEAL}>
          <Divider color={theme.colors.primary} />
          <p
            className="font-medium tracking-wide uppercase"
            style={{
              fontFamily: theme.fonts.dateLabel,
              fontSize: 19,
              color: theme.colors.primary,
              textShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {dateLabel}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
