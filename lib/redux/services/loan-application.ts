import { apiSlice } from "./apiSlice";
import { LOAN_APPLICATION } from "@/lib/constants/tags";

export interface UpdateLoanApplicationRequest {
  loanStatus: number;
  loanApplicationReference: string;
  adminReference: string;
}

export const loanApplicationApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    updateNormalLoanApplication: build.mutation<void, UpdateLoanApplicationRequest>({
      query: (payload) => ({
        url: "/Admin/UpdateNormalLoanApplications",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_, __, { loanApplicationReference }) => [
        { type: LOAN_APPLICATION, id: loanApplicationReference },
        { type: LOAN_APPLICATION, id: "LIST" },
      ],
    }),
  }),
});

export const { 
  useUpdateNormalLoanApplicationMutation,
} = loanApplicationApiSlice;
