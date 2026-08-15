import type { Metadata } from "next";
import { PartnerProfileView } from "./PartnerProfileView";

export const metadata: Metadata = {
  title: "ملف الشراكة | ZAYTORA",
};

export default function PartnerProfilePage() {
  return <PartnerProfileView />;
}
