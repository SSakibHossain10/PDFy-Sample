import { soloidColors } from "@/app/[locale]/(authorized)/document/[documentId]/data/color";
import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import { COLOR_IMG, NO_COLOR_IMG } from "@/constants";
import { BLACK_COLOR } from "@/constants/colors";
import { IPopover } from "@/hooks/usePopover";
import { TFiller } from "fabric";
import { ToggleEvent, useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import { CanvasObject } from "../../../../types/document";

function StrokeColorBar({
  myPopover,
  strokeColorPanelPopover,
}: {
  myPopover: IPopover<HTMLDialogElement>;
  strokeColorPanelPopover: IPopover<HTMLDialogElement>;
}) {
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const [objectFill, setObjectFill] = useState<null | string | TFiller>(null);
  const [objectStroke, setObjectStroke] = useState<null | string | TFiller>(null);

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

  const handleSetStrokeColor = (color: string) => {
    setObjectStroke(color);
    documentManager.changeObjectStrokeColor(color);
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
          defaultValue={objectStroke as string}
          onChange={(e) => handleSetStrokeColor(e.target.value)}
        />

        <img
          loading="lazy"
          src={NO_COLOR_IMG}
          alt="no-color"
          width={36}
          height={36}
          className={`shrink-0 rounded-full cursor-pointer${!objectStroke ? " bg-primary-200/50" : ""}`}
          style={{
            background: !objectStroke ? (objectFill as string) || "hsl(var(--color-primary-200) / 0.5)" : "none",
          }}
          onClick={() => handleSetStrokeColor(BLACK_COLOR)}
        />

        {soloidColors.map((color) => (
          <button
            key={color.name}
            className={`shrink-0 size-9 rounded-full border-4${
              objectStroke === color.color ? " bg-primary-200/50" : ""
            }`}
            style={{
              borderColor: color.color,
              background:
                objectStroke === color.color ? (objectFill as string) || "hsl(var(--color-primary-200) / 0.5)" : "none",
            }}
            onClick={() => handleSetStrokeColor(color.color)}
          />
        ))}

        {/* {gradientColors.map((color) => (
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
          strokeColorPanelPopover.popoverRef.current.showPopover();
        }}
        className="bg-gr-multi-dark h-ful absolute right-1 border rounded-full"
        style={{ boxShadow: "-10px 0px 15px #000000" }}
      >
        <FaArrowUp className="size-9 p-2" />
      </button>
    </div>
  );
}

export default StrokeColorBar;
