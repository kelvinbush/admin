"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSearchUsers } from "@/lib/api/hooks/users";
import { useUpdateUserGroupMutation } from "@/lib/api/hooks/useUserGroups";
import type { User } from "@/lib/api/types";
import { X } from "lucide-react";

interface AddSmeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  existingUserIds?: string[];
  onAdded?: () => void;
}

export default function AddSmeModal({ open, onOpenChange, groupId, existingUserIds = [], onAdded }: AddSmeModalProps) {
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<User[]>([]);

  const { data: searchResults } = useSearchUsers(search);
  const updateMutation = useUpdateUserGroupMutation();

  const toggleSelect = (user: User) => {
    setSelected((prev) => {
      const exists = prev.find((u) => u.id === user.id);
      if (exists) return prev.filter((u) => u.id !== user.id);
      return [...prev, user];
    });
  };

  const reset = () => {
    setSearch("");
    setSelected([]);
  };

  const onSubmit = async () => {
    const userIds = Array.from(new Set([...(existingUserIds || []), ...selected.map((u) => u.id)]));
    await updateMutation.mutateAsync({ id: groupId, userIds });
    reset();
    onOpenChange(false);
    onAdded && onAdded();
  };

  const disableSubmit = selected.length === 0 || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!updateMutation.isPending) onOpenChange(o); }}>
      <DialogContent className="max-w-[760px] p-0 overflow-hidden">
        <div className="px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-midnight-blue">Add SME</DialogTitle>
            <DialogDescription className="text-primaryGrey-500">Search and select entrepreneurs to add to this group.</DialogDescription>
          </DialogHeader>

          <div className="mt-6 border rounded-md">
            <div className="flex items-center gap-2 px-3 py-2 border-b">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search entrepreneur..."
                className="h-9 border-0 p-0 focus-visible:ring-0 text-sm"
              />
              {search && (
                <button aria-label="Clear" onClick={() => setSearch("")} className="text-primaryGrey-400 hover:text-midnight-blue">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-auto">
              {(searchResults || []).map((u) => {
                const checked = !!selected.find((s) => s.id === u.id);
                return (
                  <button
                    key={u.id}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-primaryGrey-50 ${checked ? "bg-primaryGrey-50" : ""}`}
                    onClick={() => toggleSelect(u)}
                  >
                    {(u as any).fullName || (u as any).name || (u as any).email || u.id}
                  </button>
                );
              })}
            </div>
            {selected.length > 0 && (
              <div className="border-t p-3 flex flex-wrap gap-2">
                {selected.map((u) => (
                  <span key={u.id} className="text-xs px-2 py-1 rounded-md bg-primaryGrey-100 text-midnight-blue">
                    {(u as any).fullName || (u as any).name || (u as any).email || u.id}
                  </span>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="mt-8 border-t pt-6 flex items-center justify-end gap-3">
            <Button size="lg" variant="outline" onClick={() => onOpenChange(false)} disabled={updateMutation.isPending}>Cancel</Button>
            <Button
              size="lg"
              className="text-white border-0"
              style={{ background: "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)", opacity: disableSubmit ? 0.7 : 1 }}
              onClick={onSubmit}
              disabled={disableSubmit}
            >
              Add
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
