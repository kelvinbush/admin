import { apiSlice } from "./apiSlice";
import { PARTNER } from "@/lib/constants/tags";

export interface CreatePartnerRequest {
  adminguid: string;
  companyname: string;
}

export interface UpdatePartnerRequest {
  companyName: string;
  companyReference: string;
  adminReference: string;
}

export interface Partner {
  companyName: string;
  companyReference: string;
}

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createPartner: build.mutation<void, CreatePartnerRequest>({
      query: (payload) => ({
        url: "/Admin/CreatePartner",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: PARTNER, id: "PARTNER" }],
    }),
    getAllPartners: build.query<Partner[], string>({
      query: (adminguid) => ({
        url: "/Admin/GetAllPartners",
        method: "POST",
        body: { adminguid },
      }),
      providesTags: [{ type: PARTNER, id: "LIST" }],
    }),
    updatePartner: build.mutation<void, UpdatePartnerRequest>({
      query: (payload) => ({
        url: "/Admin/UpdatePartner",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: PARTNER, id: "PARTNER" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreatePartnerMutation,
  useGetAllPartnersQuery,
  useUpdatePartnerMutation,
} = userApiSlice;
