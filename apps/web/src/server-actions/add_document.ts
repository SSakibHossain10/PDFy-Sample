"use server";

import revalidate_tags from "@/constants/revalidate_tags";
import connectDB from "@/lib/connectDB";
import Document from "@/models/Document";
import { IDocument } from "@/schemas/documentSchema";
import { getUserId } from "@/utils/get_data_server";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export default async function addDocument(payload: IDocument) {
  let newDocument;
  try {
    connectDB();

    const userId = await getUserId();
    if (!userId) {
      throw new Error("User not found");
    }

    payload.created_by = userId;

    //create document
    newDocument = new Document(payload);
    await newDocument.save();

    console.log("newDocument", newDocument._id.toString());

    revalidateTag(`${revalidate_tags.get_user_documents_}${userId}`);
  } catch (error) {
    console.log("Error adding document:", error);
    return {
      status: "error",
      message: "Error adding document",
      description: "Please try again later.",
    };
  }

  redirect(`/document/${newDocument._id.toString()}/edit`);
}
