import { PAGE_SIZES } from "@/data/page_sizing";
import { IPopover } from "@/hooks/usePopover";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { LiaSpinnerSolid } from "react-icons/lia";
import { documentManager } from "../../../documentManager";
import { TDocumentPageOrientation } from "../../../types/document";
import PageSizing from "./page-sizing/PageSizing";

const OrganizePageAdd = ({
  parentPopover,
  totalPageCount,
}: {
  parentPopover: IPopover<HTMLDialogElement>;
  totalPageCount: number;
}) => {
  const [sizeSelectionType, setSizeSelectionType] = useState<"choose_from_a_preset" | "set_custom_page_size">(
    "choose_from_a_preset"
  );

  const [pageOrientation, setPageOrientation] = useState<TDocumentPageOrientation>("PORTRAIT");

  const [presetPageSize, setPresetPageSize] = useState<keyof typeof PAGE_SIZES>("A4");

  const [pageCustomWidth, setPageCustomWidth] = useState<number>(PAGE_SIZES.A4.width);
  const [pageCustomHeight, setPageCustomHeight] = useState<number>(PAGE_SIZES.A4.height);

  const pageAspectRatio =
    sizeSelectionType === "choose_from_a_preset"
      ? pageOrientation === "PORTRAIT"
        ? `1/${PAGE_SIZES[presetPageSize].aspectRatio}`
        : `${PAGE_SIZES[presetPageSize].aspectRatio}/1`
      : `${pageCustomWidth}/${pageCustomHeight}`;

  const [adding, setAdding] = useState(false);

  const handleAddPage = () => {
    setAdding(true);
    documentManager
      .addDocumentPage({
        pageSize: sizeSelectionType === "choose_from_a_preset" ? presetPageSize : "CUSTOM",
        pageOrientation:
          sizeSelectionType === "choose_from_a_preset"
            ? pageOrientation
            : pageCustomWidth > pageCustomHeight
              ? "LANDSCAPE"
              : "PORTRAIT",
        customWidth: sizeSelectionType === "choose_from_a_preset" ? undefined : pageCustomWidth,
        customHeight: sizeSelectionType === "choose_from_a_preset" ? undefined : pageCustomHeight,
      })
      .then(() => {
        setAdding(false);
        //#reconnect for update current page graphichs live update
        parentPopover.popoverRef.current.hidePopover();
        parentPopover.popoverRef.current.showPopover();
      })
      .catch(() => setAdding(false));
  };

  return (
    <div className="bg-primary-100/10 w-full flex items-center rounded-md z-30">
      <div className="shrink-0 w-8 h-full flex flex-col justify-evenly">
        <span className="grow" />
        <PageSizing
          setSizeSelectionType={setSizeSelectionType}
          sizeSelectionType={sizeSelectionType}
          pageOrientation={pageOrientation}
          setPageOrientation={setPageOrientation}
          presetPageSize={presetPageSize}
          setPresetPageSize={setPresetPageSize}
          pageCustomWidth={pageCustomWidth}
          setPageCustomWidth={setPageCustomWidth}
          pageCustomHeight={pageCustomHeight}
          setPageCustomHeight={setPageCustomHeight}
        />
        <span className="grow" />
      </div>

      <button
        className="grow bg-primary-100/15 w-full h-min flex justify-center items-center hover:bg-primary-50/20 active:text-primary-500 disabled:animate-pulse"
        style={{
          aspectRatio: pageAspectRatio,
        }}
        onClick={handleAddPage}
        disabled={adding}
      >
        {adding ? <LiaSpinnerSolid className="size-6 animate-spin" /> : <FaPlus className="size-6" />}
      </button>

      <div className="shrink-0 w-8 py-2 gap-2 flex flex-col justify-between">
        <h6 className="font-bold text-center">{totalPageCount + 1}</h6>
      </div>
    </div>
  );
};

export default OrganizePageAdd;
