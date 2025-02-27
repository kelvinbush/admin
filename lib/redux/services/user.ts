import { apiSlice } from "./apiSlice";
import { USER } from "@/lib/constants/tags";
import type {
  BusinessDocument,
  BusinessProfile,
  LoanApplication,
  PersonalDocument,
  UserResponse,
} from "@/lib/types/user";

interface UploadDocumentRequest {
  path: string;
  docType: number;
  businessGuid: string;
}

interface UpdateDocumentRequest extends UploadDocumentRequest {
  documentId: string;
}

interface GetPersonalDocumentsRequest {
  personalGuid: string;
}

interface UploadPersonalDocumentRequest {
  path: string;
  docType: number;
  personalGuid: string;
}

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getUser: build.query<UserResponse, { adminguid: string }>({
      query: (credentials) => ({
        url: "/Admin/GetAdminProfile",
        method: "POST",
        body: credentials,
      }),
      providesTags: [{ type: USER, id: "USER-ADMIN" }],
    }),
    getEntrepreneur: build.query<UserResponse, { guid: string }>({
      query: (credentials) => ({
        url: "/PersonalProfile/GetPersonalProfile",
        method: "POST",
        body: credentials,
      }),
      providesTags: [{ type: USER, id: "USER" }],
    }),
    verifyEmail: build.mutation<void, { guid: string; code: string }>({
      query: (credentials) => ({
        url: "/Authentication/VerifyEmail",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: USER, id: "USER" }],
    }),
    verifyPhoneNumber: build.mutation<void, { guid: string; code: string }>({
      query: (credentials) => ({
        url: "/Authentication/VerifyPhone",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: [{ type: USER, id: "USER" }],
    }),
    forgotPassword: build.mutation<void, string>({
      query: (email) => ({
        url: "/Authentication/GetPasswordCode",
        method: "POST",
        body: { email },
      }),
    }),
    getBusinessProfile: build.query<
      { business: BusinessProfile },
      { guid: string }
    >({
      query: (credentials) => ({
        url: "/Authentication/GetBusinessProfile",
        method: "POST",
        body: credentials,
      }),
      providesTags: [{ type: USER, id: "BUSINESS" }],
    }),
    getBusinessProfileByPersonalGuid: build.query<
      { business: BusinessProfile },
      { guid: string }
    >({
      query: (credentials) => ({
        url: "/Business/GetBusinessProfileByPersonalGuid",
        method: "POST",
        body: credentials,
      }),
      providesTags: [{ type: USER, id: "BUSINESS" }],
    }),
    getBusinessDocuments: build.query<
      { documents: BusinessDocument[] },
      { businessGuid: string }
    >({
      query: (credentials) => ({
        url: "/Business/GetBusinessDocuments",
        method: "POST",
        body: credentials,
      }),
      providesTags: [{ type: USER, id: "BUSINESS_DOCUMENTS" }],
    }),
    uploadBusinessDocument: build.mutation<void, UploadDocumentRequest>({
      query: (payload) => ({
        url: "/Business/UploadDocuments",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: USER, id: "BUSINESS_DOCUMENTS" }],
    }),
    updateBusinessDocument: build.mutation<void, UpdateDocumentRequest>({
      query: (payload) => ({
        url: "/Business/UpdateDocument",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: [{ type: USER, id: "BUSINESS_DOCUMENTS" }],
    }),
    getPersonalDocuments: build.query<
      { documents: PersonalDocument[] },
      GetPersonalDocumentsRequest
    >({
      query: (payload) => ({
        url: "/PersonalProfile/GetPersonalDocuments",
        method: "POST",
        body: payload,
      }),
      providesTags: [{ type: USER, id: "PERSONAL_DOCUMENTS" }],
    }),
    uploadPersonalDocument: build.mutation<void, UploadPersonalDocumentRequest>(
      {
        query: (payload) => ({
          url: "/PersonalProfile/UploadPersonalDocuments",
          method: "POST",
          body: payload,
        }),
        invalidatesTags: [{ type: USER, id: "PERSONAL_DOCUMENTS" }],
      },
    ),
    updateBusinessProfile: build.mutation<void, BusinessProfile>({
      query: (data) => ({
        url: "Business/UpdateBusinessProfile",
        method: "PUT",
        body: { ...data },
      }),
      invalidatesTags: [{ type: USER, id: "BUSINESS" }],
    }),
    getLoanApplications: build.query<
      { loanApplications: LoanApplication[] },
      { adminguid: string }
    >({
      query: (credentials) => ({
        url: "/GetAllLoanApplications",
        method: "POST",
        body: credentials,
      }),
      providesTags: [{ type: USER, id: "LOAN_APPLICATIONS" }],
    }),
    getLoanApplication: build.query<
      { loanApplication: LoanApplication },
      { guid: string }
    >({
      query: (credentials) => ({
        url: "/GetLoanApplication",
        method: "POST",
        body: credentials,
      }),
      providesTags: [{ type: USER, id: "LOAN_APPLICATION" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserQuery,
  useGetEntrepreneurQuery,
  useGetBusinessProfileQuery,
  useGetBusinessProfileByPersonalGuidQuery,
  useGetBusinessDocumentsQuery,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useVerifyPhoneNumberMutation,
  useUploadBusinessDocumentMutation,
  useUpdateBusinessDocumentMutation,
  useGetPersonalDocumentsQuery,
  useUploadPersonalDocumentMutation,
  useUpdateBusinessProfileMutation,
  useGetLoanApplicationQuery,
  useGetLoanApplicationsQuery,
} = userApiSlice;
