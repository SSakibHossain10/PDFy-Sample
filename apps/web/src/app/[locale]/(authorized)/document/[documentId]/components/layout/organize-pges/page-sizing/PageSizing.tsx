import { PX_PER_INCH, PX_PER_MM } from "@/constants/units";
import { PAGE_SIZES, PAGE_SIZING } from "@/data/page_sizing";
import usePopover from "@/hooks/usePopover";
import useTouchVerticalSwiper from "@/hooks/useTouchVerticalSwiper";
import { numberToFixed } from "@/utils/number_formating";
import { CSSProperties, Dispatch, useState } from "react";
import { MdArrowDropDown, MdArrowLeft } from "react-icons/md";
import { TDocumentPageOrientation } from "../../../../types/document";

const PageSizing = ({
  setSizeSelectionType,
  sizeSelectionType,
  pageOrientation,
  setPageOrientation,
  presetPageSize,
  setPresetPageSize,
  pageCustomWidth,
  setPageCustomWidth,
  pageCustomHeight,
  setPageCustomHeight,
}: {
  sizeSelectionType: "choose_from_a_preset" | "set_custom_page_size";
  setSizeSelectionType: Dispatch<React.SetStateAction<"choose_from_a_preset" | "set_custom_page_size">>;
  pageOrientation: TDocumentPageOrientation;
  setPageOrientation: Dispatch<React.SetStateAction<TDocumentPageOrientation>>;
  presetPageSize: keyof typeof PAGE_SIZES;
  setPresetPageSize: Dispatch<React.SetStateAction<keyof typeof PAGE_SIZES>>;
  pageCustomWidth: number;
  setPageCustomWidth: Dispatch<React.SetStateAction<number>>;
  pageCustomHeight: number;
  setPageCustomHeight: Dispatch<React.SetStateAction<number>>;
}) => {
  const pageSizingOptionsPopover = usePopover<HTMLDialogElement>();

  const [sizeUnit, setSizeUnit] = useState<"MM" | "INCH" | "PX">("PX");

  const handleChangePageCustomWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (sizeUnit === "MM") {
      setPageCustomWidth(value * PX_PER_MM);
    } else if (sizeUnit === "INCH") {
      setPageCustomWidth(value * PX_PER_INCH);
      setPageCustomWidth(value);
    }
  };

  const handleChangePageCustomHeight = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (sizeUnit === "MM") {
      setPageCustomHeight(value * PX_PER_MM);
    } else if (sizeUnit === "INCH") {
      setPageCustomHeight(value * PX_PER_INCH);
    } else {
      setPageCustomHeight(value);
    }
  };

  const { onTouchStart, onTouchMove, onTouchEndCapture } = useTouchVerticalSwiper({
    onSwipingClose: () => pageSizingOptionsPopover.popoverRef.current?.hidePopover(),
    layoutRef: pageSizingOptionsPopover.popoverRef,
  });

  return (
    <>
      <dialog
        ref={pageSizingOptionsPopover.popoverRef}
        popover="auto"
        id={pageSizingOptionsPopover.id}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEndCapture={onTouchEndCapture}
        className="sx:position-anchor-unset-important sx:popover-animation-translate-from-bottom sm:popover-animation-opacity sx:bottom-0 sm:position-area-[left] sm:position-fallbacks-[top,bottom] w-dvw sm:w-80 sm:mr-4 open:[&+*]:bg-forground/15 sx:backdrop:bg-black/20"
        style={
          {
            positionAnchor: pageSizingOptionsPopover.positionAnchor,
          } as CSSProperties
        }
      >
        <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />

        <form className="bg-gr-multi-dark rounded-xl">
          <div
            className="flex flex-col gap-4 px-4 py-5 cursor-pointer rounded-xl hover:bg-primary-100/5 data-[active=true]:bg-primary-100/10"
            onClick={() => setSizeSelectionType("choose_from_a_preset")}
            data-active={sizeSelectionType === "choose_from_a_preset"}
          >
            <div className="grow flex items-center gap-3">
              <input
                type="radio"
                id="choose_from_a_preset"
                name="size_selection_type"
                checked={sizeSelectionType === "choose_from_a_preset"}
                onChange={() => setSizeSelectionType("choose_from_a_preset")}
                className="size-4.5"
              />
              <h5>Choose from a preset</h5>
            </div>

            <div className="flex items-center gap-3">
              <label className="grow flex items-center justify-center gap-2 bg-primary-100/10 rounded-md px-2 py-1 cursor-pointer">
                <input
                  type="radio"
                  id="portrait"
                  name="page_orientation"
                  checked={pageOrientation === "PORTRAIT"}
                  onChange={() => setPageOrientation("PORTRAIT")}
                  className="size-4"
                />
                <h6>Portrait</h6>
              </label>
              <label className="grow flex items-center justify-center gap-2 bg-primary-100/10 rounded-md px-2 py-1 cursor-pointer">
                <input
                  type="radio"
                  id="landscape"
                  name="page_orientation"
                  checked={pageOrientation === "LANDSCAPE"}
                  onChange={() => setPageOrientation("LANDSCAPE")}
                  className="size-4"
                />
                <h6>Landscape</h6>
              </label>
            </div>

            <select
              name="preset_page_size"
              value={presetPageSize}
              onChange={(e) => setPresetPageSize(e.target.value as keyof typeof PAGE_SIZES)}
              className="bg-primary-100/10 px-2 py-1 outline-0 rounded-md"
            >
              {PAGE_SIZING.map((sizeSeries) => (
                <optgroup key={sizeSeries.name} label={sizeSeries.label}>
                  {sizeSeries.sizes.map((size) => (
                    <option key={size.name} value={size.name}>
                      {size.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div
            className="flex flex-col gap-4 px-4 py-5 cursor-pointer rounded-xl hover:bg-primary-100/5 data-[active=true]:bg-primary-100/10"
            onClick={() => setSizeSelectionType("set_custom_page_size")}
            data-active={sizeSelectionType === "set_custom_page_size"}
          >
            <div className="grow flex items-center gap-3">
              <input
                type="radio"
                id="set_custom_page_size"
                name="size_selection_type"
                checked={sizeSelectionType === "set_custom_page_size"}
                onChange={() => setSizeSelectionType("set_custom_page_size")}
                className="size-4.5"
              />
              <h5>Set custom page size</h5>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <label className="grow flex flex-col gap-1">
                <p>Width</p>
                <div className="w-full h-8 flex items-center justify-between pl-2.5 gap-2.5 bg-primary-50/10 rounded-md overflow-hidden relative">
                  <input
                    type="number"
                    min={100}
                    max={5000}
                    name="page_custom_width"
                    value={
                      sizeUnit === "MM"
                        ? numberToFixed(pageCustomWidth / PX_PER_MM, 2)
                        : sizeUnit === "INCH"
                          ? numberToFixed(pageCustomWidth / PX_PER_INCH, 2)
                          : numberToFixed(pageCustomWidth, 2)
                    }
                    onChange={handleChangePageCustomWidth}
                    className="grow w-5 bg-transparent h-full border-none outline-none text-xs"
                  />
                  <select
                    className="shrink-0 bg-primary-100/10 field-sizing-content pl-2 pr-4 h-full text-sm appearance-none"
                    value={sizeUnit}
                    onChange={(e) => setSizeUnit(e.target.value as "MM" | "INCH" | "PX")}
                  >
                    <option value="PX">px</option>
                    <option value="MM">mm</option>
                    <option value="INCH">inch</option>
                  </select>
                  <MdArrowDropDown className="absolute right-0.75 size-3 pointer-events-none" />
                </div>
              </label>

              <label className="grow flex flex-col gap-1">
                <p>Height</p>
                <div className="w-full h-8 flex items-center justify-between pl-2.5 gap-2.5 bg-primary-50/10 rounded-md overflow-hidden relative">
                  <input
                    type="number"
                    min={100}
                    max={5000}
                    name="page_custom_height"
                    value={
                      sizeUnit === "MM"
                        ? numberToFixed(pageCustomHeight / PX_PER_MM, 2)
                        : sizeUnit === "INCH"
                          ? numberToFixed(pageCustomHeight / PX_PER_INCH, 2)
                          : numberToFixed(pageCustomHeight, 2)
                    }
                    onChange={handleChangePageCustomHeight}
                    className="grow w-5 bg-transparent h-full border-none outline-none text-xs"
                  />
                  <select
                    className="shrink-0 bg-primary-100/10 field-sizing-content pl-2 pr-4 h-full text-sm appearance-none"
                    value={sizeUnit}
                    onChange={(e) => setSizeUnit(e.target.value as "MM" | "INCH" | "PX")}
                  >
                    <option value="PX">px</option>
                    <option value="MM">mm</option>
                    <option value="INCH">inch</option>
                  </select>
                  <MdArrowDropDown className="absolute right-0.75 size-3 pointer-events-none" />
                </div>
              </label>
            </div>
          </div>
        </form>
      </dialog>

      <button
        popoverTarget={pageSizingOptionsPopover.popoverTarget}
        className="grow py-2 flex flex-col justify-center items-center hover:bg-primary-50/10 active:text-primary-500 rounded-md"
        style={
          {
            anchorName: pageSizingOptionsPopover.anchorName,
          } as CSSProperties
        }
      >
        <h6 className="writing-mode-vertical-lr rotate-180">
          {sizeSelectionType === "choose_from_a_preset"
            ? PAGE_SIZES[presetPageSize]?.label
            : `${Math.round(pageCustomWidth)} x ${Math.round(pageCustomHeight)}`}
        </h6>
        <MdArrowDropDown className="sm:hidden size-5" />
        <MdArrowLeft className="sx:hidden size-5" />
      </button>
    </>
  );
};

export default PageSizing;
