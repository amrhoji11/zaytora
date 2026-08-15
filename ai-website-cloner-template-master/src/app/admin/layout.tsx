"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LoaderIcon } from "@/components/icons";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminMobileNav } from "@/components/admin/AdminMobileNav";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

// Standalone chrome (no public header/footer/WhatsApp button) — this is an
// internal tool, not a marketing-site page, matching how /invitationpublic
// also sits outside the (site) route group.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login?returnUrl=%2Fadmin");
      return;
    }
    if (!user.isAdmin) {
      router.replace("/");
    }
  }, [loading, user, router]);

  // Covers the initial auth check, the redirect-in-flight window for a
  // signed-out or non-admin visitor, and the brief gap before router.replace
  // actually navigates away — never flashes admin content to either.
  if (loading || !user || !user.isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="lg:ps-64">
        <AdminTopbar />
        <main className="px-4 py-6 pb-24 sm:px-6 lg:pb-6">{children}</main>
      </div>
      <AdminMobileNav />
    </div>
  );
}
