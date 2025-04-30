"use client";

import userSignOut from "@/server-actions/user_signout";
import clientNotification from "@/utils/clientNotification";
import { useFormStatus } from "react-dom";
import { LiaSpinnerSolid } from "react-icons/lia";
import { PiSignInDuotone } from "react-icons/pi";

const SignOutBtn = () => {
  const { pending } = useFormStatus();
  return (
    <button
      formAction={() => userSignOut().then(clientNotification)}
      disabled={pending}
      className="bg-primary-50/10 w-full px-10 py-2 flex items-center justify-center gap-2 text-sm rounded-full disabled:animate-pulse"
    >
      {pending ? <LiaSpinnerSolid className="size-5 animate-spin" /> : <PiSignInDuotone className="size-5" />}
      {pending ? "Signing Out" : "Sign Out"}
    </button>
  );
};

export default SignOutBtn;
