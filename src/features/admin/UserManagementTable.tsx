"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys } from "@/lib/query-keys";
import { useAuthContext } from "@/components/providers/AuthProvider";
import ConfirmModal from "@/components/shared/ConfirmModal";
import DataTable, { type ColumnDef } from "@/components/shared/DataTable";
import type { AdminUserItem } from "@/types/admin.types";
import { formatDate } from "@/lib/utils";
import { Ban, CheckCircle2, ShieldCheck, AlertCircle, UserCheck } from "lucide-react";

interface UserManagementTableProps {
  users: AdminUserItem[];
}

const roleStyle: Record<AdminUserItem["role"], string> = {
  admin: "bg-terracotta-light text-terracotta border-terracotta/30",
  mentor: "bg-emerald-light text-emerald border-emerald/30",
  student: "bg-amber-light text-amber border-amber/30",
};

export default function UserManagementTable({ users }: UserManagementTableProps) {
  const queryClient = useQueryClient();
  const { user: me } = useAuthContext();
  const [target, setTarget] = React.useState<AdminUserItem | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: ({ id, isBlocked }: { id: string; isBlocked: boolean }) =>
      adminService.toggleUserBlock(id, isBlocked),
    onSuccess: () => {
      setError(null);
      setTarget(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.stats });
    },
    onError: (err: Error) => {
      setTarget(null);
      setError(err.message || "Failed to update account status.");
    },
  });

  const willBlock = target ? !target.isBlocked : true;

  const columns: ColumnDef<AdminUserItem>[] = [
    {
      id: "user",
      header: "User",
      cell: (u) => {
        const isSelf = me?.id === u.id;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-full bg-amber-light text-amber border border-amber/20 flex items-center justify-center font-serif font-bold shrink-0">
              {(u.name || "U").charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-text-primary truncate">
                {u.name}
                {isSelf && (
                  <span className="ml-1.5 text-[10px] font-medium text-text-muted">
                    (you)
                  </span>
                )}
              </div>
              <div className="text-xs text-text-muted truncate">{u.email}</div>
            </div>
          </div>
        );
      },
    },
    {
      id: "role",
      header: "Role",
      cell: (u) => (
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize ${roleStyle[u.role]}`}
        >
          {u.role === "admin" && <ShieldCheck className="size-3" />}
          {u.role}
        </span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (u) =>
        u.isBlocked ? (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange">
            <Ban className="size-3.5" /> Blocked
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald">
            <CheckCircle2 className="size-3.5" /> Active
          </span>
        ),
    },
    {
      id: "joined",
      header: "Joined",
      cell: (u) => (
        <span className="text-xs text-text-secondary whitespace-nowrap">
          {formatDate(u.createdAt)}
        </span>
      ),
    },
    {
      id: "action",
      header: "Action",
      align: "right",
      cell: (u) => {
        const isSelf = me?.id === u.id;
        if (isSelf || u.role === "admin") {
          return <span className="text-xs text-text-muted">—</span>;
        }

        return (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setTarget(u);
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
              u.isBlocked
                ? "border-emerald/30 text-emerald hover:bg-emerald-light"
                : "border-orange/30 text-orange hover:bg-orange/10"
            }`}
          >
            {u.isBlocked ? (
              <UserCheck className="size-3.5" />
            ) : (
              <Ban className="size-3.5" />
            )}
            {u.isBlocked ? "Unblock" : "Block"}
          </button>
        );
      },
    },
  ];

  return (
    <>
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-medium border bg-orange/10 text-orange border-orange/20 mb-4">
          <AlertCircle className="size-4 shrink-0" /> {error}
        </div>
      )}

      <DataTable
        data={users}
        columns={columns}
        keyExtractor={(u) => u.id}
        emptyTitle="No platform users found"
        emptyDescription="No registered users match your search query."
      />

      <ConfirmModal
        isOpen={Boolean(target)}
        title={willBlock ? "Block this account?" : "Unblock this account?"}
        description={
          target
            ? willBlock
              ? `${target.name} (${target.email}) will lose access to the platform until unblocked.`
              : `${target.name} (${target.email}) will regain access to the platform.`
            : ""
        }
        confirmLabel={willBlock ? "Yes, Block" : "Yes, Unblock"}
        variant={willBlock ? "danger" : "success"}
        isLoading={mutation.isPending}
        onConfirm={() => {
          if (target) mutation.mutate({ id: target.id, isBlocked: willBlock });
        }}
        onClose={() => setTarget(null)}
      />
    </>
  );
}

