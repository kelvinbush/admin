import { apiSlice } from "./apiSlice";
import { LOAN_PRODUCT } from "@/lib/constants/tags";
import type {
  LoanProduct,
  CreateLoanProductRequest,
  GetAllLoanProductsResponse,
} from "@/lib/types/loan-product";

export const loanProductApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createLoanProduct: build.mutation<void, CreateLoanProductRequest>({
      query: (payload) => ({
        url: "/Admin/CreateLoanProduct",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: LOAN_PRODUCT, id: "LIST" }],
    }),
    getAllLoanProducts: build.query<LoanProduct[], string>({
      query: (adminguid) => ({
        url: "/Admin/GetAllLoanProducts",
        method: "POST",
        body: { adminguid },
      }),
      transformResponse: (response: GetAllLoanProductsResponse) =>
        response?.loanProductList || [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({
                type: LOAN_PRODUCT,
                id: id.toString(),
              })),
              { type: LOAN_PRODUCT, id: "LIST" },
            ]
          : [{ type: LOAN_PRODUCT, id: "LIST" }],
    }),
  }),
});

export const { useCreateLoanProductMutation, useGetAllLoanProductsQuery } =
  loanProductApiSlice;
