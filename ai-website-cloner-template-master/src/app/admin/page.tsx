"use client";

import { useEffect, useMemo, useState } from "react";
import { WalletIcon, OrdersIcon, HandshakeIcon, ClockIcon, LoaderIcon } from "@/components/icons";
import { useLanguage } from "@/context/LanguageContext";
import { listOrders } from "@/lib/services/orders.service";
import { listPartners } from "@/lib/services/partners.service";
import { formatUsd, formatUsdCompact } from "@/lib/format";
import { KpiCard } from "@/components/admin/KpiCard";
import { GrowthChart } from "@/components/admin/GrowthChart";
import type { OrderDto, PartnerDto } from "@/types/api";

const COPY = {
  ar: {
    subtitle: "أداء المنصة خلال آخر 8 أشهر.",
    revenue: "الإيرادات",
    activeInvites: "الدعوات النشطة",
    approvedPartners: "الشركاء المعتمدون",
    pendingRequests: "الطلبات المعلقة",
    revenueChart: "نمو الإيرادات",
    partnerChart: "نمو الشركاء المعتمدين",
    recentOrders: "أحدث الطلبات",
    customer: "العميل",
    amount: "المبلغ",
    status: "الحالة",
    statusLabels: { paid: "مدفوع", pending: "قيد الانتظار", failed: "فشل" },
    empty: "لا توجد طلبات بعد.",
  },
  en: {
    subtitle: "Platform performance over the last 8 months.",
    revenue: "Revenue",
    activeInvites: "Active Invites",
    approvedPartners: "Approved Partners",
    pendingRequests: "Pending Requests",
    revenueChart: "Revenue growth",
    partnerChart: "Approved partner growth",
    recentOrders: "Recent orders",
    customer: "Customer",
    amount: "Amount",
    status: "Status",
    statusLabels: { paid: "Paid", pending: "Pending", failed: "Failed" },
    empty: "No orders yet.",
  },
};

const MONTH_LABELS_AR = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const MONTH_LABELS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The last 8 calendar months ending at the current one, as {year, month}
// buckets — used for both growth charts so they always reflect "now",
// unlike the old hardcoded Jan-Aug arrays.
function lastMonths(count: number) {
  const now = new Date();
  const months: { year: number; month: number }[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }
  return months;
}

export default function AdminOverviewPage() {
  const { language } = useLanguage();
  const t = COPY[language];
  const months = language === "ar" ? MONTH_LABELS_AR : MONTH_LABELS_EN;

  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [partners, setPartners] = useState<PartnerDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // pageSize:500 rather than the paginated admin/orders and admin/partners
    // pages' default page — the KPIs/charts here need every row to compute
    // real totals, not just the latest page. Good enough until order/partner
    // volume outgrows a single page's worth of aggregation.
    Promise.all([listOrders({ pageSize: 500 }), listPartners({ pageSize: 500 })])
      .then(([ordersData, partnersData]) => {
        if (cancelled) return;
        setOrders(ordersData.items);
        setPartners(partnersData.items);
      })
      .catch((error) => console.error("[admin] failed to load overview data:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const approvedCount = partners.filter((p) => p.status === "approved").length;
  const pendingCount = partners.filter((p) => p.status === "pending").length;

  // Active invites = only paid orders — pending/failed never produced a live
  // invitation, so they must not inflate this count.
  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const revenue = paidOrders.reduce((sum, o) => sum + o.amountUsd, 0);
  const activeInvites = paidOrders.length;

  const buckets = useMemo(() => lastMonths(8), []);

  // Cumulative running totals up to the end of each month — the standard
  // "growth" reading, and the only one that isn't mostly empty bars when
  // there are only a handful of real orders/partners so far.
  const revenueData = useMemo(() => {
    let running = 0;
    return buckets.map(({ year, month }) => {
      running += paidOrders
        .filter((o) => {
          const d = new Date(o.paidAt ?? o.createdAt);
          return d.getFullYear() === year && d.getMonth() === month;
        })
        .reduce((sum, o) => sum + o.amountUsd, 0);
      return { label: months[month], value: running };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buckets, paidOrders, language]);

  const partnerData = useMemo(() => {
    let running = 0;
    return buckets.map(({ year, month }) => {
      running += partners.filter((p) => {
        if (p.status !== "approved" || !p.approvedAt) return false;
        const d = new Date(p.approvedAt);
        return d.getFullYear() === year && d.getMonth() === month;
      }).length;
      return { label: months[month], value: running };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buckets, partners, language]);

  const revenueTrendPct =
    revenueData.length >= 2 && revenueData[revenueData.length - 2].value > 0
      ? (
          ((revenueData[revenueData.length - 1].value - revenueData[revenueData.length - 2].value) /
            revenueData[revenueData.length - 2].value) *
          100
        ).toFixed(1)
      : "0.0";

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{t.subtitle}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          icon={WalletIcon}
          tone="emerald"
          label={t.revenue}
          value={formatUsd(revenue)}
          trend={{ value: `${revenueTrendPct}%`, positive: Number(revenueTrendPct) >= 0 }}
        />
        <KpiCard icon={OrdersIcon} tone="blue" label={t.activeInvites} value={String(activeInvites)} />
        <KpiCard icon={HandshakeIcon} tone="violet" label={t.approvedPartners} value={String(approvedCount)} />
        <KpiCard icon={ClockIcon} tone="amber" label={t.pendingRequests} value={String(pendingCount)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GrowthChart title={t.revenueChart} data={revenueData} color="#C8A24A" formatValue={formatUsdCompact} />
        <GrowthChart
          title={t.partnerChart}
          data={partnerData}
          color="#7C3AED"
          formatValue={(value) => String(Math.round(value))}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]">
        <p className="mb-4 text-sm font-semibold text-foreground">{t.recentOrders}</p>
        {recentOrders.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] table-fixed text-start text-sm">
              <colgroup>
                <col className="w-[50%]" />
                <col className="w-[25%]" />
                <col className="w-[25%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 text-start font-medium">{t.customer}</th>
                  <th className="py-2 text-left font-medium">{t.amount}</th>
                  <th className="py-2 text-center font-medium">{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0">
                    <td className="py-2.5 pe-3 font-medium text-foreground">
                      <span className="block truncate" title={order.customerName}>
                        {order.customerName}
                      </span>
                    </td>
                    <td className="py-2.5 text-left text-body-foreground">
                      <span dir="ltr">{formatUsd(order.amountUsd)}</span>
                    </td>
                    <td className="py-2.5 text-center">
                      <span
                        className={
                          order.paymentStatus === "paid"
                            ? "text-emerald-700 dark:text-emerald-400"
                            : order.paymentStatus === "pending"
                              ? "text-amber-700 dark:text-amber-400"
                              : "text-rose-700 dark:text-rose-400"
                        }
                      >
                        {t.statusLabels[order.paymentStatus]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
