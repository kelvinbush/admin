"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import type { OrganizationResponse } from "@/lib/api/hooks/organizations";

export type OrganizationTableItem = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

interface OrganizationsTableProps {
  data: OrganizationTableItem[];
  isLoading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  actionBusyId?: string | null;
}

export function OrganizationsTable({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  actionBusyId,
}: OrganizationsTableProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <Card className="shadow-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-primaryGrey-50">
                  <TableHead className="font-medium text-primaryGrey-500 py-4">
                    NAME
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    DESCRIPTION
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    CREATED
                  </TableHead>
                  <TableHead className="font-medium text-midnight-blue py-4">
                    ACTIONS
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell className="py-4">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return null; // Empty state handled by parent
  }

  return (
    <Card className="shadow-none">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-primaryGrey-50">
                <TableHead className="font-medium text-primaryGrey-500 py-4">
                  NAME
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  DESCRIPTION
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  CREATED
                </TableHead>
                <TableHead className="font-medium text-midnight-blue py-4">
                  ACTIONS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((org) => {
                const isBusy = actionBusyId === org.id;
                const createdDate = new Date(org.createdAt).toLocaleDateString();

                return (
                  <TableRow
                    key={org.id}
                    className="hover:bg-gray-50"
                  >
                    <TableCell className="py-4">
                      <div className="text-sm font-medium text-midnight-blue">
                        {org.name}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500">
                        {org.description || "—"}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="text-sm text-primaryGrey-500">
                        {createdDate}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-primary-green hover:text-primary-green hover:bg-green-50"
                          onClick={() => {
                            if (onEdit) {
                              onEdit(org.id);
                            }
                          }}
                          disabled={isBusy}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-600 hover:bg-red-50"
                          onClick={() => {
                            if (onDelete) {
                              onDelete(org.id);
                            }
                          }}
                          disabled={isBusy}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

