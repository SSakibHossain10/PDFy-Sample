"use client";
import { TUser } from "@/schemas/userSchema";

const ProfileNameField = ({ user }: { user: TUser }) => {
  return (
    <>
      <input
        name="first_name"
        placeholder="First Name"
        defaultValue={user.first_name}
        required
        className="text-xl font-bold min-w-5 field-sizing-content"
        onBlur={(e) => e.target.form?.requestSubmit()}
      />
      <input
        name="last_name"
        placeholder="Last Name"
        defaultValue={user.last_name}
        className="text-xl font-bold min-w-5 field-sizing-content"
        onBlur={(e) => e.target.form?.requestSubmit()}
      />
    </>
  );
};

export default ProfileNameField;
