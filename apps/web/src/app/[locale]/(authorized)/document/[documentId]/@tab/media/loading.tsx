import Loading from "@/app/[locale]/loading";
import { MdOutlineAudiotrack } from "react-icons/md";
import { TMediaType } from "./page";

const LoadingMediaSlot = () => (
  <div className="w-full h-full bg-gr-multi-dark sx:rounded-t-xl sm:rounded-r-xl">
    <Loading />
  </div>
);

export const LoadingImagesPanel = ({ mediaType }: { mediaType: TMediaType }) => (
  <div
    data-active={mediaType === "image"}
    className="grow hidden data-[active=true]:grid grid-cols-2 gap-3 p-3 overflow-y-auto content-start"
  >
    {Array.from(
      {
        length: 12,
      },
      (_, i) => i + 1
    ).map((key) => (
      <span key={key} className="w-full aspect-square bg-primary-50/10 rounded-lg animate-pulse" />
    ))}
  </div>
);

export const LoadingVideosPanel = ({ mediaType }: { mediaType: TMediaType }) => (
  <div
    data-active={mediaType === "video"}
    className="grow hidden data-[active=true]:grid grid-cols-2 items-center gap-3 p-3 overflow-y-auto content-start"
  >
    {Array.from(
      {
        length: 12,
      },
      (_, i) => i + 1
    ).map((key) => (
      <span key={key} className="w-full aspect-video bg-primary-50/10 rounded-lg animate-pulse" />
    ))}
  </div>
);

export const LoadingAudiosPanel = ({ mediaType }: { mediaType: TMediaType }) => (
  <div
    data-active={mediaType === "audio"}
    className="grow hidden data-[active=true]:flex flex-col items-center gap-3 p-3 overflow-y-auto"
  >
    {Array.from(
      {
        length: 12,
      },
      (_, i) => i + 1
    ).map((key) => (
      <div key={key} className="w-full flex items-center gap-2 bg-primary-50/5 rounded-xl pr-2 animate-pulse">
        <div className="p-1.5 bg-primary-50/5 rounded-xl">
          <MdOutlineAudiotrack className="size-7" />
        </div>
        <p className="grow h-5 bg-primary-50/5 rounded-md" />
      </div>
    ))}
  </div>
);

export default LoadingMediaSlot;
