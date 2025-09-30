"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoanProduct } from "@/lib/api/types";

interface LoanProductOverviewProps {
  product: LoanProduct;
}

export function LoanProductOverview({ product }: LoanProductOverviewProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-midnight-blue">
          Product Overview
        </h3>
      </div>
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">Basic Information</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Product Name</span>
                <span className="text-sm font-medium text-midnight-blue">{product.name}</span>
              </div>
              {product.slug && (
                <div className="flex justify-between">
                  <span className="text-sm text-primaryGrey-400">Slug</span>
                  <span className="text-sm font-medium text-midnight-blue">{product.slug}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Currency</span>
                <span className="text-sm font-medium text-midnight-blue">{product.currency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Status</span>
                <Badge
                  variant="outline"
                  className={`font-normal text-xs ${
                    product.status === 'active'
                      ? 'border-green-500 text-green-500'
                      : product.status === 'draft'
                      ? 'border-yellow-500 text-yellow-500'
                      : 'border-red-500 text-red-500'
                  }`}
                >
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-midnight-blue mb-3">Version & Dates</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Version</span>
                <span className="text-sm font-medium text-midnight-blue">{product.version}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Created</span>
                <span className="text-sm font-medium text-midnight-blue">{formatDate(product.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-primaryGrey-400">Last Updated</span>
                <span className="text-sm font-medium text-midnight-blue">{formatDate(product.updatedAt)}</span>
              </div>
              {product.approvedAt && (
                <div className="flex justify-between">
                  <span className="text-sm text-primaryGrey-400">Approved</span>
                  <span className="text-sm font-medium text-midnight-blue">{formatDate(product.approvedAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">Description</h4>
            <p className="text-sm text-primaryGrey-400 leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Summary */}
        {product.summary && (
          <div>
            <h4 className="font-medium text-midnight-blue mb-3">Summary</h4>
            <div className="bg-primaryGrey-50 p-4 rounded-lg">
              <p className="text-sm text-primaryGrey-400">{product.summary}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
