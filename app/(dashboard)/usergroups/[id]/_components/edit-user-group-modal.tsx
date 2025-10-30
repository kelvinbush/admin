"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateUserGroupMutation } from "@/lib/api/hooks/useUserGroups";

interface EditUserGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groupId: string;
  initialName?: string;
  initialSlug?: string;
  initialDescription?: string;
  onUpdated?: () => void;
}

export default function EditUserGroupModal({
  open,
  onOpenChange,
  groupId,
  initialName = "",
  initialSlug = "",
  initialDescription = "",
  onUpdated,
}: EditUserGroupModalProps) {
  const [name, setName] = React.useState(initialName);
  const [slug, setSlug] = React.useState(initialSlug);
  const [description, setDescription] = React.useState(initialDescription);

  const updateMutation = useUpdateUserGroupMutation();

  React.useEffect(() => {
    setName(initialName || "");
    setSlug(initialSlug || "");
    setDescription(initialDescription || "");
  }, [initialName, initialSlug, initialDescription]);

  const onSubmit = async () => {
    const body: any = { id: groupId };
    if (name) body.name = name;
    if (slug) body.slug = slug;
    if (description) body.description = description;

    await updateMutation.mutateAsync(body);
    onOpenChange(false);
    onUpdated && onUpdated();
  };

  const disableSubmit = updateMutation.isPending || !name;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!updateMutation.isPending) onOpenChange(o); }}>
      <DialogContent className="max-w-[760px] p-0 overflow-hidden">
        <div className="px-8 py-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-medium text-midnight-blue">Edit user group</DialogTitle>
            <DialogDescription className="text-primaryGrey-500">
              Update the details for this user group
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm text-midnight-blue font-medium">Group name <span className="text-red-500">*</span></label>
              <Input placeholder="Enter user group name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm text-midnight-blue font-medium">Group no/identifier (optional)</label>
              <Input placeholder="Enter user group identifier" value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
          </div>

          <div className="mt-6">
            <label className="text-sm text-midnight-blue font-medium">Description (optional)</label>
            <Textarea
              placeholder="Briefly describe the user group here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[96px]"
            />
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
              Save changes
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
