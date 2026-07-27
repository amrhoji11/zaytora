import { MailIcon, PhoneIcon } from "@/components/icons";

const pageLinks = ["القوالب", "الاستوديو", "الدليل", "تواصل معنا"];

const featureLinks = [
  "دعم ثنائي اللغة",
  "إدارة الردود",
  "كاميرا الحدث",
  "مشاركة رمز QR",
];

const legalLinks = [
  "الشروط والأحكام",
  "سياسة الخصوصية",
  "سياسة الاسترداد",
  "Delete Account",
];

const paymentBadges = ["VISA", "Pay", "G Pay", "Samsung Pay"];

export function Footer() {
  return (
    <footer id="contact" className="py-16 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <span className="font-cinzel text-xl text-gray-900">Numinds</span>
            <p className="mt-4 text-sm text-gray-500">
              دعوات رقمية فاخرة لأجمل لحظاتك.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              الصفحات
            </h3>
            <ul className="space-y-3">
              {pageLinks.map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-[#C8A24A] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              المميزات
            </h3>
            <ul className="space-y-3">
              {featureLinks.map((label) => (
                <li key={label}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 hover:text-[#C8A24A] transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              تواصل معنا
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <MailIcon className="h-4 w-4" />
                <span dir="ltr">support@numinds.me</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-500">
                <PhoneIcon className="h-4 w-4" />
                <span dir="ltr">+966 50 000 0000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 pb-6 flex flex-col items-center gap-4">
          <span className="text-xs text-gray-400">Secure Payments</span>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {paymentBadges.map((label) => (
              <span
                key={label}
                className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-500"
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            © 2026 NumindsDesign. جميع الحقوق محفوظة.
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-6">
            {legalLinks.map((label) => (
              <li key={label}>
                <a
                  href="#"
                  className="text-sm text-gray-500 hover:text-[#C8A24A] transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
