"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  useCreatePartnerMutation,
  useGetAllPartnersQuery,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} from "@/lib/redux/services/partner";
import { selectCurrentToken } from "@/lib/redux/features/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Partner } from "@/lib/types/partner";

// Form schema for creating a new partner
const formSchema = z.object({
  companyname: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
});

// Form schema for updating a partner
const updateFormSchema = z.object({
  companyName: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
});

const PartnersPage = () => {
  const guid = useAppSelector(selectCurrentToken);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const itemsPerPage = 10;

  const { data: partnersResponse, isLoading } = useGetAllPartnersQuery(
    guid as string,
  );

  const [createPartner, { isLoading: isCreating }] = useCreatePartnerMutation();
  const [updatePartner, { isLoading: isUpdating }] = useUpdatePartnerMutation();
  const [deletePartner, { isLoading: isDeleting }] = useDeletePartnerMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyname: "",
    },
  });

  const updateForm = useForm<z.infer<typeof updateFormSchema>>({
    resolver: zodResolver(updateFormSchema),
    defaultValues: {
      companyName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createPartner({
        adminguid: guid as string,
        companyname: values.companyname,
      }).unwrap();

      toast.success("Partner created successfully");
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create partner");
      console.error("Error creating partner:", error);
    }
  };

  const onUpdateSubmit = async (values: z.infer<typeof updateFormSchema>) => {
    if (!selectedPartner) return;

    try {
      await updatePartner({
        companyName: values.companyName,
        companyReference: selectedPartner.companyReference,
        adminReference: guid as string,
      }).unwrap();

      toast.success("Partner updated successfully");
      updateForm.reset();
      setIsEditDialogOpen(false);
      setSelectedPartner(null);
    } catch (error) {
      toast.error("Failed to update partner");
      console.error("Error updating partner:", error);
    }
  };

  const handleEditPartner = (partner: Partner) => {
    setSelectedPartner(partner);
    updateForm.setValue("companyName", partner.companyName);
    setIsEditDialogOpen(true);
  };

  const handleDeletePartner = (partner: Partner) => {
    setSelectedPartner(partner);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeletePartner = async () => {
    if (!selectedPartner) return;

    try {
      await deletePartner({
        companyReference: selectedPartner.companyReference,
        adminReference: guid as string,
      }).unwrap();

      toast.success("Partner deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedPartner(null);
    } catch (error) {
      toast.error("Failed to delete partner");
      console.error("Error deleting partner:", error);
    }
  };

  const partners = partnersResponse || [];

  // Filter and search data
  const filteredData = partners.filter((partner: Partner) => {
    const matchesSearch =
      searchQuery === "" ||
      partner.companyName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSearch;
  });

  const sortedData = [...filteredData].sort((a: Partner, b: Partner) => {
    switch (sortBy) {
      case "ascending":
        return a.companyName.localeCompare(b.companyName);
      case "descending":
        return b.companyName.localeCompare(a.companyName);
      default:
        return 0;
    }
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortBy]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Partners</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(1)].map((_, index) => (
            <Card key={index} className="bg-midnight-blue animate-pulse">
              <CardContent className="p-4 h-[100px]"></CardContent>
            </Card>
          ))}
        </div>
        <div className="bg-white rounded-lg shadow p-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        <Card className="bg-midnight-blue text-white shadow-md border-midnight-blue">
          <CardContent className="p-6">
            <h3 className="text-lg">Total Partners</h3>
            <div className="mt-2 items-baseline gap-2">
              <span className="text-2xl font-bold">{partners.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table Section */}
      <div className="flex flex-col space-y-4 bg-white shadow p-4 rounded">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-medium mr-auto">
            Partners ({partners.length})
          </h2>

          {/* Search Input */}
          <div className="relative min-w-[160px]">
            <Input
              type="text"
              placeholder="Search partner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <XMarkIcon className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className={"w-max"}>
              <div className="flex items-center gap-2">Sort by</div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ascending">A-Z</SelectItem>
              <SelectItem value="descending">Z-A</SelectItem>
            </SelectContent>
          </Select>

          {/* Download Button */}
          <Button
            variant="secondary"
            className="flex items-center gap-2 bg-[#E8E9EA]"
          >
            <ArrowDownTrayIcon className="h-5 w-5" />
          </Button>

          {/* New Partner Button */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-midnight-blue text-white hover:bg-midnight-blue/90 flex items-center gap-2">
                <PlusIcon className="h-5 w-5" />
                New Partner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Partner</DialogTitle>
                <DialogDescription>
                  Enter the details of the new partner company.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="companyname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter company name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isCreating}
                      className="bg-midnight-blue text-white hover:bg-midnight-blue/90"
                    >
                      {isCreating ? "Creating..." : "Create Partner"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Show "No results found" message when there's no data */}
        {paginatedData.length === 0 && (
          <div className={"grid place-items-center h-full py-16"}>
            <Icons.entreIcon />
            <div className="text-center py-8">
              No partners found; try refining your search or add a new partner.
            </div>
          </div>
        )}

        {/* Table */}
        {paginatedData.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-[#E8E9EA] border-b border-b-[#B6BABC]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Company Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Company Reference
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((partner: Partner) => (
                  <tr
                    key={partner.companyReference}
                    className={"hover:bg-[#E6FAF5] transition duration-300"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {partner.companyName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {partner.companyReference}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="outline"
                        size="sm"
                        className="mr-2"
                        onClick={() => handleEditPartner(partner)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeletePartner(partner)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {paginatedData.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">
                {(currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredData.length)}
              </span>{" "}
              of <span className="font-medium">{filteredData.length}</span>{" "}
              results
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Partner Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Partner</DialogTitle>
            <DialogDescription>
              Update the details of the partner company.
            </DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form
              onSubmit={updateForm.handleSubmit(onUpdateSubmit)}
              className="space-y-4"
            >
              <FormField
                control={updateForm.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel required>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setSelectedPartner(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isUpdating}
                  className="bg-midnight-blue text-white hover:bg-midnight-blue/90"
                >
                  {isUpdating ? "Updating..." : "Update Partner"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Partner Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Partner</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this partner? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedPartner && (
              <div className="p-4 border rounded mb-4">
                <p className="font-medium">
                  Company Name: {selectedPartner.companyName}
                </p>
                <p className="text-sm text-gray-500">
                  Reference: {selectedPartner.companyReference}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedPartner(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={confirmDeletePartner}
            >
              {isDeleting ? "Deleting..." : "Delete Partner"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PartnersPage;
