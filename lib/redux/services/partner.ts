import { apiSlice } from "./apiSlice";
import { PARTNER } from "@/lib/constants/tags";
import type {
  CreatePartnerRequest,
  DeletePartnerRequest,
  Partner,
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
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ companyReference }) => ({
                type: PARTNER,
                id: companyReference,
              })),
              { type: PARTNER, id: "LIST" },
            ]
          : [{ type: PARTNER, id: "LIST" }],
    }),
    updatePartner: build.mutation<void, UpdatePartnerRequest>({
      query: (payload) => ({
        url: "/Admin/UpdatePartner",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (_result, _error, arg) => [
        { type: PARTNER, id: arg.companyReference },
      ],
    }),
    deletePartner: build.mutation<void, DeletePartnerRequest>({
      query: (payload) => ({
        url: "/Admin/DeletePartner",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: [{ type: PARTNER, id: "LIST" }],
    }),
  }),
});

export const {
  useCreatePartnerMutation,
  useGetAllPartnersQuery,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
} = partnerApiSlice;
