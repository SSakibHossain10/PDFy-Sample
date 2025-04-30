"use client";

import addMedia from "@/server-actions/add_media";
import clientNotification from "@/utils/clientNotification";
import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { LiaSpinnerSolid } from "react-icons/lia";
import { MdAdd } from "react-icons/md";

const MediaLinkInput = () => {
  const inputEl = useRef<HTMLInputElement>(null);

  const [inputValue, setInputValue] = useState("");

  const status = useFormStatus();

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  console.log("status", status);
  return (
    <div className="grow flex overflow-hidden">
      <input
        ref={inputEl}
        type="url"
        className="grow w-10 px-3 my-1.25 sm:my-1 bg-background/20 text-xs rounded-full"
        placeholder="Type file url"
        name="media-url"
        value={inputValue}
        onChange={handleChangeInput}
      />
      <button
        className="pr-2.5 pl-1.5 sm:pl-1 disabled:opacity-50"
        type="submit"
        disabled={!inputValue || status.pending}
        formAction={(e) =>
          addMedia(e).then((res) => {
            clientNotification(res);
            setInputValue("");
          })
        }
      >
        {status.pending ? (
          <LiaSpinnerSolid className="size-6 animate-spin" />
        ) : (
          <MdAdd className="size-6 text-sm font-medium" />
        )}
      </button>
    </div>
  );
};

export default MediaLinkInput;
