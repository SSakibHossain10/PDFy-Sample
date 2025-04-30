import { soloidColors } from "@/app/[locale]/(authorized)/document/[documentId]/data/color";
import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import { COLOR_IMG, NO_COLOR_IMG } from "@/constants";
import { TRANSPARENT_COLOR } from "@/constants/colors";
import { IPopover } from "@/hooks/usePopover";
import { TFiller } from "fabric";
import { ToggleEvent, useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { CanvasObject } from "../../../../types/document";

function FillColorBar({
  myPopover,
  fillColorPanelPopover,
}: {
  myPopover: IPopover<HTMLDialogElement>;
  fillColorPanelPopover: IPopover<HTMLDialogElement>;
}) {
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const [objectStroke, setObjectStroke] = useState<null | string | TFiller>(null);
  const [objectFill, setObjectFill] = useState<null | string | TFiller>(null);

  const setStateHandler = () => {
    const activeObj = documentManager.currentCanvas.getActiveObject() as CanvasObject;
    setObjectFill(activeObj.fill);
    setObjectStroke(activeObj.stroke);
  };

  const setStateOnPopoverOpen = (e: ToggleEvent<HTMLDivElement>) => {
    if (e.newState === "open") {
      setStateHandler();

      documentManager.on("selection:updated", setStateHandler);
    } else {
      documentManager.off("selection:updated", setStateHandler);
    }
  };

  useEffect(() => {
    myPopover.popoverRef.current.addEventListener("beforetoggle", setStateOnPopoverOpen as unknown as EventListener);

    return () => {
      myPopover.popoverRef.current?.removeEventListener(
        "beforetoggle",
        setStateOnPopoverOpen as unknown as EventListener
      );
    };
  }, []);

  const handleSetFillColor = (color: string) => {
    setObjectFill(color);
    documentManager.setObjectFillColor(color);
  };

  return (
    <div className="w-full h-12 bg-gr-multi-dark rounded-3xl flex items-center pr-5">
      <div className="flex gap-1.5 overflow-x-auto py-1 pl-2 pr-8 scrollbar-hidden">
        <img
          loading="lazy"
          src={COLOR_IMG}
          alt="color"
          width={36}
          height={36}
          className="shrink-0  rounded-full cursor-pointer"
          onClick={() => colorPickerRef.current?.click()}
        />
        <input
          type="color"
          className="invisible absolute h-9 w-9"
          ref={colorPickerRef}
          defaultValue={objectFill as string}
          onChange={(e) => handleSetFillColor(e.target.value)}
        />

        <img
          loading="lazy"
          src={NO_COLOR_IMG}
          alt="no-color"
          width={36}
          height={36}
          className={`shrink-0 rounded-full cursor-pointer${!objectFill ? " border-4" : ""}`}
          style={{
            borderColor: !objectFill
              ? (objectStroke as string) ||
                "hsl(var(--color-primary-950) / var(--color-primary-950-opacity, var(--tw-border-opacity)))"
              : "none",
          }}
          onClick={() => handleSetFillColor(TRANSPARENT_COLOR)}
        />

        {soloidColors.map((color) => (
          <button
            key={color.name}
            className={`shrink-0 size-9 rounded-full${objectFill === color.color ? " border-4" : ""}`}
            style={{
              background: color.color,
              borderColor:
                objectFill === color.color
                  ? (objectStroke as string) ||
                    "hsl(var(--color-primary-950) / var(--color-primary-950-opacity, var(--tw-border-opacity)))"
                  : "none",
            }}
            onClick={() => handleSetFillColor(color.color)}
          />
        ))}
        {/* 
        {gradientColors.map((color) => (
          <button
            key={color.name}
            className="shrink-0 size-9 rounded-full opacity-50"
            style={{ background: color.gradient }}
          />
        ))} */}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          myPopover.popoverRef.current.hidePopover();
          fillColorPanelPopover.popoverRef.current.showPopover();
        }}
        className="bg-gr-multi-dark h-ful absolute right-1 border rounded-full"
        style={{ boxShadow: "-10px 0px 15px #000000" }}
      >
        <FaArrowUp className="size-9 p-2" />
      </button>
    </div>
  );
}

export default FillColorBar;
