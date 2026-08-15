import type { Metadata } from "next";
import { AccountSettingsView } from "./AccountSettingsView";

export const metadata: Metadata = {
  title: "إعدادات الحساب | ZAYTORA",
};

export default function AccountSettingsPage() {
  return <AccountSettingsView />;
}
