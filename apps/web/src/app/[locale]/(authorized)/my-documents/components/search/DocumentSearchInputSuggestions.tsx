import { IGetUserDocumentsResponse } from "@/app/api/document/get-user-documents/[userId]/route";
import revalidate_tags from "@/constants/revalidate_tags";
import { api_user_documents } from "@/constants/urls";
import { getUserId } from "@/utils/get_data_server";

const DocumentSearchInputSuggestions = async () => {
  const documents = (await fetch(`${api_user_documents}/${await getUserId()}`, {
    cache: "force-cache",
    next: { tags: [`${revalidate_tags.get_user_documents_}${await getUserId()}`] },
  }).then((data) => data.json())) as IGetUserDocumentsResponse[];

  return (
    <datalist id="document-search-suggestions">
      {documents.map((document) => (
        <option key={document._id} value={document.name} />
      ))}
    </datalist>
  );
};

export default DocumentSearchInputSuggestions;
