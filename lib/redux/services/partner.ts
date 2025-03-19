import { apiSlice } from "./apiSlice";
import { PARTNER } from "@/lib/constants/tags";
import type {
  Partner,
  CreatePartnerRequest,
  UpdatePartnerRequest,
} from "@/lib/types/partner";

export const partnerApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    createPartner: build.mutation<void, CreatePartnerRequest>({
      query: (payload) => ({
        url: "/Admin/CreatePartner",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: PARTNER, id: "LIST" }],
    }),
    getAllPartners: build.query<Partner[], string>({
      query: (adminguid) => ({
        url: "/Admin/GetAllPartners",
        method: "POST",
        body: { adminguid },
      }),
      transformResponse: (response) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        response?.partners,
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
});

export const {
  useCreatePartnerMutation,
  useGetAllPartnersQuery,
  useUpdatePartnerMutation,
} = partnerApiSlice;
