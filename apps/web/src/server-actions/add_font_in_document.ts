"use server";

import revalidate_tags from "@/constants/revalidate_tags";
import connectDB from "@/lib/connectDB";
import Document from "@/models/Document";
import { IDocument, TDocumentFont } from "@/schemas/documentSchema";
import { TGoogleFont } from "@/schemas/fontSchema";
import { revalidateTag } from "next/cache";

export default async function addfontInDocument(documentId: IDocument["_id"], font: TGoogleFont | TDocumentFont) {
  try {
    connectDB();

    const targetedDocument = await Document.findById(documentId);

    if (!targetedDocument) {
      return { status: "failed", message: "Document not found" };
    }
    if (targetedDocument.fonts.find((f: { font_id: string }) => `${f.font_id}` === `${font._id}`))
      return { status: "failed", message: "Font already added in document" };

    await targetedDocument.fonts.push({ font_id: font._id, type: "GOOGLE" });

    await targetedDocument.save();

    revalidateTag(`${revalidate_tags.get_document_fonts_}${documentId}`);

    return {
      status: "success",
      message: "Desisn font added successfully",
    };
  } catch (error) {
    console.log("Error adding font in document:", error);
    return {
      status: "error",
      message: "Error adding font in document",
      description: "Please try again later.",
    };
  }
}
