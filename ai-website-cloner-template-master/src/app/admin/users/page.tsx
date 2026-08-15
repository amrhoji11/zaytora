"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { LoaderIcon, SearchIcon, ShieldIcon, UserIcon } from "@/components/icons";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { listUsers, changeUserRole } from "@/lib/services/users.service";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Pagination } from "@/components/admin/Pagination";
import type { UserDto } from "@/types/api";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 350;

const COPY = {
  ar: {
    subtitle: "أدر حسابات المستخدمين وصلاحيات الأدمن.",
    searchPlaceholder: "ابحث بالاسم أو البريد الإلكتروني...",
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "الهاتف",
    role: "الصلاحية",
    actions: "الإجراءات",
    admin: "أدمن",
    user: "مستخدم",
    makeAdmin: "اجعله أدمن",
    removeAdmin: "إزالة صلاحية الأدمن",
    you: "(أنت)",
    empty: "لا يوجد مستخدمون مطابقون.",
    totalUsers: "إجمالي المستخدمين",
    selfDemoteError: "لا يمكنك إزالة صلاحية الأدمن عن حسابك الخاص.",
    genericError: "تعذّر تحديث الصلاحية.",
  },
  en: {
    subtitle: "Manage user accounts and admin permissions.",
    searchPlaceholder: "Search name or email...",
    name: "Name",
    email: "Email",
    phone: "Phone",
    role: "Role",
    actions: "Actions",
    admin: "Admin",
    user: "User",
    makeAdmin: "Make admin",
    removeAdmin: "Remove admin",
    you: "(you)",
    empty: "No matching users.",
    totalUsers: "Total users",
    selfDemoteError: "You can't remove your own admin role.",
    genericError: "Couldn't update the role.",
  },
};

export default function AdminUsersPage() {
  const { language } = useLanguage();
  const { user: currentUser } = useAuth();
  const t = COPY[language];

  const [users, setUsers] = useState<UserDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  const loadRequestIdRef = useRef(0);

  useEffect(() => {
    const id = window.setTimeout(() => setSearch(searchInput.trim()), SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const load = useCallback(async () => {
    const requestId = ++loadRequestIdRef.current;
    setLoading(true);
    try {
      const data = await listUsers({ search, page, pageSize: PAGE_SIZE });
      // Discard if a newer load() (e.g. search changed again) already won.
      if (loadRequestIdRef.current !== requestId) return;
      setUsers(data.items);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("[admin/users] failed to load users:", error);
    } finally {
      if (loadRequestIdRef.current === requestId) setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleToggleRole(target: UserDto) {
    setBusyId(target.id);
    setErrorId(null);
    try {
      const updated = await changeUserRole(target.id, { role: target.isAdmin ? null : "Admin" });
      setUsers((current) => current.map((u) => (u.id === target.id ? updated : u)));
    } catch (error) {
      console.error("[admin/users] failed to change role:", error);
      setErrorId(target.id);
      window.setTimeout(() => setErrorId((current) => (current === target.id ? null : current)), 4000);
    } finally {
      setBusyId(null);
    }
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{t.subtitle}</p>

      <div className="grid grid-cols-1 gap-4 sm:max-w-xs">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-xl font-bold text-foreground" dir="ltr">
            {totalCount}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{t.totalUsers}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="relative">
          <SearchIcon className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full rounded-full border border-border bg-card py-2 ps-9 pe-4 text-sm text-body-foreground outline-none transition-colors focus:border-[#C8A24A] sm:w-72"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_1px_3px_rgba(16,24,40,0.06)]">
        {users.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">{t.empty}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] table-fixed text-start text-sm">
              <colgroup>
                <col className="w-[24%]" />
                <col className="w-[28%]" />
                <col className="w-[16%]" />
                <col className="w-[12%]" />
                <col className="w-[20%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2 text-start font-medium">{t.name}</th>
                  <th className="py-2 text-left font-medium">{t.email}</th>
                  <th className="py-2 text-left font-medium">{t.phone}</th>
                  <th className="py-2 text-center font-medium">{t.role}</th>
                  <th className="py-2 text-start font-medium">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const isSelf = u.id === currentUser?.id;
                  return (
                    <tr key={u.id} className="border-b border-border last:border-0">
                      <td className="py-3 pe-4 font-medium text-foreground">
                        <span className="block truncate" title={u.displayName}>
                          {u.displayName}
                          {isSelf && <span className="ms-1 font-normal text-muted-foreground">{t.you}</span>}
                        </span>
                      </td>
                      <td className="py-3 pe-3 text-left text-muted-foreground">
                        <span className="block truncate" dir="ltr" title={u.email}>
                          {u.email}
                        </span>
                      </td>
                      <td className="py-3 pe-3 text-left text-muted-foreground">
                        <span className="block truncate" dir="ltr">
                          {u.phoneNumber ?? "—"}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <StatusBadge tone={u.isAdmin ? "info" : "neutral"}>
                          {u.isAdmin ? <ShieldIcon className="size-3 shrink-0" /> : <UserIcon className="size-3 shrink-0" />}
                          {u.isAdmin ? t.admin : t.user}
                        </StatusBadge>
                      </td>
                      <td className="py-3">
                        {busyId === u.id ? (
                          <LoaderIcon className="size-4 animate-spin text-muted-foreground" />
                        ) : (
                          <div className="flex flex-col items-start gap-1">
                            <button
                              type="button"
                              disabled={u.isAdmin && isSelf}
                              onClick={() => handleToggleRole(u)}
                              className={cn(
                                "rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors",
                                u.isAdmin && isSelf
                                  ? "cursor-not-allowed bg-background/5 text-muted-foreground"
                                  : u.isAdmin
                                    ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:bg-rose-900/50"
                                    : "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:bg-emerald-900/50"
                              )}
                            >
                              {u.isAdmin ? t.removeAdmin : t.makeAdmin}
                            </button>
                            {errorId === u.id && (
                              <span className="text-[11px] text-rose-700 dark:text-rose-400">
                                {u.isAdmin && isSelf ? t.selfDemoteError : t.genericError}
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {users.length > 0 && (
          <div className="mt-4">
            <Pagination page={page} pageSize={PAGE_SIZE} totalCount={totalCount} onPageChange={setPage} language={language} />
          </div>
        )}
      </div>
    </div>
  );
}
