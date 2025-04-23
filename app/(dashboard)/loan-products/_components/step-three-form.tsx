"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateFormData, prevStep, resetForm } from "@/lib/redux/features/loan-product-form.slice";
import { useCreateLoanProductMutation } from "@/lib/redux/services/loan-product";
import { RootState } from "@/lib/redux/store";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  requiresApproval: z.boolean().default(true),
  enableNotifications: z.boolean().default(true),
  termsAndConditions: z.string().min(10, {
    message: "Terms and conditions must be at least 10 characters.",
  }),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface StepThreeFormProps {
  initialData?: Partial<FormValues>;
}

const StepThreeForm = ({ initialData }: StepThreeFormProps) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [createLoanProduct, { isLoading }] = useCreateLoanProductMutation();
  const formData = useSelector((state: RootState) => state.loanProductForm.formData);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      requiresApproval: initialData?.requiresApproval ?? true,
      enableNotifications: initialData?.enableNotifications ?? true,
      termsAndConditions: initialData?.termsAndConditions || "",
      acceptTerms: initialData?.acceptTerms || false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      // Combine all form data
      const finalFormData = {
        ...formData,
        requiresApproval: data.requiresApproval,
        enableNotifications: data.enableNotifications,
        termsAndConditions: data.termsAndConditions,
      };
      
      // Transform data to match API requirements
      const apiPayload = {
        loanName: finalFormData.loanName,
        description: finalFormData.loanDescription,
        partnerReference: "MK-001", // Since this is an MK loan product
        integrationType: 1, // Assuming 1 is for MK products
        loanProductType: finalFormData.loanType === "personal" ? 1 : 
                         finalFormData.loanType === "business" ? 2 : 
                         finalFormData.loanType === "education" ? 3 : 4,
        loanPriceMax: parseFloat(finalFormData.maximumLoanAmount),
        loanInterest: parseFloat(finalFormData.interestRate),
        currency: finalFormData.currency,
      };
      
      // Call API to create loan product
      await createLoanProduct(apiPayload).unwrap();
      
      toast({
        title: "Success!",
        description: "Loan product has been created successfully.",
      });
      
      // Reset form and redirect to loan products page
      dispatch(resetForm());
      router.push("/loan-products");
    } catch (error) {
      console.error("Failed to create loan product:", error);
      toast({
        title: "Error",
        description: "Failed to create loan product. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    dispatch(prevStep());
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Additional Settings & Review</h2>
        <p className="text-gray-500">Configure additional settings and review your loan product details</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Loan Product Summary</CardTitle>
            <CardDescription>Review the details of your loan product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Basic Details</h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Product Name:</div>
                <div>{formData.loanName}</div>
                
                <div className="text-gray-500">Loan Type:</div>
                <div>{formData.loanType}</div>
                
                <div className="text-gray-500">Provider:</div>
                <div>{formData.loanProvider}</div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium">Loan Terms</h3>
              <Separator className="my-2" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-gray-500">Min Amount:</div>
                <div>{formData.minimumLoanAmount} {formData.currency}</div>
                
                <div className="text-gray-500">Max Amount:</div>
                <div>{formData.maximumLoanAmount} {formData.currency}</div>
                
                <div className="text-gray-500">Min Duration:</div>
                <div>{formData.minimumLoanDuration}</div>
                
                <div className="text-gray-500">Max Duration:</div>
                <div>{formData.maximumLoanDuration}</div>
                
                <div className="text-gray-500">Interest Rate:</div>
                <div>{formData.interestRate}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Additional Settings</CardTitle>
                <CardDescription>Configure additional settings for your loan product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="requiresApproval"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Requires Approval</FormLabel>
                        <FormDescription>
                          Loan requests will require manual approval
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="enableNotifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel>Enable Notifications</FormLabel>
                        <FormDescription>
                          Send notifications for loan status updates
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="termsAndConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Terms and Conditions <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter terms and conditions for this loan product" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="acceptTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I confirm that all the information provided is correct
                        </FormLabel>
                        <FormDescription>
                          By checking this box, you agree to create this loan product
                        </FormDescription>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <div className="flex justify-between pt-4">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Loan Product"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default StepThreeForm;
