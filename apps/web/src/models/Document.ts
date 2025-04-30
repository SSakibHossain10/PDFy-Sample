import { documentSchema, IDocument } from "@/schemas/documentSchema";
import mongoose from "mongoose";

const Document = mongoose.models.Document || mongoose.model<IDocument>("Document", documentSchema);

export default Document;
