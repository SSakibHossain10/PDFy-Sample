"use client";

import { DEFAULT_AVATAR } from "@/constants";
import { TUser } from "@/schemas/userSchema";
import updateUserProfile from "@/server-actions/update_user_profile";
import clientNotification from "@/utils/clientNotification";
import Form from "next/form";
import ChangProfilePhoto from "./ChangProfilePhoto/ChangProfilePhoto";
import ProfileNameField from "./ProfileNameField";

function AccountProfile({ user }: { user: TUser }) {
  return (
    <div className="bg-primary-50/10 px-4 py-8 flex flex-col items-center gap-4 rounded-lg w-full max-w-5xl mx-auto">
      <div className="flex flex-col items-center gap-3 mb-2">
        <img
          decoding="async"
          src={user.avatar || DEFAULT_AVATAR}
          alt="Profile"
          width={100}
          height={100}
          className="rounded-full"
        />
        <ChangProfilePhoto />
      </div>

      <Form action={(e) => updateUserProfile(e).then((res) => res && clientNotification(res))} className="flex gap-2">
        <ProfileNameField user={user} />
      </Form>

      <h5>{user.email}</h5>
    </div>
  );
}

export default AccountProfile;
