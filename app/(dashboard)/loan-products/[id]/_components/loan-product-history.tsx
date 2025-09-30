"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoanProduct } from "@/lib/api/types";
import { useUser } from "@clerk/nextjs";

interface LoanProductHistoryProps {
  product: LoanProduct;
}

export function LoanProductHistory({ product }: LoanProductHistoryProps) {
  const { user } = useUser();
  const [approvedByName, setApprovedByName] = useState<string>('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-500 text-green-500';
      case 'draft':
        return 'border-yellow-500 text-yellow-500';
      case 'archived':
        return 'border-red-500 text-red-500';
      default:
        return 'border-primaryGrey-300 text-primaryGrey-400';
    }
  };

  // Fetch user name for approvedBy
  useEffect(() => {
    const fetchUserName = async () => {
      if (product.approvedBy) {
        try {
          const response = await fetch(`/api/users/${product.approvedBy}`);
          if (response.ok) {
            const userData = await response.json();
            setApprovedByName(userData.name);
          } else {
            setApprovedByName(`User ${product.approvedBy.slice(-8)}`);
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
          setApprovedByName(`User ${product.approvedBy.slice(-8)}`);
        }
      }
    };

    fetchUserName();
  }, [product.approvedBy]);

  return (
    <Card className="shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-midnight-blue">
          Product History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primaryGrey-200"></div>
          
          <div className="space-y-6">
            {/* Current Status */}
            <div className="relative flex items-start gap-4">
              <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-primary-green rounded-full border-2 border-white">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-midnight-blue">Current Status</h4>
                  <Badge
                    variant="outline"
                    className={`font-normal text-xs ${getStatusColor(product.status)}`}
                  >
                    {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-xs text-primaryGrey-400 mt-1">Version {product.version}</p>
                <p className="text-xs text-primaryGrey-400">{formatDate(product.updatedAt)}</p>
              </div>
            </div>

            {/* Approval */}
            {product.approvedAt && (
              <div className="relative flex items-start gap-4">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-green-500 rounded-full border-2 border-white">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-midnight-blue">Product Approved</h4>
                  <p className="text-xs text-primaryGrey-400 mt-1">
                    {product.approvedBy ? `Approved by ${approvedByName || 'Loading...'}` : 'Approved for launch'}
                  </p>
                  <p className="text-xs text-primaryGrey-400">{formatDate(product.approvedAt)}</p>
                  {product.changeReason && (
                    <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700">
                      <strong>Reason:</strong> {product.changeReason}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Last Update */}
            {product.updatedAt !== product.createdAt && (
              <div className="relative flex items-start gap-4">
                <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-yellow-500 rounded-full border-2 border-white">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-midnight-blue">Last Updated</h4>
                  <p className="text-xs text-primaryGrey-400 mt-1">Version {product.version}</p>
                  <p className="text-xs text-primaryGrey-400">{formatDate(product.updatedAt)}</p>
                </div>
              </div>
            )}

            {/* Creation */}
            <div className="relative flex items-start gap-4">
              <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full border-2 border-white">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-midnight-blue">Product Created</h4>
                <p className="text-xs text-primaryGrey-400 mt-1">Initial version created</p>
                <p className="text-xs text-primaryGrey-400">{formatDate(product.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
