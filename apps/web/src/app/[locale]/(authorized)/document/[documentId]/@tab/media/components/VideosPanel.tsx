import revalidate_tags from "@/constants/revalidate_tags";
import { api_get_user_media_by_user_id } from "@/constants/urls";
import { TMedia, TMediaVID } from "@/schemas/mediaSchema";
import { getUserId } from "@/utils/get_data_server";
import { TMediaType } from "../page";
import VideoCardWraper from "./VideoCardWraper";

const VideosPanel = async ({ mediaType }: { mediaType: TMediaType }) => {
  const mediaVideos = (
    (await fetch(`${api_get_user_media_by_user_id}/${await getUserId()}`, {
      cache: "force-cache",
      next: { tags: [`${revalidate_tags.get_user_media_all_}${await getUserId()}`] },
    }).then((data) => data.json())) as TMedia[]
  ).filter(({ type }) => type === "VIDEO") as TMediaVID[];

  return (
    <div
      data-active={mediaType === "video"}
      className={`grow hidden data-[active=true]:grid grid-cols-2 items-center gap-3 p-3 overflow-y-auto ${
        mediaVideos.length === 0 ? "content-center" : "content-start"
      }`}
    >
      {mediaVideos.length === 0 ? (
        <p className="col-span-2 h-20 flex items-center justify-center text-center text-sm">No video uploaded yet</p>
      ) : null}
      {mediaVideos.map((video) => (
        <VideoCardWraper video={video} key={video._id}>
          <video src={video.src_url} className="h-full w-full rounded-lg" />
        </VideoCardWraper>
      ))}
    </div>
  );
};

export default VideosPanel;
