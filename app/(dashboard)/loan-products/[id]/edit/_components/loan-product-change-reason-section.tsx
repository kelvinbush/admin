"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Info } from "lucide-react";

interface LoanProductChangeReasonSectionProps {
  value: string;
  onChange: (value: string) => void;
  hasCriticalChanges: boolean;
  productStatus: string;
}

export function LoanProductChangeReasonSection({
  value,
  onChange,
  hasCriticalChanges,
  productStatus,
}: LoanProductChangeReasonSectionProps) {
  return (
    <div className="bg-white">
      <div className="p-6 pb-0">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Change Reason
        </h3>
        <p className="text-sm text-primaryGrey-400 mt-1">
          Provide a reason for the changes you&apos;re making
        </p>
      </div>
      <div className="p-6 space-y-4">
        {/* Critical Changes Warning */}
        {hasCriticalChanges && productStatus === "active" && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-700">
              <strong>Critical changes detected:</strong> You are modifying
              critical fields (amounts, terms, interest rate, or structure).
              This will create a new version of the product and may affect
              existing applications.
            </AlertDescription>
          </Alert>
        )}

        {/* Draft Status Info */}
        {productStatus === "draft" && (
          <Alert className="border-blue-200 bg-blue-50">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-700">
              <strong>Draft product:</strong> You can freely edit all fields
              without versioning concerns.
            </AlertDescription>
          </Alert>
        )}

        {/* Change Reason Input */}
        <div>
          <Label
            htmlFor="changeReason"
            className="text-sm font-medium text-midnight-blue"
          >
            Reason for changes *
          </Label>
          <Textarea
            id="changeReason"
            placeholder="Describe the reason for these changes..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-2 min-h-[100px] resize-none"
          />
          <p className="text-xs text-primaryGrey-400 mt-1">
            This reason will be recorded in the product history and may be
            required for audit purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
