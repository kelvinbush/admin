import { apiSlice } from "./apiSlice";
import { LOAN_PRODUCT } from "@/lib/constants/tags";
import type {
  LoanProduct,
  CreateLoanProductRequest,
  GetAllLoanProductsResponse,
  DeleteLoanProductRequest,
  UpdateLoanProductStatusRequest,
  GetLoanProductByIdRequest,
  UpdateLoanProductRequest,
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
    deleteLoanProduct: build.mutation<void, DeleteLoanProductRequest>({
      query: (payload) => ({
        url: "/Admin/DeleteLoanProduct",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: LOAN_PRODUCT, id: productId.toString() },
        { type: LOAN_PRODUCT, id: "LIST" },
      ],
    }),
    updateLoanProductStatus: build.mutation<void, UpdateLoanProductStatusRequest>({
      query: (payload) => ({
        url: "/Admin/UpdateLoanProductStatus",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: LOAN_PRODUCT, id: productId.toString() },
        { type: LOAN_PRODUCT, id: "LIST" },
      ],
    }),
    getLoanProductById: build.query<LoanProduct, GetLoanProductByIdRequest>({
      query: ({ productId, guid }) => ({
        url: "/Admin/GetLoanProductById",
        method: "POST",
        body: { productId, adminguid: guid },
      }),
      providesTags: (result, _, { productId }) => [
        { type: LOAN_PRODUCT, id: productId },
      ],
    }),
    updateLoanProduct: build.mutation<void, UpdateLoanProductRequest>({
      query: (payload) => ({
        url: "/Admin/UpdateLoanProduct",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_, __, { productId }) => [
        { type: LOAN_PRODUCT, id: productId.toString() },
        { type: LOAN_PRODUCT, id: "LIST" },
      ],
    }),
  }),
});

export const { 
  useCreateLoanProductMutation, 
  useGetAllLoanProductsQuery,
  useDeleteLoanProductMutation,
  useUpdateLoanProductStatusMutation,
  useGetLoanProductByIdQuery,
  useUpdateLoanProductMutation,
} = loanProductApiSlice;
