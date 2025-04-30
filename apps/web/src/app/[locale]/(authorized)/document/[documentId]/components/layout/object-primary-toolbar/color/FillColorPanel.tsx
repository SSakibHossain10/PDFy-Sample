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

function FillColorPanel({ myPopover }: { myPopover: IPopover<HTMLDialogElement> }) {
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

  useUpdatePopoverHeight(myPopover.popoverRef, "--fill-panel-popover-height");

  return (
    <section className="w-screen sm:w-89.5 bg-gr-multi-dark flex flex-col rounded-t-xl sm:rounded-xl">
      <button
        popoverTarget={myPopover.popoverTarget}
        popoverTargetAction="hide"
        className="absolute right-2.5 sm:right-3 top-3"
      >
        <CloseIcn className="size-7 active:text-primary-500" />
      </button>

      <div className="flex justify-center py-2 pt-3 sm:py-3">
        <h4 className="font-medium">Color</h4>
      </div>

      <div className="flex flex-col gap-6 p-4 pt-2 sm:pt-3overflow-y-auto">
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
            defaultValue={objectFill as string}
            onChange={(e) => handleSetFillColor(e.target.value)}
          />

          <img
            loading="lazy"
            src={NO_COLOR_IMG}
            alt="no-color"
            width={32}
            height={32}
            className={`w-full aspect-square rounded-full cursor-pointer${!objectFill ? " border-4" : ""}`}
            style={{
              borderColor: !objectFill
                ? (objectStroke as string) ||
                  "hsl(var(--color-primary-950) / var(--color-primary-950-opacity, var(--tw-border-opacity)))"
                : "none",
            }}
            onClick={() => handleSetFillColor(TRANSPARENT_COLOR)}
          />

          {objectFill && (
            <div
              className="w-full aspect-square rounded-full border-4"
              style={{
                background: objectFill as string,
                borderColor:
                  (objectStroke as string) ||
                  "hsl(var(--color-primary-950) / var(--color-primary-950-opacity, var(--tw-border-opacity)))",
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
                className={`w-full aspect-square rounded-full ${objectFill === color.color ? " border-4" : ""}`}
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

export default FillColorPanel;
