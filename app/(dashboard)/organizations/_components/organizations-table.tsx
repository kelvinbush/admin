"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";

export interface Organization {
  id: string;
  name: string;
  affiliationType: "MK Partner" | "Investor";
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
}

interface OrganizationsTableProps {
  organizations: Organization[];
  onEdit: (organization: Organization) => void;
  onDelete: (organization: Organization) => void;
}

export function OrganizationsTable({
  organizations,
  onEdit,
  onDelete,
}: OrganizationsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader className="bg-[#F8F9FA]">
          <TableRow>
            <TableHead className="font-medium text-black">ORGANIZATION NAME</TableHead>
            <TableHead className="font-medium text-black">AFFILIATION TYPE</TableHead>
            <TableHead className="font-medium text-black">CREATED AT</TableHead>
            <TableHead className="font-medium text-black">CREATED BY</TableHead>
            <TableHead className="font-medium text-black">UPDATED AT</TableHead>
            <TableHead className="font-medium text-black text-right">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map((organization) => (
            <TableRow key={organization.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">{organization.name}</TableCell>
              <TableCell>{organization.affiliationType}</TableCell>
              <TableCell>{organization.createdAt}</TableCell>
              <TableCell>{organization.createdBy}</TableCell>
              <TableCell>{organization.updatedAt || "-"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-blue-600"
                    onClick={() => onEdit(organization)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 text-red-600"
                    onClick={() => onDelete(organization)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
