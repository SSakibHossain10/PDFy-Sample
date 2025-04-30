"use server";

import revalidate_tags from "@/constants/revalidate_tags";
import connectDB from "@/lib/connectDB";
import Document from "@/models/Document";
import { TClientNotificationOptions } from "@/utils/clientNotification";
import { getUserId } from "@/utils/get_data_server";
import { deleteS3Folder } from "@/utils/s3_helpers";
import { revalidateTag } from "next/cache";
import { after } from "next/server";

export default async function deleteDocument(formData: FormData): Promise<TClientNotificationOptions> {
  try {
    connectDB();

    const userId = await getUserId();

    if (!userId) {
      return {
        type: "error",
        title: "User not found",
        description: "Please try again later.",
      };
    }

    const documentId = formData.get("documentId");

    await Document.findByIdAndDelete(documentId);

    revalidateTag(`${revalidate_tags.get_user_documents_}${userId}`);

    after(async () => {
      await deleteS3Folder(`user-assets/${userId}/documents/${documentId}/`);
    });

    return {
      type: "success",
      title: "Document deleted",
      description: "Your document has been deleted successfully.",
    };
  } catch (error) {
    console.error("Error deleting document:", error);
    return {
      type: "error",
      title: "Error deleting document",
      description: "Please try again later.",
    };
  }
}
