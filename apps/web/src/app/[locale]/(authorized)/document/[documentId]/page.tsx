import revalidate_tags from "@/constants/revalidate_tags";
import { api_document_by_id } from "@/constants/urls";
import { IDocument } from "@/schemas/documentSchema";
import DocumentPagesContainer from "./components/DocumentPagesContainer";
import DocumentManagerInitializer from "./documentManager";

export const dynamic = "force-dynamic";

export type IDocumentPageParams = Promise<{ documentId: string }>;
// export type IDocumentPageSearchParams = Promise<{ searchQuery: string }>;

const DocumentPage = async ({ params }: { params: IDocumentPageParams }) => {
  const document: IDocument = await fetch(`${api_document_by_id}/${(await params).documentId}`, {
    cache: "force-cache",
    next: { tags: [`${revalidate_tags.get_document_by_id_}${(await params).documentId}`] },
  }).then((data) => data.json());

  return (
    <>
      <DocumentManagerInitializer />
      <DocumentPagesContainer document={document} />
    </>
  );
};

export default DocumentPage;
