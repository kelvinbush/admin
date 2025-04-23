import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SupportedCurrency } from '@/lib/types/loan-product';

export interface LoanProductFormState {
  activeStep: number;
  formData: {
    // Step 1: Basic loan details and terms
    loanName: string;
    loanCode: string;
    loanProvider: string;
    loanType: string;
    disbursementMethod: string;
    loanVisibility: string;
    availabilityWindow?: Date;
    loanDescription: string;
    processingMethod: string;
    
    // Loan terms & conditions (part of step 1)
    creditLimitDuration: string;
    creditLimitPeriod: string;
    minimumLoanDuration: string;
    minimumLoanPeriod: string;
    maximumLoanDuration: string;
    maximumLoanPeriod: string;
    minimumLoanAmount: string;
    maximumLoanAmount: string;
    currency: SupportedCurrency;
    interestRate: string;
    
    // Step 2: Additional settings
    // Will be added as needed
    
    // Step 3: Final review
    // Will be added as needed
  };
}

const initialState: LoanProductFormState = {
  activeStep: 1,
  formData: {
    loanName: '',
    loanCode: '',
    loanProvider: 'MK Foundation',
    loanType: '',
    disbursementMethod: '',
    loanVisibility: '',
    availabilityWindow: undefined,
    loanDescription: '',
    processingMethod: '',
    
    creditLimitDuration: '',
    creditLimitPeriod: 'days',
    minimumLoanDuration: '',
    minimumLoanPeriod: 'days',
    maximumLoanDuration: '',
    maximumLoanPeriod: 'days',
    minimumLoanAmount: '',
    maximumLoanAmount: '',
    currency: 'USD',
    interestRate: '',
  },
};

export const loanProductFormSlice = createSlice({
  name: 'loanProductForm',
  initialState,
  reducers: {
    setActiveStep: (state, action: PayloadAction<number>) => {
      state.activeStep = action.payload;
    },
    nextStep: (state) => {
      if (state.activeStep < 3) {
        state.activeStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.activeStep > 1) {
        state.activeStep -= 1;
      }
    },
    updateFormData: (state, action: PayloadAction<Partial<LoanProductFormState['formData']>>) => {
      state.formData = { ...state.formData, ...action.payload };
    },
    resetForm: (state) => {
      state.activeStep = 1;
      state.formData = initialState.formData;
    },
  },
});

export const { setActiveStep, nextStep, prevStep, updateFormData, resetForm } = loanProductFormSlice.actions;

export default loanProductFormSlice.reducer;
