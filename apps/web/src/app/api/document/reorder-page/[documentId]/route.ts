export const dynamic = "force-dynamic";

import revalidate_tags from "@/constants/revalidate_tags";
import connectDB from "@/lib/connectDB";
import Document from "@/models/Document";
import { getUserId } from "@/utils/get_data_server";
import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest, context: { params: Promise<{ documentId: string }> }) {
  try {
    const { documentId } = await context.params;
    const { draggedIndex, dropIndex } = (await request.json()) as {
      draggedIndex: number;
      dropIndex: number;
    };

    const userId = await getUserId();

    connectDB();

    const targetDocument = await Document.findById(documentId);

    if (!targetDocument) {
      throw Response.json({
        message: "Document not found",
      });
    }
    if (targetDocument.created_by.toString() !== userId) {
      throw Response.json({
        message: "You are not authorized to perform this action",
      });
    }

    const draggedPage = targetDocument.pages[draggedIndex];

    const updatedPages = targetDocument.pages;

    updatedPages.splice(draggedIndex, 1); // remove from drag
    updatedPages.splice(dropIndex - (draggedIndex < dropIndex ? 1 : 0), 0, draggedPage); // add to drop

    await targetDocument.save();

    revalidateTag(`${revalidate_tags.get_document_by_id_}${documentId}`);
    revalidateTag(`${revalidate_tags.get_user_documents_}${userId}`);

    return Response.json({
      message: "Pages re-ordered successfully",
    });
  } catch (error) {
    console.log("Error reordering pages:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
