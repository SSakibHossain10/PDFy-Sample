import Form from "next/form";
import Link from "next/link";
import { Suspense, use } from "react";
import AudiosPanel from "./components/AudiosPanel";
import ImagesPanel from "./components/ImagesPanel";
import MediaLinkInput from "./components/MediaLinkInput";
import MediaUpload from "./components/MediaUploadBtn";
import VideosPanel from "./components/VideosPanel";
import { LoadingAudiosPanel, LoadingImagesPanel, LoadingVideosPanel } from "./loading";

export type TMediaType = "image" | "video" | "audio";

const MediaSlot = ({ searchParams }: { searchParams: Promise<{ mediaType?: TMediaType }> }) => {
  const mediaType = use(searchParams).mediaType || "image";

  return (
    <div
      className="w-full h-full bg-gr-multi-dark pb-0 flex flex-col sx:rounded-t-xl sm:rounded-r-xl overflow-auto"
      id="media-slot"
    >
      <div className="sm:hidden pt-1.5 flex justify-center">
        <span className="h-1 w-10 rounded-full bg-primary-200/50" />
      </div>

      <div className="shrink-0 mx-3 sm:mx-1 mt-2.5 sm:mt-4 mb-3 sm:mb-4 bg-primary-50/20 h-10 sm:h-9 grid grid-cols-2 sm:grid-cols-5 items-stretch rounded-full">
        <MediaUpload />

        <Form action="" className="flex sm:col-span-3">
          <MediaLinkInput />
        </Form>
      </div>

      <div className="grow overflow-y-auto bg-primary-50/10 flex flex-col rounded-t-xl sm:rounded-t-2xl">
        <div className="bg-primary-50/5 grid grid-cols-3 rounded-full sm:mx-1">
          <Link
            prefetch
            href={{
              query: {
                mediaType: "image",
              },
            }}
            data-active={mediaType === "image"}
            className="text-center text-sm font-medium p-1 rounded-full data-[active=true]:bg-primary-50/10"
          >
            Image
          </Link>
          <Link
            prefetch
            href={{
              query: {
                mediaType: "video",
              },
            }}
            data-active={mediaType === "video"}
            className="text-center text-sm font-medium p-1 rounded-full data-[active=true]:bg-primary-50/10"
          >
            Video
          </Link>
          <Link
            prefetch
            href={{
              query: {
                mediaType: "audio",
              },
            }}
            data-active={mediaType === "audio"}
            className="text-center text-sm font-medium p-1 rounded-full data-[active=true]:bg-primary-50/10"
          >
            Audio
          </Link>
        </div>

        <Suspense fallback={<LoadingImagesPanel mediaType={mediaType} />}>
          <ImagesPanel mediaType={mediaType} />
        </Suspense>

        <Suspense fallback={<LoadingVideosPanel mediaType={mediaType} />}>
          <VideosPanel mediaType={mediaType} />
        </Suspense>

        <Suspense fallback={<LoadingAudiosPanel mediaType={mediaType} />}>
          <AudiosPanel mediaType={mediaType} />
        </Suspense>
      </div>
    </div>
  );
};

export default MediaSlot;
