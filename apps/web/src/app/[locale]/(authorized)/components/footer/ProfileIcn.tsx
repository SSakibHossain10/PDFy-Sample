import { DEFAULT_AVATAR } from "@/constants";
import revalidate_tags from "@/constants/revalidate_tags";
import { api_get_user_data } from "@/constants/urls";
import { TUser } from "@/schemas/userSchema";
import { getUserId } from "@/utils/get_data_server";

const ProfileIcn = async () => {
  const user: TUser = await fetch(`${api_get_user_data}/${await getUserId()}`, {
    cache: "force-cache",
    next: { tags: [`${revalidate_tags.get_user_data_}${await getUserId()}`] },
  }).then((data) => data.json());

  return (
    <img
      loading="lazy" //lazy used for case it is hidden (header hidden)
      src={user.avatar || DEFAULT_AVATAR}
      alt="Profile Icon"
      width={20}
      height={20}
      className="rounded-full"
    />
  );
};

export default ProfileIcn;
