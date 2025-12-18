"use client";

import React from "react";
import { FileText, Clock, XCircle, CheckCircle, Loader2, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineEventType =
  | "submitted"
  | "cancelled"
  | "review_in_progress"
  | "rejected"
  | "approved"
  | "awaiting_disbursement"
  | "disbursed";

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  date: string;
  time?: string;
  updatedDate?: string;
  updatedTime?: string;
  performedBy?: string;
  lineColor?: "green" | "orange" | "grey";
}

interface LoanTimelineProps {
  events: TimelineEvent[];
}

const eventIcons: Record<TimelineEventType, React.ComponentType<{ className?: string }>> = {
  submitted: FileText,
  cancelled: FileText,
  review_in_progress: Clock,
  rejected: XCircle,
  approved: CheckCircle,
  awaiting_disbursement: Loader2,
  disbursed: Wallet,
};

export function LoanTimeline({ events }: LoanTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline Events */}
      <div className="space-y-0">
        {events.map((event, index) => {
          const Icon = eventIcons[event.type];
          const isLast = index === events.length - 1;
          const nextEvent = events[index + 1];
          const nextLineColor = nextEvent?.lineColor || "green";

          // Determine the action word for the date label
          const getDateLabel = () => {
            if (event.type === "submitted") return "Submitted on";
            if (event.type === "cancelled") return "Cancelled on";
            if (event.type === "rejected") return "Rejected on";
            if (event.type === "approved") return "Approved on";
            if (event.type === "disbursed") return "Disbursed on";
            if (event.type === "review_in_progress") return "Review started on";
            return "Updated on";
          };

          const getPerformedByLabel = () => {
            if (event.type === "submitted") return "Submitted by";
            if (event.type === "cancelled") return "Cancelled by";
            return "Updated by";
          };

          return (
            <div key={event.id} className="relative">
              {/* Event Card */}
              <div className="relative pl-12 pb-2">
                {/* Vertical Timeline Line - from bottom of this card to top of next */}
                {!isLast && (
                  <div className="absolute left-4 top-full h-2">
                    <div
                      className={cn(
                        "h-full border-l-2 border-dashed",
                        nextLineColor === "green"
                          ? "border-primary-green"
                          : nextLineColor === "orange"
                            ? "border-orange-400"
                            : "border-primaryGrey-300"
                      )}
                    />
                  </div>
                )}

                <div className="bg-white rounded-md border border-primaryGrey-200 p-4 shadow-sm relative">
                  {/* Icon inside card */}
                  <div className="absolute left-4 top-4">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-primary-green flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-primary-green" />
                    </div>
                  </div>

                  {/* Content with left padding to make room for icon */}
                  <div className="pl-10">
                    <h3 className="text-base text-primary-green mb-2">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-primaryGrey-600 mb-3">
                        {event.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-4 text-xs text-primaryGrey-500">
                      {event.date && (
                        <span>
                          {getDateLabel()}: {event.date}
                          {event.time && ` at ${event.time}`}
                        </span>
                      )}
                      {event.updatedDate && (
                        <span>
                          Updated on: {event.updatedDate}
                          {event.updatedTime && ` at ${event.updatedTime}`}
                        </span>
                      )}
                      {event.performedBy && (
                        <span>
                          {getPerformedByLabel()}: {event.performedBy}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
