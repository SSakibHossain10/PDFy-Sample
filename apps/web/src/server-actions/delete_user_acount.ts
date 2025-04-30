"use server";

import connectDB from "@/lib/connectDB";
import Document from "@/models/Document";
import Media from "@/models/Media";
import User from "@/models/User";
import { TClientNotificationOptions } from "@/utils/clientNotification";
import { getUserId } from "@/utils/get_data_server";
import { deleteS3Folder } from "@/utils/s3_helpers";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { after } from "next/server";

export default async function deleteUserAccount(): Promise<TClientNotificationOptions> {
  try {
    const userId = await getUserId();

    const cookieStore = await cookies();

    cookieStore.delete("auth-token");
    cookieStore.delete("user_id");

    connectDB();

    after(async () => {
      await Promise.all([
        // Delete all user assets from s3
        deleteS3Folder(`user-assets/${userId || "not-delete"}/`),
        // Delete user from database
        User.findByIdAndDelete(userId),
        // Delete all user documents from database
        Document.deleteMany({ created_by: userId }),
        // Delete all user media from database
        Media.deleteMany({ created_by: userId }),
        //TODO: delete all others user data if have any
      ]);
    });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return {
      type: "error",
      title: "Error deleting user account",
      description: "Please try again later.",
    };
  }

  redirect("/");
}
