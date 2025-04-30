import { soloidColors } from "@/app/[locale]/(authorized)/document/[documentId]/data/color";
import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import { COLOR_IMG, NO_COLOR_IMG } from "@/constants";
import { TRANSPARENT_COLOR } from "@/constants/colors";
import { IPopover } from "@/hooks/usePopover";
import useUpdatePopoverHeight from "@/hooks/useUpdatePopoverHeight";
import CloseIcn from "@icons/doutone/close-circle.svg";
import { TFiller } from "fabric";
import { ToggleEvent, useEffect, useRef, useState } from "react";
import { CanvasObject } from "../../../../types/document";

function StrokeColorPanel({ myPopover }: { myPopover: IPopover<HTMLDialogElement> }) {
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

  useUpdatePopoverHeight(myPopover.popoverRef, "--stroke-panel-popover-height");

  return (
    <section className="w-screen sm:w-89.5 bg-gr-multi-dark flex flex-col rounded-t-xl sm:rounded-xl">
      <button
        popoverTarget={myPopover.popoverTarget}
        popoverTargetAction="hide"
        className="absolute right-2.5 sm:right-3 top-2.5 sm:top-3"
      >
        <CloseIcn className="size-7 active:text-primary-500" />
      </button>

      <div className="flex justify-center py-2 pt-3 sm:py-3">
        <h4 className="font-medium">Stroke</h4>
      </div>

      <div className="flex flex-col gap-6 p-4 pt-2 sm:pt-3 overflow-y-auto">
        <div className="grid grid-cols-7 sm:grid-cols-6 gap-2.5 sm:gap-3">
          <img
            loading="lazy"
            src={COLOR_IMG}
            alt="color"
            width={32}
            height={32}
            className="w-full aspect-square rounded-full cursor-pointer"
            onClick={() => colorPickerRef.current?.click()}
          />
          <input
            type="color"
            className="invisible absolute h-8 w-8"
            ref={colorPickerRef}
            defaultValue={objectStroke as string}
            onChange={(e) => handleSetStrokeColor(e.target.value)}
          />

          <img
            loading="lazy"
            src={NO_COLOR_IMG}
            alt="no-color"
            width={32}
            height={32}
            className={`w-full aspect-square rounded-full cursor-pointer${!objectStroke ? " bg-primary-200/50" : ""}`}
            style={{
              background: !objectStroke ? (objectFill as string) || "hsl(var(--color-primary-200) / 0.5)" : "none",
            }}
            onClick={() => handleSetStrokeColor(TRANSPARENT_COLOR)}
          />

          {objectStroke && (
            <div
              className="w-full aspect-square rounded-full border-4 bg-primary-200/50"
              style={{
                borderColor: objectStroke as string,
                background: (objectFill as string) || "hsl(var(--color-primary-200) / 0.5)",
              }}
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h6>Solid colors</h6>
          <div className="grid grid-cols-7 sm:grid-cols-6 gap-2.5 sm:gap-3">
            {soloidColors.map((color) => (
              <button
                key={color.name}
                className={`w-full aspect-square rounded-full border-4${
                  objectStroke === color.color ? " bg-primary-200/50" : ""
                }`}
                style={{
                  borderColor: color.color,
                  background:
                    objectStroke === color.color
                      ? (objectFill as string) || "hsl(var(--color-primary-200) / 0.5)"
                      : "none",
                }}
                onClick={() => handleSetStrokeColor(color.color)}
              />
            ))}
          </div>
        </div>

        {/* <div className="flex flex-col gap-2">
          <h6 className="opacity-50">Gradients</h6>
          <div className="grid grid-cols-7 sm:grid-cols-6 gap-2.5 sm:gap-3">
            {gradientColors.map((color) => (
              <button
                key={color.name}
                className="w-full aspect-square rounded-full opacity-50"
                style={{ background: color.gradient }}
              />
            ))}
          </div>
        </div> */}
      </div>
    </section>
  );
}

export default StrokeColorPanel;
