"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AdminUser } from "@/lib/api/contract";
import { isApiError } from "@/lib/api/types";
import { useSession } from "@/lib/auth/session";
import { formatDateTime, formatDisplayCode } from "@/lib/format";
import { USER_ROLE_LABEL, UserRole, UserStatus } from "@/types/enums";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { Select } from "@/components/ui/Select";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SearchIcon } from "@/components/icons";
import {
  BanUserDialog,
  UnbanUserDialog,
  type BanUserTarget,
} from "../../shared/AdminActionDialogs";
import { useDebouncedValue } from "../../shared/useDebouncedValue";
import { useAdminUsers } from "../hooks";

const PAGE_SIZE = 20;

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: UserStatus.ACTIVE, label: "Hoạt động" },
  { value: UserStatus.BANNED, label: "Bị khóa" },
];

const ROLE_OPTIONS = [
  { value: "", label: "Tất cả vai trò" },
  { value: UserRole.USER, label: USER_ROLE_LABEL[UserRole.USER] },
  { value: UserRole.ADMIN, label: USER_ROLE_LABEL[UserRole.ADMIN] },
];

export function AdminUsersClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user: currentUser } = useSession();

  const urlKeyword = searchParams.get("keyword") ?? "";
  const urlStatus = (searchParams.get("status") ?? "") as UserStatus | "";
  const urlRole = (searchParams.get("role") ?? "") as UserRole | "";
  const urlPage = Math.max(0, Number(searchParams.get("page") ?? "0") || 0);

  const [keywordInput, setKeywordInput] = useState(urlKeyword);
  const debouncedKeyword = useDebouncedValue(keywordInput, 300);

  const [banTarget, setBanTarget] = useState<BanUserTarget | null>(null);
  const [unbanTarget, setUnbanTarget] = useState<BanUserTarget | null>(null);

  const updateUrl = (updates: Record<string, string | number | undefined>) => {
    const next = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(updates)) {
      if (v === undefined || v === "" || (k === "page" && Number(v) === 0)) {
        next.delete(k);
      } else {
        next.set(k, String(v));
      }
    }
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    if (debouncedKeyword !== urlKeyword) {
      updateUrl({ keyword: debouncedKeyword.trim() || undefined, page: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedKeyword]);

  const { data, isLoading, isError, error, refetch, isFetching } = useAdminUsers({
    keyword: urlKeyword || undefined,
    status: urlStatus || undefined,
    role: urlRole || undefined,
    page: urlPage,
    size: PAGE_SIZE,
    sort: "createdAt,desc",
  });

  const users = useMemo(() => data?.content ?? [], [data?.content]);
  const totalPages = data?.totalPages ?? 0;
  const totalElements = data?.totalElements ?? 0;

  const hasFilters = Boolean(urlKeyword || urlStatus || urlRole);

  const columns: Column<AdminUser>[] = useMemo(
    () => [
      {
        key: "id",
        header: "Mã",
        render: (row) => (
          <span className="text-small font-semibold text-text tabular">
            {formatDisplayCode("USR", row.id)}
          </span>
        ),
      },
      {
        key: "fullName",
        header: "Họ tên",
        render: (row) => (
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar src={row.avatarUrl} name={row.fullName} size="sm" />
            <span className="truncate font-medium text-text">{row.fullName}</span>
          </div>
        ),
      },
      {
        key: "email",
        header: "Email",
        render: (row) => (
          <span className="text-small text-text-secondary">{row.email}</span>
        ),
      },
      {
        key: "phoneNumber",
        header: "SĐT",
        render: (row) => (
          <span className="text-small text-text-secondary tabular">
            {row.phoneNumber ?? "—"}
          </span>
        ),
      },
      {
        key: "role",
        header: "Vai trò",
        render: (row) => (
          <span className="text-small text-text-secondary">
            {USER_ROLE_LABEL[row.role]}
          </span>
        ),
      },
      {
        key: "status",
        header: "Trạng thái",
        render: (row) => <StatusBadge statusType="user" value={row.status} />,
      },
      {
        key: "createdAt",
        header: "Ngày tạo",
        render: (row) => (
          <span className="text-small text-text-secondary tabular">
            {formatDateTime(row.createdAt)}
          </span>
        ),
      },
      {
        key: "actions",
        header: "Thao tác",
        align: "right",
        render: (row) => {
          const isSelf = currentUser?.id === row.id;
          if (row.role === UserRole.ADMIN || isSelf) {
            return <span className="text-caption text-text-tertiary">—</span>;
          }
          if (row.status === UserStatus.ACTIVE) {
            return (
              <Button
                variant="danger-soft"
                size="sm"
                onClick={() =>
                  setBanTarget({
                    id: row.id,
                    fullName: row.fullName,
                    email: row.email,
                  })
                }
              >
                Khóa
              </Button>
            );
          }
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setUnbanTarget({
                  id: row.id,
                  fullName: row.fullName,
                  email: row.email,
                })
              }
            >
              Mở khóa
            </Button>
          );
        },
      },
    ],
    [currentUser?.id]
  );

  const errorMessage = isError
    ? isApiError(error)
      ? error.message
      : "Không tải được danh sách người dùng."
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-h1 text-text">Quản lý người dùng</h1>
          <p className="mt-1 text-small text-text-secondary">
            Tổng cộng {totalElements} tài khoản
            {isFetching && !isLoading ? " · Đang cập nhật..." : ""}
          </p>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <Input
              aria-label="Tìm theo tên hoặc email"
              placeholder="Tìm theo họ tên hoặc email..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              leftIcon={<SearchIcon className="size-4" />}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              aria-label="Lọc theo trạng thái"
              value={urlStatus}
              options={STATUS_OPTIONS}
              onChange={(e) => updateUrl({ status: e.target.value, page: 0 })}
            />
          </div>
          <div className="md:col-span-3">
            <Select
              aria-label="Lọc theo vai trò"
              value={urlRole}
              options={ROLE_OPTIONS}
              onChange={(e) => updateUrl({ role: e.target.value, page: 0 })}
            />
          </div>
          <div className="md:col-span-1 flex items-center justify-end">
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setKeywordInput("");
                  updateUrl({
                    keyword: undefined,
                    status: undefined,
                    role: undefined,
                    page: 0,
                  });
                }}
              >
                Đặt lại
              </Button>
            )}
          </div>
        </div>
      </Card>

      <DataTable
        columns={columns}
        data={users}
        keyExtractor={(row) => row.id}
        loading={isLoading}
        error={errorMessage}
        onRetry={() => refetch()}
        emptyText={
          hasFilters
            ? "Không tìm thấy người dùng phù hợp với bộ lọc."
            : "Chưa có tài khoản người dùng nào."
        }
        emptyAction={
          hasFilters ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setKeywordInput("");
                updateUrl({
                  keyword: undefined,
                  status: undefined,
                  role: undefined,
                  page: 0,
                });
              }}
            >
              Xóa bộ lọc
            </Button>
          ) : undefined
        }
      />

      {totalPages > 1 && (
        <Pagination
          page={urlPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={PAGE_SIZE}
          onPageChange={(nextPage) => updateUrl({ page: nextPage })}
        />
      )}

      <BanUserDialog target={banTarget} onClose={() => setBanTarget(null)} />
      <UnbanUserDialog target={unbanTarget} onClose={() => setUnbanTarget(null)} />
    </div>
  );
}
