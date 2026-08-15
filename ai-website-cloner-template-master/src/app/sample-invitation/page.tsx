import type { Metadata } from "next";
import { SampleInvitationView } from "./SampleInvitationView";

export const metadata: Metadata = {
  title: "خالد & نورة | دعوة زفاف تجريبية",
};

export default function SampleInvitationPage() {
  return <SampleInvitationView />;
}
