"use client";

import React from "react";
import { FileText, CheckCircle, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContractTimelineEvent {
  id: string;
  type: string;
  title: string;
  description?: string;
  createdAt: string;
  performedBy?: string;
}

interface ContractTimelineProps {
  events: ContractTimelineEvent[];
}

const statusIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  uploaded: FileText,
  sent_for_signing: Clock,
  signed: CheckCircle,
  pending_next_signature: Loader2,
  fully_executed: CheckCircle,
};

export function ContractTimeline({ events }: ContractTimelineProps) {
  return (
    <div className="relative">
      <div className="space-y-0">
        {events.map((event, index) => {
          const Icon = statusIcons[event.type] || FileText;
          const isLast = index === events.length - 1;

          return (
            <div key={event.id} className="relative">
              <div className="relative pl-12 pb-2">
                {!isLast && (
                  <div className="absolute left-4 top-full h-2">
                    <div
                      className={cn(
                        "h-full border-l-2 border-dashed border-primaryGrey-300",
                      )}
                    />
                  </div>
                )}

                <div className="bg-white rounded-md border border-primaryGrey-200 p-4 shadow-sm relative">
                  <div className="absolute left-4 top-4">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-primary-green flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-primary-green" />
                    </div>
                  </div>

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
                      <span>Created on: {event.createdAt}</span>
                      {event.performedBy && (
                        <span>Updated by: {event.performedBy}</span>
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

