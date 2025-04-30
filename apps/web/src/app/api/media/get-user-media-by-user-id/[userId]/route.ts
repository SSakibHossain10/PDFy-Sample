export const dynamic = "force-dynamic";

import connectDB from "@/lib/connectDB";
import Media from "@/models/Media";
import { NextRequest } from "next/server";

export async function GET(_request: NextRequest, context: { params: Promise<{ userId: string }> }) {
  try {
    await connectDB(); // Ensure the database connection is established

    const userId = (await context.params).userId;
    const medias = await Media.find({ created_by: userId }).sort({ created_at: -1 });

    return Response.json(medias);
  } catch (error) {
    console.error("Error fetching media:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
