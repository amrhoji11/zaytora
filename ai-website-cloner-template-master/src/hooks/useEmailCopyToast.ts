"use client";

import { useEffect, useState } from "react";

// mailto: only does anything if the browser/OS has a default mail app
// registered — with none configured, clicking gives zero visible feedback.
// The href stays so a configured mail app still opens normally; this copies
// the address too so there's always something visible regardless of that
// system setting. Falls back to the legacy execCommand technique when the
// async Clipboard API is unavailable or its permission is denied, and always
// surfaces copiedAddress either way so the caller's toast always has
// something to show even if both copy paths silently fail.
export function useEmailCopyToast() {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!copiedAddress) return;
    const timeout = window.setTimeout(() => setCopiedAddress(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [copiedAddress]);

  function handleEmailClick(address: string) {
    navigator.clipboard
      .writeText(address)
      .catch(() => {
        const textarea = document.createElement("textarea");
        textarea.value = address;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        try {
          document.execCommand("copy");
        } catch {
          // Ignored — the toast still surfaces the address either way.
        }
        document.body.removeChild(textarea);
      })
      .finally(() => setCopiedAddress(address));
  }

  return { copiedAddress, handleEmailClick };
}
