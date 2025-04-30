import revalidate_tags from "@/constants/revalidate_tags";
import { api_get_user_media_by_user_id } from "@/constants/urls";
import { TMedia, TMediaIMG } from "@/schemas/mediaSchema";
import { getUserId } from "@/utils/get_data_server";
import { TMediaType } from "../page";
import ImageCardWraper from "./ImageCardWraper";

const ImagesPanel = async ({ mediaType }: { mediaType: TMediaType }) => {
  const mediaImages = (
    (await fetch(`${api_get_user_media_by_user_id}/${await getUserId()}`, {
      cache: "force-cache",
      next: { tags: [`${revalidate_tags.get_user_media_all_}${await getUserId()}`] },
    }).then((data) => data.json())) as TMedia[]
  ).filter(({ type }) => type === "IMAGE") as TMediaIMG[];

  return (
    <div
      data-active={mediaType === "image"}
      className={`grow hidden data-[active=true]:flex flex-wrap items-center gap-3 p-3 overflow-y-auto ${
        mediaImages.length === 0 ? "content-center" : "content-start"
      }`}
    >
      {mediaImages.length === 0 ? (
        <p className="grow h-20 flex items-center justify-center text-center text-sm">No image uploaded yet</p>
      ) : null}
      {mediaImages.map((image) => (
        <ImageCardWraper image={image} key={image._id}>
          <img
            loading="lazy"
            src={image.src_url}
            alt={image.name}
            className="h-36 w-auto rounded-lg bg-primary-100/10"
            style={{ aspectRatio: `${image.width}/${image.height}` }}
          />
        </ImageCardWraper>
      ))}
    </div>
  );
};

export default ImagesPanel;
