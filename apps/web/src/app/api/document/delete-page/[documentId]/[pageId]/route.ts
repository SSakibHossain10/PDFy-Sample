export const dynamic = "force-dynamic";

import revalidate_tags from "@/constants/revalidate_tags";
import connectDB from "@/lib/connectDB";
import Document from "@/models/Document";
import { IDocumentPage } from "@/schemas/documentSchema";
import { getUserId } from "@/utils/get_data_server";
import { deleteS3Folder } from "@/utils/s3_helpers";
import { revalidateTag } from "next/cache";
import { after, NextRequest } from "next/server";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ documentId: string; pageId: string }> }
) {
  try {
    const { documentId, pageId } = await context.params;

    const userId = await getUserId();

    connectDB();

    const targetDocument = await Document.findById(documentId);

    if (!targetDocument) {
      return Response.json({
        type: "error",
        title: "Document not found",
        description: "Please try again later.",
      });
    }
    if (targetDocument.created_by.toString() !== userId) {
      return Response.json({
        type: "error",
        title: "Unauthorized",
        description: "You are not authorized to perform this action",
      });
    }
    if (targetDocument.pages.length === 1) {
      return Response.json({
        type: "error",
        title: "Cannot delete the last page",
        description: "You cannot delete the last page of the document.",
      });
    }

    const targetPage = targetDocument.pages.find((page: IDocumentPage) => page._id.toString() === pageId.toString());

    targetDocument.pages.pull(pageId) as IDocumentPage; // remove the page from the document
    await targetDocument.save();

    revalidateTag(`${revalidate_tags.get_document_by_id_}${documentId}`);
    revalidateTag(`${revalidate_tags.get_user_documents_}${userId}`);

    after(async () => {
      if (!targetPage) return;

      // delete page page assets from s3
      await deleteS3Folder(`user-assets/${userId}/documents/${documentId}/${pageId}/`);
    });

    return Response.json({
      type: "success",
      title: "Page deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting page:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
