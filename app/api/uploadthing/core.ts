import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Define file routes for your app
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 5 } })
    .middleware(async () => {
      // Add auth/metadata if needed
      return { type: "image" } as const;
    })
    .onUploadComplete(async ({ file }) => {
      // Server-side after upload
      return { url: file.url };
    }),

  documentUploader: f({ pdf: { maxFileSize: "8MB", maxFileCount: 5 } })
    .middleware(async () => {
      return { type: "pdf" } as const;
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
