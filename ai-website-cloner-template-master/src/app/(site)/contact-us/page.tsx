import type { Metadata } from "next";
import { ContactUsView } from "./ContactUsView";

export const metadata: Metadata = {
  title: "اتصل بنا | ZAYTORA",
};

export default function ContactUsPage() {
  return <ContactUsView />;
}
