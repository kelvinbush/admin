"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Banknote,
  CheckCircle,
  FileText,
  Mail,
  MessageSquare,
  User,
  XCircle,
} from "lucide-react";
import type { LoanApplicationItem } from "@/lib/api/types";
import { formatStatusText } from "@/lib/utils/currency";
import {
  useApproveLoanApplication,
  useCreateOfferLetter,
  useRejectLoanApplication,
  useSendOfferLetter,
  useUpdateLoanApplicationStatus,
} from "@/lib/api/hooks/loan-applications";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

interface ActionsPanelProps {
  application: LoanApplicationItem;
}

export function ActionsPanel({ application }: ActionsPanelProps) {
  const { user } = useUser();
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [approveReason, setApproveReason] = useState("");
  const [rejectReason, setRejectReason] = useState("");

  const updateStatusMutation = useUpdateLoanApplicationStatus();
  const approveMutation = useApproveLoanApplication();
  const rejectMutation = useRejectLoanApplication();
  const createOfferMutation = useCreateOfferLetter();
  const sendOfferMutation = useSendOfferLetter();

  const getAvailableActions = () => {
    const actions = [];

    switch (application.status) {
      case "draft":
        // Draft applications can be submitted
        actions.push({
          id: "submit",
          label: "Submit Application",
          icon: FileText,
          variant: "default",
          color: "bg-blue-600 hover:bg-blue-700",
        });
        break;
      case "submitted":
        // Submitted applications can move to review
        actions.push(
          {
            id: "review",
            label: "Start Review",
            icon: FileText,
            variant: "default",
            color: "bg-blue-600 hover:bg-blue-700",
          },
          {
            id: "request_docs",
            label: "Request Documents",
            icon: Mail,
            variant: "outline",
            color: "border-gray-300 text-gray-700 hover:bg-gray-50",
          },
        );
        break;
      case "under_review":
        // Under review can be approved or rejected
        actions.push(
          {
            id: "approve",
            label: "Approve Application",
            icon: CheckCircle,
            variant: "default",
            color: "bg-green-600 hover:bg-green-700",
          },
          {
            id: "reject",
            label: "Reject Application",
            icon: XCircle,
            variant: "outline",
            color: "border-red-300 text-red-700 hover:bg-red-50",
          },
          {
            id: "request_docs",
            label: "Request Documents",
            icon: Mail,
            variant: "outline",
            color: "border-gray-300 text-gray-700 hover:bg-gray-50",
          },
        );
        break;
      case "approved":
        // Approved applications can send offer letters
        actions.push({
          id: "send_offer",
          label: "Send Offer Letter",
          icon: Mail,
          variant: "default",
          color: "bg-purple-600 hover:bg-purple-700",
        });
        break;
      case "offer_letter_sent":
        // Offer letter sent - waiting for response
        actions.push({
          id: "resend_offer",
          label: "Resend Offer Letter",
          icon: Mail,
          variant: "outline",
          color: "border-purple-300 text-purple-700 hover:bg-purple-50",
        });
        break;
      case "offer_letter_signed":
        // Ready for disbursement
        actions.push({
          id: "disburse",
          label: "Disburse Loan",
          icon: Banknote,
          variant: "default",
          color: "bg-green-600 hover:bg-green-700",
        });
        break;
      case "rejected":
        // Rejected applications can be resubmitted
        actions.push({
          id: "resubmit",
          label: "Resubmit Application",
          icon: FileText,
          variant: "outline",
          color: "border-blue-300 text-blue-700 hover:bg-blue-50",
        });
        break;
      case "offer_letter_declined":
        // Declined offers can be re-approved or rejected
        actions.push(
          {
            id: "approve",
            label: "Re-approve Application",
            icon: CheckCircle,
            variant: "default",
            color: "bg-green-600 hover:bg-green-700",
          },
          {
            id: "reject",
            label: "Reject Application",
            icon: XCircle,
            variant: "outline",
            color: "border-red-300 text-red-700 hover:bg-red-50",
          },
        );
        break;
      case "disbursed":
      case "withdrawn":
        // Terminal states - no actions available
        break;
      default:
        actions.push({
          id: "add_note",
          label: "Add Note",
          icon: MessageSquare,
          variant: "outline",
          color: "border-gray-300 text-gray-700 hover:bg-gray-50",
        });
    }

    return actions;
  };

  const availableActions = getAvailableActions();

  const getStatusBadgeColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-700";

    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "submitted":
        return "bg-blue-100 text-blue-700";
      case "under_review":
        return "bg-yellow-100 text-yellow-700";
      case "approved":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "offer_letter_sent":
        return "bg-purple-100 text-purple-700";
      case "offer_letter_signed":
        return "bg-emerald-100 text-emerald-700";
      case "offer_letter_declined":
        return "bg-orange-100 text-orange-700";
      case "disbursed":
        return "bg-green-100 text-green-700";
      case "withdrawn":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: application.id,
        data: {
          status: newStatus as any,
          reason: `Status updated to ${newStatus}`,
          metadata: {
            updatedBy: user?.id || "unknown",
          },
        },
      });
      toast.success(
        `Application status updated to ${formatStatusText(newStatus)}`,
      );
    } catch (error) {
      console.log(error);
      toast.error("Failed to update application status");
    }
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync({
        id: application.id,
        data: {
          reason: approveReason,
          metadata: {
            approvedBy: user?.id || "unknown",
          },
        },
      });
      toast.success("Application approved successfully");
      setApproveDialogOpen(false);
      setApproveReason("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to approve application");
    }
  };

  const handleReject = async () => {
    try {
      await rejectMutation.mutateAsync({
        id: application.id,
        data: {
          rejectionReason: rejectReason,
          reason: rejectReason,
          metadata: {
            rejectedBy: user?.id || "unknown",
          },
        },
      });
      toast.success("Application rejected");
      setRejectDialogOpen(false);
      setRejectReason("");
    } catch (error) {
      console.log(error);
      toast.error("Failed to reject application");
    }
  };

  const handleSendOffer = async () => {
    try {
      // According to business rules, updating status to "offer_letter_sent"
      // should auto-create and send the offer letter
      await handleStatusUpdate("offer_letter_sent");

      toast.success("Offer letter process initiated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to initiate offer letter process");
    }
  };

  const handleActionClick = (actionId: string) => {
    switch (actionId) {
      case "submit":
        handleStatusUpdate("submitted");
        break;
      case "review":
        handleStatusUpdate("under_review");
        break;
      case "approve":
        setApproveDialogOpen(true);
        break;
      case "reject":
        setRejectDialogOpen(true);
        break;
      case "request_docs":
        // TODO: Implement document request functionality
        // This should create document requests, not change status
        toast.info("Document request functionality coming soon");
        break;
      case "send_offer":
        handleSendOffer();
        break;
      case "resend_offer":
        // TODO: Implement resend offer letter functionality
        toast.info("Resend offer letter functionality coming soon");
        break;
      case "disburse":
        handleStatusUpdate("disbursed");
        break;
      case "resubmit":
        handleStatusUpdate("submitted");
        break;
      case "add_note":
        // TODO: Implement note adding
        toast.info("Note functionality coming soon");
        break;
      default:
        console.log("Unknown action:", actionId);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Current Status */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Current Status
          </h3>
          <Badge
            className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusBadgeColor(application.status)}`}
          >
            {formatStatusText(application.status)}
          </Badge>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            {availableActions.map((action) => {
              const Icon = action.icon;
              return (
                <Button
                  key={action.id}
                  onClick={() => handleActionClick(action.id)}
                  disabled={
                    updateStatusMutation.isPending ||
                    approveMutation.isPending ||
                    rejectMutation.isPending ||
                    createOfferMutation.isPending ||
                    sendOfferMutation.isPending
                  }
                  className={`w-full justify-start gap-2 ${action.color}`}
                  variant={action.variant as any}
                >
                  <Icon className="h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Application Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Application Info
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Application ID</span>
              <span className="font-medium text-gray-900">
                {application.id}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Submitted</span>
              <span className="font-medium text-gray-900">
                {new Date(application.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-medium text-gray-900">
                {new Date(application.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Officer Assignment (Placeholder) */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Assignment
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Assigned to:</span>
            <span className="font-medium text-gray-900">You</span>
          </div>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this loan application? Please
              provide a reason for approval.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approve-reason">Approval Reason</Label>
              <Textarea
                id="approve-reason"
                placeholder="Enter reason for approval..."
                value={approveReason}
                onChange={(e) => setApproveReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={approveMutation.isPending || !approveReason.trim()}
              className="bg-green-600 hover:bg-green-700"
            >
              {approveMutation.isPending
                ? "Approving..."
                : "Approve Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this loan application? Please
              provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-reason">Rejection Reason</Label>
              <Textarea
                id="reject-reason"
                placeholder="Enter reason for rejection..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={rejectMutation.isPending || !rejectReason.trim()}
              variant="destructive"
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject Application"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
