import { LoadingRecentDocuments } from "@/components/loadings";
import UserFirstName from "@/components/UserFirstName";
import revalidate_tags from "@/constants/revalidate_tags";
import { api_get_user_data } from "@/constants/urls";
import { TUser } from "@/schemas/userSchema";
import { getUserId } from "@/utils/get_data_server";
import Form from "next/form";
import { Suspense } from "react";
import RecentDocumentsCard from "../dashboard/components/RecentDocumentsCard";
import AccountProfile from "./components/profile/AccountProfile";
import DeleteMyAccountBtn from "./DeleteMyAccountBtn";
import SignOutBtn from "./SignOutBtn";

const AccountPage = async () => {
  const user: TUser = await fetch(`${api_get_user_data}/${await getUserId()}`, {
    cache: "force-cache",
    next: { tags: [`${revalidate_tags.get_user_data_}${await getUserId()}`] },
  }).then((data) => data.json());

  console.log("user", user);

  return (
    <div className="grow flex flex-col gap-8 pb-5 overflow-y-auto" id="account-page">
      <div className="shrink-0 bg-primary-50/10 h-40 flex flex-col gap-2 justify-center items-center rounded-b-lg w-full max-w-5xl mx-auto">
        <h4 className="text-center">
          Hi{" "}
          <Suspense fallback={<span className="-ml-1" />}>
            <UserFirstName />
          </Suspense>
          !
        </h4>
        <h5 className="text-primary-400 text-center">Welcome to your account page</h5>
      </div>

      <AccountProfile user={user} />

      <div className="flex flex-col w-full max-w-5xl mx-auto">
        <Suspense fallback={<LoadingRecentDocuments />}>
          <RecentDocumentsCard />
        </Suspense>
      </div>

      <span className="grow" />

      <Form action="" className="flex items-end px-4 w-full max-w-5xl mx-auto">
        <SignOutBtn />
      </Form>

      <Form action="" className="flex items-end px-4 w-full max-w-5xl mx-auto">
        <DeleteMyAccountBtn />
      </Form>
    </div>
  );
};

export default AccountPage;
