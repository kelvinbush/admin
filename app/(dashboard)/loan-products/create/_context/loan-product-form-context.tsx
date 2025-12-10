"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { format } from "date-fns";
import type { CreateLoanProductFormData } from "@/lib/validations/loan-product";

export type LoanFee = {
  loanFeeId?: string;
  feeName?: string;
  calculationMethod: string;
  rate: string;
  collectionRule: string;
  allocationMethod: string;
  calculationBasis: string;
};

type LoanProductFormState = {
  // Step 1 data
  step1Data?: Partial<CreateLoanProductFormData>;
  // Step 2 data
  step2Data?: {
    repaymentFrequency: string;
    maxGracePeriod: string;
    maxGraceUnit: string;
    interestRate: string;
    ratePeriod: string;
    amortizationMethod: string;
    interestCollectionMethod: string;
    interestRecognitionCriteria: string;
  };
  // Step 3 data
  fees: LoanFee[];
};

type LoanProductFormContextType = {
  formState: LoanProductFormState;
  updateStep1Data: (data: Partial<CreateLoanProductFormData>) => void;
  updateStep2Data: (data: LoanProductFormState["step2Data"]) => void;
  addFee: (fee: LoanFee) => void;
  removeFee: (index: number) => void;
  clearForm: () => void;
  getCombinedFormData: () => any; // Combined data ready for API submission
};

const LoanProductFormContext = createContext<LoanProductFormContextType | undefined>(undefined);

export function LoanProductFormProvider({ children }: { children: React.ReactNode }) {
  const [formState, setFormState] = useState<LoanProductFormState>({
    fees: [],
  });

  const updateStep1Data = useCallback((data: Partial<CreateLoanProductFormData>) => {
    setFormState((prev) => ({
      ...prev,
      step1Data: { ...prev.step1Data, ...data },
    }));
  }, []);

  const updateStep2Data = useCallback((data: LoanProductFormState["step2Data"]) => {
    setFormState((prev) => ({
      ...prev,
      step2Data: data,
    }));
  }, []);

  const addFee = useCallback((fee: LoanFee) => {
    setFormState((prev) => ({
      ...prev,
      fees: [...prev.fees, fee],
    }));
  }, []);

  const removeFee = useCallback((index: number) => {
    setFormState((prev) => ({
      ...prev,
      fees: prev.fees.filter((_, i) => i !== index),
    }));
  }, []);

  const clearForm = useCallback(() => {
    setFormState({
      fees: [],
    });
  }, []);

  const getCombinedFormData = useCallback(() => {
    const step1 = formState.step1Data || {};
    const step2 = formState.step2Data || {};
    const fees = formState.fees || [];

    // Transform UI data to API format
    return {
      // Step 1 fields
      name: step1.name,
      slug: step1.slug,
      summary: step1.summary,
      description: step1.description,
      currency: step1.currency,
      minAmount: step1.minAmount,
      maxAmount: step1.maxAmount,
      minTerm: step1.minTerm,
      maxTerm: step1.maxTerm,
      termUnit: step1.termUnit,
      availabilityStartDate: step1.availabilityStartDate
        ? format(step1.availabilityStartDate, "yyyy-MM-dd")
        : undefined,
      availabilityEndDate: step1.availabilityEndDate
        ? format(step1.availabilityEndDate, "yyyy-MM-dd")
        : undefined,
      organizationId: step1.loanProvider, // Transform loanProvider → organizationId
      userGroupIds: step1.loanVisibility ? [step1.loanVisibility] : [], // Transform loanVisibility → userGroupIds array

      // Step 2 fields
      repaymentFrequency: step2.repaymentFrequency,
      maxGracePeriod: step2.maxGracePeriod ? Number(step2.maxGracePeriod) : undefined,
      maxGraceUnit: step2.maxGraceUnit,
      interestRate: step2.interestRate ? Number(step2.interestRate) : undefined,
      ratePeriod: step2.ratePeriod,
      amortizationMethod: step2.amortizationMethod,
      interestCollectionMethod: step2.interestCollectionMethod,
      interestRecognitionCriteria: step2.interestRecognitionCriteria,

      // Step 3 fields
      fees: fees.map((fee) => ({
        loanFeeId: fee.loanFeeId,
        feeName: fee.feeName,
        calculationMethod: fee.calculationMethod,
        rate: Number(fee.rate),
        collectionRule: fee.collectionRule,
        allocationMethod: fee.allocationMethod,
        calculationBasis: fee.calculationBasis,
      })),
    };
  }, [formState]);

  return (
    <LoanProductFormContext.Provider
      value={{
        formState,
        updateStep1Data,
        updateStep2Data,
        addFee,
        removeFee,
        clearForm,
        getCombinedFormData,
      }}
    >
      {children}
    </LoanProductFormContext.Provider>
  );
}

export function useLoanProductForm() {
  const context = useContext(LoanProductFormContext);
  if (context === undefined) {
    throw new Error("useLoanProductForm must be used within LoanProductFormProvider");
  }
  return context;
}

