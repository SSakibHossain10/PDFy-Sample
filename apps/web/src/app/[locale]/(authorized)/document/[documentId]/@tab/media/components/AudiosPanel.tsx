import revalidate_tags from "@/constants/revalidate_tags";
import { api_get_user_media_by_user_id } from "@/constants/urls";
import { TMedia, TMediaAUD } from "@/schemas/mediaSchema";
import { getUserId } from "@/utils/get_data_server";
import { MdOutlineAudiotrack } from "react-icons/md";
import { TMediaType } from "../page";
import AudioCardWraper from "./AudioCardWraper";

const AudiosPanel = async ({ mediaType }: { mediaType: TMediaType }) => {
  const mediaAudios = (
    (await fetch(`${api_get_user_media_by_user_id}/${await getUserId()}`, {
      cache: "force-cache",
      next: { tags: [`${revalidate_tags.get_user_media_all_}${await getUserId()}`] },
    }).then((data) => data.json())) as TMedia[]
  ).filter(({ type }) => type === "AUDIO") as TMediaAUD[];

  return (
    <div
      data-active={mediaType === "audio"}
      className="grow hidden data-[active=true]:flex flex-col items-center gap-3 p-3 overflow-y-auto"
    >
      {mediaAudios.length === 0 ? (
        <p className="grow h-20 flex items-center justify-center text-center text-sm">No audio uploaded yet</p>
      ) : null}
      {mediaAudios.map((audio) => (
        <AudioCardWraper audio={audio} key={audio._id}>
          <div className="p-1.5 bg-primary-50/5 rounded-xl">
            <MdOutlineAudiotrack className="size-7" />
          </div>
          <p>{audio.name}</p>
        </AudioCardWraper>
      ))}
    </div>
  );
};

export default AudiosPanel;
