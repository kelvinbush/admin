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
import {
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  useCreateLoanProductMutation,
  useGetAllLoanProductsQuery,
} from "@/lib/redux/services/loan-product";
import { useGetAllPartnersQuery } from "@/lib/redux/services/partner";
import { selectCurrentToken } from "@/lib/redux/features/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { LoanProduct, SupportedCurrency } from "@/lib/types/loan-product";
import { Partner } from "@/lib/types/partner";

// Form schema for creating a new loan product
const formSchema = z.object({
  loanName: z.string().min(2, {
    message: "Loan name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  partnerReference: z.string().min(1, {
    message: "Please select a partner.",
  }),
  integrationType: z.coerce.number().min(0, {
    message: "Please select an integration type.",
  }),
  loanProductType: z.coerce.number().min(0, {
    message: "Please select a loan product type.",
  }),
  loanPriceMax: z.coerce.number().min(0, {
    message: "Loan price max must be a positive number.",
  }),
  loanInterest: z.coerce.number().min(0, {
    message: "Loan interest must be a positive number.",
  }),
  currency: z.string().min(1, {
    message: "Please select a currency.",
  }) as z.ZodType<SupportedCurrency>,
});

const integrationTypes = [
  { label: "Normal", value: "0" },
  { label: "Presta", value: "1" },
];

const loanProductTypes = [
  { label: "Personal Loan", value: "0" },
  { label: "Business Loan", value: "1" },
  { label: "Mortgage", value: "2" },
  { label: "Auto Loan", value: "3" },
  { label: "Student Loan", value: "4" },
];

const currencyOptions = [
  { label: "KES - Kenyan Shilling", value: "KES" },
  { label: "USD - US Dollar", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
  { label: "GBP - British Pound", value: "GBP" },
  { label: "CAD - Canadian Dollar", value: "CAD" },
  { label: "AUD - Australian Dollar", value: "AUD" },
  { label: "JPY - Japanese Yen", value: "JPY" },
  { label: "CHF - Swiss Franc", value: "CHF" },
  { label: "CNY - Chinese Yuan", value: "CNY" },
  { label: "HKD - Hong Kong Dollar", value: "HKD" },
  { label: "SGD - Singapore Dollar", value: "SGD" },
  { label: "NGN - Nigerian Naira", value: "NGN" },
  { label: "ZAR - South African Rand", value: "ZAR" },
  { label: "GHS - Ghanaian Cedi", value: "GHS" },
  { label: "UGX - Ugandan Shilling", value: "UGX" },
  { label: "TZS - Tanzanian Shilling", value: "TZS" },
  { label: "RWF - Rwandan Franc", value: "RWF" },
  { label: "EGP - Egyptian Pound", value: "EGP" },
  { label: "MAD - Moroccan Dirham", value: "MAD" },
];

const statusTypes = [
  { label: "Inactive", value: 0, color: "bg-gray-100 text-gray-800" },
  { label: "Active", value: 1, color: "bg-green-100 text-green-800" },
  { label: "Suspended", value: 2, color: "bg-yellow-100 text-yellow-800" },
  { label: "Discontinued", value: 3, color: "bg-red-100 text-red-800" },
];

const LoanProductsPage = () => {
  const guid = useAppSelector(selectCurrentToken);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const itemsPerPage = 10;

  const { data: loanProductsResponse, isLoading: isLoadingProducts } =
    useGetAllLoanProductsQuery(guid as string);

  const { data: partnersResponse, isLoading: isLoadingPartners } =
    useGetAllPartnersQuery(guid as string);

  const [createLoanProduct, { isLoading: isCreating }] =
    useCreateLoanProductMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanName: "",
      description: "",
      partnerReference: "",
      integrationType: 0,
      loanProductType: 0,
      loanPriceMax: 0,
      loanInterest: 0,
      currency: "KES",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createLoanProduct({
        loanName: values.loanName,
        description: values.description,
        partnerReference: values.partnerReference,
        integrationType: values.integrationType,
        loanProductType: values.loanProductType,
        loanPriceMax: values.loanPriceMax,
        loanInterest: values.loanInterest,
        currency: values.currency,
      }).unwrap();

      toast.success("Loan product created successfully");
      form.reset({
        loanName: "",
        description: "",
        partnerReference: "",
        integrationType: 0,
        loanProductType: 0,
        loanPriceMax: 0,
        loanInterest: 0,
        currency: "KES",
      });
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create loan product");
      console.error("Error creating loan product:", error);
    }
  };

  const loanProducts = loanProductsResponse || [];
  const partners = partnersResponse || [];

  // Filter and search data
  const filteredData = loanProducts.filter((product) => {
    const matchesSearch = product.loanName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedData = [...filteredData].sort(
    (a: LoanProduct, b: LoanProduct) => {
      switch (sortBy) {
        case "ascending":
          return a.loanName.localeCompare(b.loanName);
        case "descending":
          return b.loanName.localeCompare(a.loanName);
        default:
          return 0;
      }
    },
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  if (isLoadingProducts || isLoadingPartners) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Loan Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(1)].map((_, index) => (
            <Card key={index} className="bg-midnight-blue animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Loan Products</h1>

      {/* Table Section */}
      <div className="flex flex-col space-y-4 bg-white shadow p-4 rounded">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-2xl font-medium mr-auto">
            Loan Products ({loanProducts.length})
          </h2>

          {/* Search Input */}
          <div className="relative min-w-[160px]">
            <Input
              placeholder="Search loan products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <MagnifyingGlassIcon className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                <XMarkIcon className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <span>{sortBy ? `Sort: ${sortBy}` : "Sort by"}</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ascending">Name (A-Z)</SelectItem>
              <SelectItem value="descending">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>

          {/* Create Button */}
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-midnight-blue text-white hover:bg-midnight-blue/90"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Loan Product
          </Button>

          {/* Create Loan Product Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Loan Product</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new loan product.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="loanName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Loan Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter loan name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter loan product description"
                            {...field}
                            className="min-h-[100px]"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="partnerReference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Partner</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <span>
                                {field.value
                                  ? partners.find(
                                      (p) => p.companyReference === field.value,
                                    )?.companyName || "Select partner"
                                  : "Select partner"}
                              </span>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {partners.map((partner: Partner) => (
                              <SelectItem
                                key={partner.companyReference}
                                value={partner.companyReference || ""}
                              >
                                {partner.companyName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="integrationType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Integration Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <span>
                                  {integrationTypes.find(
                                    (t) => parseInt(t.value) === field.value,
                                  )?.label || "Select type"}
                                </span>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {integrationTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="loanProductType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Loan Product Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <span>
                                  {loanProductTypes.find(
                                    (t) => parseInt(t.value) === field.value,
                                  )?.label || "Select type"}
                                </span>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loanProductTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="loanPriceMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Maximum Loan Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              placeholder="Enter maximum loan amount"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            The maximum amount that can be borrowed
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="loanInterest"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel required>Interest Rate (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="Enter interest rate"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Annual interest rate percentage
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel required>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <span>
                                {field.value
                                  ? currencyOptions.find(
                                      (c) => c.value === field.value
                                    )?.label || "Select currency"
                                  : "Select currency"}
                              </span>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {currencyOptions.map((currency) => (
                              <SelectItem
                                key={currency.value}
                                value={currency.value}
                              >
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          The currency for the loan amount
                        </FormDescription>
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
                      {isCreating ? "Creating..." : "Create Loan Product"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Loan Products Table */}
        {paginatedData.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No loan products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Loan Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Partner
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Integration Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Product Type
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Max Amount (Currency)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Interest Rate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {product.loanName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.partnerName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {integrationTypes.find(
                          (t) => parseInt(t.value) === product.integrationType,
                        )?.label || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {loanProductTypes.find(
                          (t) => parseInt(t.value) === product.loanProductType,
                        )?.label || "Unknown"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.loanPriceMax.toLocaleString("en-US", {
                          style: "currency",
                          currency: product.currency || "USD",
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {product.loanInterest}%
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          statusTypes.find((s) => s.value === product.status)
                            ?.color || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusTypes.find((s) => s.value === product.status)
                          ?.label || "Unknown"}
                      </span>
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
    </div>
  );
};

export default LoanProductsPage;
