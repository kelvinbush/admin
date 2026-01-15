"use client";

import { useParams } from "next/navigation";
import { useLoanDocuments } from "@/lib/api/hooks/loan-applications";

export default function LoanDocumentsPage() {
  const params = useParams();
  const applicationId = params.id as string;

  const { data, isLoading, isError } = useLoanDocuments(applicationId);

  if (isLoading) {
    return <div className="text-sm text-primaryGrey-500">Loading loan documents...</div>;
  }

  if (isError) {
    return <div className="text-sm text-red-500">Failed to load loan documents.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-midnight-blue">Term Sheet</h2>
        {data?.termSheetUrl ? (
          <a
            href={data.termSheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-green underline"
          >
            View term sheet
          </a>
        ) : (
          <p className="text-sm text-primaryGrey-400">No term sheet available.</p>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-medium text-midnight-blue">Loan Documents</h2>

        {data?.documents?.length ? (
          <div className="rounded-md border border-primaryGrey-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-[#E8E9EA] border-b border-[#B6BABC]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                    Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                    Uploaded By
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                    Uploaded At
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-midnight-blue">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primaryGrey-100">
                {data.documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-primaryGrey-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-midnight-blue">{doc.documentType}</td>
                    <td className="px-6 py-4 text-sm text-midnight-blue">{doc.docName || "-"}</td>
                    <td className="px-6 py-4 text-sm text-primaryGrey-500">{doc.uploadedBy}</td>
                    <td className="px-6 py-4 text-sm text-primaryGrey-500">{doc.createdAt}</td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={doc.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-green underline"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-primaryGrey-400">No loan documents uploaded.</p>
        )}
      </div>
    </div>
  );
}
