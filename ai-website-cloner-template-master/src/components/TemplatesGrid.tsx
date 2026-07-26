import Image from "next/image";
import { cn } from "@/lib/utils";
import { ArrowRightIcon, EyeIcon, StarIcon } from "@/components/icons";

interface Template {
  code: string;
  category: string;
  popular: boolean;
  image: string;
}

const templates: Template[] = [
  { code: "W024", category: "wedding", popular: true, image: "/images/templates/w024.png" },
  { code: "W031", category: "wedding", popular: false, image: "/images/templates/w031.jpeg" },
  { code: "W029", category: "wedding", popular: false, image: "/images/templates/w029.png" },
  { code: "W019", category: "wedding", popular: false, image: "/images/templates/w019.png" },
];

export function TemplatesGrid() {
  return (
    <section>
      <div className="text-center mb-14">
        <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
          القوالب
        </p>
        <h2 className="font-cinzel text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          المفضلة لدى عملائنا
        </h2>
        <p className="text-gray-600">
          استكشف بعضاً من تصاميم دعواتنا الرقمية الأكثر شعبية.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
        {templates.map((template) => (
          <div key={template.code} className="flex flex-col items-center w-40 md:w-44">
            <div className="relative bg-gray-900 rounded-[2rem] p-[3px] shadow-2xl w-full">
              {template.popular && (
                <span className="absolute -top-2 -right-2 z-30 flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs font-medium bg-gradient-to-r from-[#C8A24A] to-gray-900">
                  <StarIcon className="size-3" />
                  POPULAR
                </span>
              )}
              <div className="relative rounded-[1.85rem] overflow-hidden aspect-[9/18] bg-white">
                <Image
                  src={template.image}
                  alt={`${template.code} ${template.category} template`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 768px) 176px, 160px"
                />
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="font-semibold text-sm text-gray-900">{template.code}</p>
              <p className="text-xs text-gray-500 capitalize">{template.category}</p>
            </div>

            <div className="mt-3 flex flex-col sm:flex-row gap-1.5 w-full">
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center gap-1 flex-1",
                  "bg-white border border-gray-200 text-gray-700 rounded-lg px-3 py-1.5 text-xs",
                  "hover:bg-gray-50 transition-colors"
                )}
              >
                <ArrowRightIcon className="size-3.5" />
                Select
              </button>
              <button
                type="button"
                className={cn(
                  "flex items-center justify-center gap-1 flex-1",
                  "bg-transparent border border-gray-200 text-gray-700 rounded-lg px-3 py-1.5 text-xs",
                  "hover:bg-gray-50 transition-colors"
                )}
              >
                <EyeIcon className="size-3.5" />
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <button
          type="button"
          className="bg-white/72 border border-[#C8A24A]/30 text-gray-800 rounded-2xl px-6 py-3.5 text-sm font-semibold hover:bg-white transition-colors"
        >
          عرض جميع القوالب
        </button>
      </div>
    </section>
  );
}
