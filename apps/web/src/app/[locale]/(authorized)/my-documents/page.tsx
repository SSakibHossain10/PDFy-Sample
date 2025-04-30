/* eslint-disable react/no-unescaped-entities */
import { IGetUserDocumentsResponse } from "@/app/api/document/get-user-documents/[userId]/route";
import UserFirstName from "@/components/UserFirstName";
import revalidate_tags from "@/constants/revalidate_tags";
import { api_user_documents } from "@/constants/urls";
import { getUserId } from "@/utils/get_data_server";
import Form from "next/form";
import { Suspense } from "react";
import DocumentCard from "./components/document-card/DocumentCard";
import DocumentSearchInput from "./components/search/DocumentSearchInput";
import DocumentSearchInputSuggestions from "./components/search/DocumentSearchInputSuggestions";
import "./styles/my_documents_styles.css";

export type TMyDocumentsPageSearchParams = Promise<{ searchQuery?: string }>;

const MyDocumentsPage = async ({ searchParams }: { searchParams: TMyDocumentsPageSearchParams }) => {
  const userDocuments = (await fetch(`${api_user_documents}/${await getUserId()}`, {
    cache: "force-cache",
    next: { tags: [`${revalidate_tags.get_user_documents_}${await getUserId()}`] },
  }).then((data) => data.json())) as IGetUserDocumentsResponse[];

  const searchQuery = (await searchParams).searchQuery;

  const searhedUserDocuments = userDocuments.filter((document) =>
    document.name.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  );

  return (
    <main className="grow flex flex-col gap-8 overflow-y-auto" id="my-documents-page">
      <div className="shrink-0 bg-primary-50/10 h-40 flex flex-col gap-2 justify-center items-center rounded-b-lg w-full max-w-5xl mx-auto">
        <h4 className="text-center">
          Hi{" "}
          <Suspense fallback={<span className="-ml-1" />}>
            <UserFirstName />
          </Suspense>
          !
        </h4>
        <h5 className="text-primary-400 text-center">Welcome to your PDFs</h5>
      </div>

      <Form action="" className="z-10 flex sticky top-2 w-full max-w-5xl mx-auto">
        <DocumentSearchInput searchQuery={searchQuery} />

        <Suspense fallback={null}>
          <DocumentSearchInputSuggestions />
        </Suspense>
      </Form>

      <div
        className={`grow bg-primary-50/5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 p-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 sm:p-4 ${searhedUserDocuments.length === 0 ? "content-center" : "content-start"} rounded w-full max-w-5xl mx-auto`}
      >
        {searhedUserDocuments.map((document) => (
          <DocumentCard key={document._id} document={document} display="independent" />
        ))}

        {searhedUserDocuments.length === 0 && (
          <h5 className="col-span-4 text-center">
            {searchQuery ? (
              <>
                No pdf found for "<strong>{searchQuery}</strong>
              </>
            ) : (
              <>You didn't create any pdf yet!</>
            )}
          </h5>
        )}
      </div>
    </main>
  );
};

export default MyDocumentsPage;
