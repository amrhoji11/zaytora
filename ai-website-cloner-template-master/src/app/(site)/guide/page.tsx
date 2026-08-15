import type { Metadata } from "next";
import { GuideView } from "./GuideView";

export const metadata: Metadata = {
  title: "الدليل | ZAYTORA",
};

export default function GuidePage() {
  return <GuideView />;
}
