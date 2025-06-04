"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import EmptyState from "./_components/empty-state";
import Header from "./_components/header";
import { Separator } from "@/components/ui/separator";
import { NewOrganizationModal } from "./_components/new-organization-modal";
import { OrganizationsTable, Organization } from "./_components/organizations-table";
import { OrganizationsFilters } from "./_components/organizations-filters";
import { OrganizationsPagination } from "./_components/organizations-pagination";
import { DeleteOrganizationModal } from "./_components/delete-organization-modal";
import { EditOrganizationModal } from "./_components/edit-organization-modal";
import { toast } from "sonner";

export default function OrganizationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState<Organization | null>(null);
  const [organizationToEdit, setOrganizationToEdit] = useState<Organization | null>(null);
  const [filters, setFilters] = useState<{
    affiliationType?: string;
    createdBy?: string;
    createdAt?: string;
  }>({});

  // Sample data based on the image
  const sampleOrganizations: Organization[] = [
    {
      id: "1",
      name: "Ecobank",
      affiliationType: "MK Partner",
      createdAt: "Jan 26, 2025",
      createdBy: "Melanie Keita",
      updatedAt: null
    },
    {
      id: "2",
      name: "Absa",
      affiliationType: "MK Partner",
      createdAt: "Jan 26, 2025",
      createdBy: "Jessica Kagisye",
      updatedAt: "Jan 28, 2025"
    },
    {
      id: "3",
      name: "Siemens",
      affiliationType: "MK Partner",
      createdAt: "Jan 28, 2025",
      createdBy: "Kelvin Wachiye",
      updatedAt: "Jan 31, 2025"
    },
    {
      id: "4",
      name: "ADB",
      affiliationType: "Investor",
      createdAt: "Jan 31, 2025",
      createdBy: "Shalyne Waweru",
      updatedAt: null
    },
    {
      id: "5",
      name: "GIZ",
      affiliationType: "Investor",
      createdAt: "Jan 31, 2025",
      createdBy: "Melanie Keita",
      updatedAt: "Feb 01, 2025"
    },
    {
      id: "6",
      name: "AFAWA",
      affiliationType: "Investor",
      createdAt: "Feb 01, 2025",
      createdBy: "Sylvia Silamoi",
      updatedAt: "Feb 04, 2025"
    },
    {
      id: "7",
      name: "Cooperative",
      affiliationType: "MK Partner",
      createdAt: "Feb 01, 2025",
      createdBy: "Melanie Keita",
      updatedAt: "Feb 02, 2025"
    },
  ];
  
  // Filter organizations based on search query and filters
  const filteredOrganizations = sampleOrganizations.filter(org => {
    // Filter by search query
    if (searchQuery && !org.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by affiliation type
    if (filters.affiliationType && filters.affiliationType !== 'all') {
      const normalizedType = filters.affiliationType === 'mk-partner' ? 'MK Partner' : 'Investor';
      if (org.affiliationType !== normalizedType) {
        return false;
      }
    }
    
    // Filter by created by
    if (filters.createdBy && filters.createdBy !== 'all') {
      const creatorMap: Record<string, string> = {
        'melanie-keita': 'Melanie Keita',
        'jessica-kagisye': 'Jessica Kagisye',
        'kelvin-wachiye': 'Kelvin Wachiye',
        'shalyne-waweru': 'Shalyne Waweru',
        'sylvia-silamoi': 'Sylvia Silamoi'
      };
      
      if (org.createdBy !== creatorMap[filters.createdBy]) {
        return false;
      }
    }
    
    // Filter by created at
    if (filters.createdAt && filters.createdAt !== 'all') {
      const today = new Date('2025-06-04'); // Using the current date from metadata
      const createdAtDate = new Date(org.createdAt);
      
      switch (filters.createdAt) {
        case 'last-week':
          const lastWeek = new Date(today);
          lastWeek.setDate(today.getDate() - 7);
          if (createdAtDate < lastWeek) return false;
          break;
        case 'last-month':
          const lastMonth = new Date(today);
          lastMonth.setMonth(today.getMonth() - 1);
          if (createdAtDate < lastMonth) return false;
          break;
        case 'last-3-months':
          const last3Months = new Date(today);
          last3Months.setMonth(today.getMonth() - 3);
          if (createdAtDate < last3Months) return false;
          break;
        case 'last-year':
          const lastYear = new Date(today);
          lastYear.setFullYear(today.getFullYear() - 1);
          if (createdAtDate < lastYear) return false;
          break;
      }
    }
    
    return true;
  });
  
  // Calculate pagination values
  const totalOrganizations = filteredOrganizations.length;
  const totalPages = Math.ceil(totalOrganizations / 10);
  
  // Get current page items (simple pagination implementation)
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrganizations = filteredOrganizations.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveOrganization = (organization: any) => {
    // Here you would typically make an API call to save the organization
    console.log("Saving organization:", organization);
    toast.success(`Organization ${organization.name} created successfully!`);
    // After saving, you might want to refresh the organizations list
  };

  const handleFilterChange = (newFilters: {
    affiliationType?: string;
    createdBy?: string;
    createdAt?: string;
  }) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditOrganization = (organization: Organization) => {
    setOrganizationToEdit(organization);
    setIsEditModalOpen(true);
  };

  const handleSaveEditedOrganization = (organization: any) => {
    // Here you would typically make an API call to update the organization
    console.log("Updating organization:", organization);
    toast.success(`Organization ${organization.name} updated successfully!`);
    // After updating, you might want to refresh the organizations list
  };

  const handleDeleteClick = (organization: Organization) => {
    setOrganizationToDelete(organization);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (organizationToDelete) {
      // Here you would typically make an API call to delete the organization
      console.log("Deleting organization:", organizationToDelete);
      toast.success(`Organization ${organizationToDelete.name} deleted successfully!`);
      // After deleting, you might want to refresh the organizations list
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6 bg-white px-4 rounded h-full flex-1 flex flex-col">
      <Header
        totalOrganizations={totalOrganizations}
        onSearch={handleSearch}
        onCreateClick={handleCreateClick}
      />

      <Separator />

      {filteredOrganizations.length > 0 ? (
        <div className="flex flex-col space-y-4">
          <OrganizationsFilters onFilterChange={handleFilterChange} />
          
          <OrganizationsTable 
            organizations={paginatedOrganizations}
            onEdit={handleEditOrganization}
            onDelete={handleDeleteClick}
          />
          
          <OrganizationsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalOrganizations}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <EmptyState onCreateClick={handleCreateClick} />
      )}

      <NewOrganizationModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleSaveOrganization}
      />

      {organizationToDelete && (
        <DeleteOrganizationModal
          open={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          organizationName={organizationToDelete.name}
        />
      )}

      {organizationToEdit && (
        <EditOrganizationModal
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSaveEditedOrganization}
          organization={organizationToEdit}
        />
      )}
    </div>
  );
}
