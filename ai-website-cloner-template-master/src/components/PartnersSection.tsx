import Image from "next/image"

interface PartnerLogo {
  src: string
  alt: string
}

const PARTNER_LOGOS: PartnerLogo[] = [
  { src: "/images/partners/orchid-invites.jpg", alt: "Orchid Invites" },
  { src: "/images/partners/lumiere-by-basma.jpeg", alt: "Lumiere by Basma" },
  { src: "/images/partners/nawara.png", alt: "Nawara" },
  { src: "/images/partners/numindseg.jpeg", alt: "Numinds EG" },
  { src: "/images/partners/kp-planner.png", alt: "KP Planner" },
  { src: "/images/partners/halacode.png", alt: "Halacode" },
  { src: "/images/partners/togather-n.jpeg", alt: "Togather N" },
  { src: "/images/partners/n-design.jpeg", alt: "N Design" },
  { src: "/images/partners/dy-designer.jpeg", alt: "DY Designer" },
  { src: "/images/partners/dhikra-events.png", alt: "Dhikra Events" },
  { src: "/images/partners/ayman-abdalillah.png", alt: "Ayman Abdalillah" },
  { src: "/images/partners/dj-dahab.png", alt: "DJ Dahab" },
  { src: "/images/partners/zeinap-abdullah.png", alt: "Zeinap Abdullah" },
  { src: "/images/partners/dr-design.jpg", alt: "Dr Design" },
]

const MARQUEE_LOGOS = [...PARTNER_LOGOS, ...PARTNER_LOGOS]

export function PartnersSection() {
  return (
    <section id="partners" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
        <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
          شبكة الشركاء
        </p>
        <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
          شركاؤنا
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto text-sm">
          محترفون موثوقون يستخدمون Numinds لإنشاء دعوات رائعة.
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-0 bottom-0 left-0 w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div className="absolute top-0 bottom-0 right-0 w-20 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />

        <div className="overflow-hidden">
          <div className="flex gap-6 items-center [animation:partnersScroll_45s_linear_infinite] w-max">
            {MARQUEE_LOGOS.map((logo, i) => (
              <Image
                key={`${logo.src}-${i}`}
                src={logo.src}
                alt={logo.alt}
                width={96}
                height={96}
                className="object-cover rounded-xl border border-gray-100"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <button className="bg-white/72 border border-[#C8A24A]/30 text-gray-800 rounded-2xl px-6 py-3.5 text-sm font-semibold">
          انضم إلينا
        </button>
      </div>
    </section>
  )
}
