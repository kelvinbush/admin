"use client";

import React, { useMemo, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Signatory = {
  name: string;
  email: string;
};

interface SigningExecutionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  initialSmeSignatories?: Signatory[];
  initialMkSignatories?: Signatory[];
  onSubmit: (payload: {
    smeSignatories: Signatory[];
    mkSignatories: Signatory[];
  }) => Promise<void> | void;
}

export function SigningExecutionModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  initialSmeSignatories,
  initialMkSignatories,
}: SigningExecutionModalProps) {
  const defaultSme = useMemo<Signatory[]>(
    () => initialSmeSignatories?.length ? initialSmeSignatories : [{ name: "", email: "" }],
    [initialSmeSignatories],
  );

  const defaultMk = useMemo<Signatory[]>(
    () => initialMkSignatories?.length ? initialMkSignatories : [{ name: "", email: "" }],
    [initialMkSignatories],
  );

  const [smeSignatories, setSmeSignatories] = useState<Signatory[]>(defaultSme);
  const [mkSignatories, setMkSignatories] = useState<Signatory[]>(defaultMk);

  const reset = () => {
    setSmeSignatories(defaultSme);
    setMkSignatories(defaultMk);
  };

  const updateSignatory = (
    group: "sme" | "mk",
    index: number,
    patch: Partial<Signatory>,
  ) => {
    const setter = group === "sme" ? setSmeSignatories : setMkSignatories;
    const current = group === "sme" ? smeSignatories : mkSignatories;
    setter(current.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  };

  const addSignatory = (group: "sme" | "mk") => {
    const setter = group === "sme" ? setSmeSignatories : setMkSignatories;
    const current = group === "sme" ? smeSignatories : mkSignatories;
    setter([...current, { name: "", email: "" }]);
  };

  const removeSignatory = (group: "sme" | "mk", index: number) => {
    const setter = group === "sme" ? setSmeSignatories : setMkSignatories;
    const current = group === "sme" ? smeSignatories : mkSignatories;
    const next = current.filter((_, i) => i !== index);
    setter(next.length ? next : [{ name: "", email: "" }]);
  };

  const validate = () => {
    const invalid = [...smeSignatories, ...mkSignatories].some(
      (s) => !s.name.trim() || !s.email.trim(),
    );
    if (invalid) {
      toast.error("Please fill in all signatories' names and emails");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    await onSubmit({
      smeSignatories,
      mkSignatories,
    });

    toast.success("Signatories captured successfully");
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) reset();
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-medium">
            Additional details
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500">
          Fill in the required information below to proceed to the next step
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit();
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary-green">
              SME signatories’ details
            </h3>

            <div className="space-y-3">
              {smeSignatories.map((s, index) => (
                <div key={`sme-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-4">
                  <Input
                    value={s.name}
                    placeholder="Enter signatory’s name"
                    onChange={(e) => updateSignatory("sme", index, { name: e.target.value })}
                    disabled={isLoading}
                  />
                  <Input
                    value={s.email}
                    placeholder="Enter signatory’s email"
                    onChange={(e) => updateSignatory("sme", index, { email: e.target.value })}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-12 px-0"
                    onClick={() => removeSignatory("sme", index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => addSignatory("sme")}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                Add signatory
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-primary-green">
              MK signatories’ details
            </h3>

            <div className="space-y-3">
              {mkSignatories.map((s, index) => (
                <div key={`mk-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-4">
                  <Input
                    value={s.name}
                    placeholder="Enter signatory’s name"
                    onChange={(e) => updateSignatory("mk", index, { name: e.target.value })}
                    disabled={isLoading}
                  />
                  <Input
                    value={s.email}
                    placeholder="Enter signatory’s email"
                    onChange={(e) => updateSignatory("mk", index, { email: e.target.value })}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-12 px-0"
                    onClick={() => removeSignatory("mk", index)}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div>
              <Button
                type="button"
                variant="outline"
                className="gap-2"
                onClick={() => addSignatory("mk")}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4" />
                Add signatory
              </Button>
            </div>
          </div>

          <DialogFooter className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="text-white border-0"
              style={{
                background:
                  "linear-gradient(90deg, var(--green-500, #0C9) 0%, var(--pink-500, #F0459C) 100%)",
              }}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
