"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Building2,
  Calendar,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import type { LoanApplicationItem } from "@/lib/api/types";

interface ApplicantInformationProps {
  application: LoanApplicationItem;
}

export function ApplicantInformation({
  application,
}: ApplicantInformationProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="px-8 py-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <User className="h-5 w-5" />
          Applicant Information
        </h2>
        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">
              Personal Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-primaryGrey-400" />
                  <div>
                    <p className="text-xs text-primaryGrey-400">Full Name</p>
                    <p className="font-medium text-midnight-blue">
                      {application.user?.firstName} {application.user?.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primaryGrey-400" />
                  <div>
                    <p className="text-xs text-primaryGrey-400">
                      Email Address
                    </p>
                    <p className="font-medium text-midnight-blue">
                      {application.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primaryGrey-400" />
                  <div>
                    <p className="text-xs text-primaryGrey-400">Member Since</p>
                    <p className="font-medium text-midnight-blue">
                      {formatDate(application.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className="border-primary-green text-primary-green"
                  >
                    Verified Account
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Business Information (if business loan) */}
          {application.isBusinessLoan && application.business && (
            <>
              <div className="border-t border-primaryGrey-100"></div>
              <div>
                <h4 className="font-medium text-midnight-blue mb-3 flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Business Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Building2 className="h-4 w-4 text-primaryGrey-400" />
                      <div>
                        <p className="text-xs text-primaryGrey-400">
                          Business Name
                        </p>
                        <p className="font-medium text-midnight-blue">
                          {application.business.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-primaryGrey-400" />
                      <div>
                        <p className="text-xs text-primaryGrey-400">Industry</p>
                        <p className="font-medium text-midnight-blue">
                          Technology Services
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-primaryGrey-400" />
                      <div>
                        <p className="text-xs text-primaryGrey-400">
                          Established
                        </p>
                        <p className="font-medium text-midnight-blue">2020</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-primaryGrey-400" />
                      <div>
                        <p className="text-xs text-primaryGrey-400">Location</p>
                        <p className="font-medium text-midnight-blue">
                          Lagos, Nigeria
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Co-applicants (if any) */}
          {application.coApplicantIds && (
            <>
              <div className="border-t border-primaryGrey-100"></div>
              <div>
                <h4 className="font-medium text-midnight-blue mb-3">
                  Co-applicants
                </h4>
                <div className="bg-primaryGrey-50 p-4 rounded-lg">
                  <p className="text-sm text-primaryGrey-400">
                    Co-applicant information will be displayed here when
                    available.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Application Metadata */}
          <div className="border-t border-primaryGrey-100"></div>
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">
              Application Details
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-primaryGrey-400">Application ID</p>
                <p className="font-medium text-midnight-blue">
                  {application.id}
                </p>
              </div>
              <div>
                <p className="text-primaryGrey-400">User ID</p>
                <p className="font-medium text-midnight-blue">
                  {application.userId}
                </p>
              </div>
              {application.businessId && (
                <div>
                  <p className="text-primaryGrey-400">Business ID</p>
                  <p className="font-medium text-midnight-blue">
                    {application.businessId}
                  </p>
                </div>
              )}
              <div>
                <p className="text-primaryGrey-400">Last Updated</p>
                <p className="font-medium text-midnight-blue">
                  {formatDate(application.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
