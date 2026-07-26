import { StarIcon } from "@/components/icons"
import type { ReviewItem } from "@/types/numinds"

type Review = ReviewItem & { rating: number }

const REVIEWS: Review[] = [
  {
    rating: 5,
    body: "المعازيم انبهروا بالدعوة و الكل سألني عنها و الكل مبسوط عليها! شكرًا من القلب انكم كنتوا جزء من فرحتي و خليتوها مميزة! 🥹🥹 عنجد مبدعين و فكرة رائعه جدًا 🥰🥰🥰",
    name: "د.",
    countryFlag: "🇯🇴",
    country: "Jordan",
    date: "26 Jul 2026",
  },
  {
    rating: 5,
    body: "فكرة مميزة جدا اكتر من رائعة رهيبة وفخمة الكل انبهر فيها، شكرا لأنكم كنتو جزء من هادي الفرحة",
    name: "ي.",
    countryFlag: "🇯🇴",
    country: "Jordan",
    date: "24 Jul 2026",
  },
  {
    rating: 5,
    body: "تجربة رائعة انصح وبشدة",
    name: "مج.",
    countryFlag: "🇵🇸",
    country: "Palestine",
    date: "23 Jul 2026",
  },
  {
    rating: 5,
    body: "ممتاز و راقيين فى التعامل",
    name: "AD.",
    countryFlag: "🇪🇬",
    country: "Egypt",
    date: "23 Jul 2026",
  },
  {
    rating: 5,
    body: "تجننن مرا حلوه وحبيت تفاعل الناس معايا",
    name: "س.",
    countryFlag: "🇸🇦",
    country: "Saudi Arabia",
    date: "20 Jul 2026",
  },
  {
    rating: 5,
    body: "ممتازة جدا 😍😍",
    name: "س.",
    countryFlag: "🇶🇦",
    country: "Qatar",
    date: "20 Jul 2026",
  },
  {
    rating: 5,
    body: "دعوة رائعةة جداا جداا وتعامل ولا اروعع بتجننن الدعوةة كتيررر بتستاهل كل ريال وزيادةةة",
    name: "ان.",
    countryFlag: "🇰🇼",
    country: "Kuwait",
    date: "20 Jul 2026",
  },
  {
    rating: 5,
    body: "كل شي كان بيرفكت والكل عجبته بس المشكله اللي واجهتها الخط ماقدر اغير فيه والحجم🥺 عالعموم كانت دعوة خياااال",
    name: "س.",
    countryFlag: "🇸🇦",
    country: "Saudi Arabia",
    date: "19 Jul 2026",
  },
  {
    rating: 5,
    body: "منظم وممتع",
    name: "A.",
    countryFlag: "🇶🇦",
    country: "Qatar",
    date: "18 Jul 2026",
  },
  {
    rating: 4,
    body: "اتمنى توفروا قوالب اكثر وامكانيه التعديل على احجام الخط",
    name: "ل.",
    countryFlag: "🇸🇦",
    country: "Saudi Arabia",
    date: "17 Jul 2026",
  },
  {
    rating: 5,
    body: "دعوة جميلة جدًا و راقيه و سهلة الاستخدام بنصح الكل بدعوات numinds 😍😍😍",
    name: "د.",
    countryFlag: "🇯🇴",
    country: "Jordan",
    date: "14 Jul 2026",
  },
  {
    rating: 5,
    body: "Thank you to the team for helping me make my invitation wonderful 😍 highly recommend them!",
    name: "M.",
    countryFlag: "🇳🇱",
    country: "Netherlands",
    date: "13 Jul 2026",
  },
  {
    rating: 5,
    body: "سوو حق تخرج اولاد",
    name: "ح.",
    countryFlag: "🇦🇪",
    country: "United Arab Emirates",
    date: "13 Jul 2026",
  },
  {
    rating: 3,
    body: "جيد بس التخرج لازم يسون حق اولاد",
    name: "ح.",
    countryFlag: "",
    country: "",
    date: "13 Jul 2026",
  },
  {
    rating: 5,
    body: "أريد العمل في هذا المجال .لا يوجد إشتراك شهري !",
    name: "D.",
    countryFlag: "🇹🇳",
    country: "Tunisia",
    date: "9 Jul 2026",
  },
  {
    rating: 5,
    body: "اكثر من رائعه",
    name: "S.",
    countryFlag: "🇳🇱",
    country: "Netherlands",
    date: "9 Jul 2026",
  },
  {
    rating: 5,
    body: "جدا روعة وتعاون المسؤولين",
    name: "A.",
    countryFlag: "🇸🇦",
    country: "Saudi Arabia",
    date: "7 Jul 2026",
  },
  {
    rating: 5,
    body: "Made as requested, loved it 💕",
    name: "A.",
    countryFlag: "🇦🇪",
    country: "United Arab Emirates",
    date: "6 Jul 2026",
  },
]

const RATING_BREAKDOWN = [
  { stars: 5, count: 84 },
  { stars: 4, count: 3 },
  { stars: 3, count: 3 },
  { stars: 2, count: 1 },
  { stars: 1, count: 1 },
] as const

const TOTAL_RATINGS = 90
const AVERAGE_RATING = "4.9"

const AVATAR_PALETTE = ["#C8A24A", "#8DA9C4", "#8FB996", "#D497B0"]

interface StarRowProps {
  count: number
  className?: string
}

function StarRow({ count, className = "h-4 w-4" }: StarRowProps) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <StarIcon
          key={i}
          className={`${className} ${i < count ? "text-[#C8A24A]" : "text-gray-200"}`}
          fill={i < count ? "currentColor" : "none"}
        />
      ))}
    </>
  )
}

interface ReviewCardProps {
  review: Review
  index: number
}

function ReviewCard({ review, index }: ReviewCardProps) {
  const initial = review.name.trim().charAt(0) || "؟"
  const avatarColor = AVATAR_PALETTE[index % AVATAR_PALETTE.length]

  return (
    <div className="relative bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#C8A24A]/40 transition-colors">
      <div className="flex gap-0.5 mb-3">
        <StarRow count={review.rating} />
      </div>
      <p className="text-sm text-gray-700 mb-4">{review.body}</p>
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: avatarColor }}
        >
          {initial}
        </span>
        <span className="text-sm font-medium text-gray-900">{review.name}</span>
        {review.countryFlag && <span className="text-sm">{review.countryFlag}</span>}
        <span className="text-xs text-gray-400 ms-auto">{review.date}</span>
      </div>
    </div>
  )
}

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-sm text-[#C8A24A] font-medium tracking-widest uppercase mb-3">
            آراء العملاء
          </p>
          <h2 className="font-cinzel text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            ماذا يقول عملاؤنا
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
          <div className="flex flex-col items-center gap-2 bg-gray-50 rounded-3xl px-10 py-8 border border-gray-100">
            <span className="font-cinzel text-5xl font-semibold text-gray-900">
              {AVERAGE_RATING}
            </span>
            <div className="flex gap-0.5">
              <StarRow count={5} className="h-5 w-5" />
            </div>
            <span className="text-xs text-gray-400 mt-1">
              بناءً على {TOTAL_RATINGS} تقييم
            </span>
          </div>

          <div className="w-full max-w-xs space-y-2">
            {RATING_BREAKDOWN.map(({ stars, count }) => (
              <div key={stars} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 w-3">{stars}</span>
                <div className="flex-1 h-1.5 rounded-full bg-gray-100">
                  <div
                    className="h-1.5 rounded-full bg-[#C8A24A]"
                    style={{ width: `${(count / TOTAL_RATINGS) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-6 text-end">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="max-h-[560px] overflow-y-auto pr-1">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 pb-2">
            {REVIEWS.map((review, index) => (
              <ReviewCard
                key={`${review.name}-${review.date}-${index}`}
                review={review}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
