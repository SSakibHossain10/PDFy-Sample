import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import { IPopover } from "@/hooks/usePopover";
import { useI18n } from "@/locales/client";
import { numberToFixed } from "@/utils/number_formating";
import LockIcn from "@icons/doutone/lock-fill.svg";
import { ToggleEvent, useEffect, useState } from "react";
import { CanvasObject } from "../../../../types/document";

function AdvancedBar({ parentPopover }: { parentPopover: IPopover<HTMLDialogElement> }) {
  const [objectDimension, setObjectDimension] = useState({
    width: 0,
    height: 0,
    left: 0,
    top: 0,
    angle: 0,
  });

  const setStateHandler = () => {
    const activeObj = documentManager.currentCanvas.getActiveObject() as CanvasObject;

    setObjectDimension({
      width: activeObj.width,
      height: activeObj.height,
      left: activeObj.left,
      top: activeObj.top,
      angle: activeObj.angle,
    });
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
    parentPopover.popoverRef.current.addEventListener(
      "beforetoggle",
      setStateOnPopoverOpen as unknown as EventListener
    );

    return () => {
      parentPopover.popoverRef.current?.removeEventListener(
        "beforetoggle",
        setStateOnPopoverOpen as unknown as EventListener
      );
    };
  }, []);

  const t = useI18n();

  return (
    <div className="grid grid-cols-3 gap-2.5">
      <label className="grow flex flex-col gap-1">
        <span>{t("Width")}</span>
        <div className="w-full h-9 flex items-center justify-between px-2.5 gap-2.5 bg-primary-50/10 rounded-lg">
          <input
            value={numberToFixed(objectDimension.width, 2)}
            className="grow w-5 bg-transparent h-full border-none outline-none text-xs"
            type="number"
            enterKeyHint="done"
            onChange={(e) => {
              setObjectDimension((state) => ({ ...state, width: e.target.valueAsNumber }));
              documentManager.updateObjectWidth(e.target.valueAsNumber);
            }}
          />
          <small className="shrink-0">px</small>
        </div>
      </label>

      <label className="grow flex flex-col gap-1">
        <span>{t("Height")}</span>
        <div className="w-full h-9 flex items-center justify-between px-2.5 gap-2.5 bg-primary-50/10 rounded-lg">
          <input
            value={numberToFixed(objectDimension.height, 2)}
            className="grow w-5 bg-transparent h-full border-none outline-none text-xs"
            type="number"
            enterKeyHint="done"
            onChange={(e) => {
              setObjectDimension((state) => ({ ...state, height: e.target.valueAsNumber }));
              documentManager.updateObjectHeight(e.target.valueAsNumber);
            }}
          />
          <small className="shrink-0">px</small>
        </div>
      </label>

      <div className="grow flex flex-col gap-1">
        <span>{t("Ratio")}</span>
        <button className="h-9 flex items-center justify-center bg-primary-50/10 rounded-lg active:bg-primary-50/5 active:text-primary-500">
          <LockIcn className="size-5" />
        </button>
      </div>

      <label className="grow flex flex-col gap-1">
        <span>{t("X")}</span>
        <div className="w-full h-9 flex items-center justify-between px-2.5 gap-2.5 bg-primary-50/10 rounded-lg">
          <input
            value={numberToFixed(objectDimension.left, 2)}
            className="grow w-5 bg-transparent h-full border-none outline-none text-xs"
            type="number"
            enterKeyHint="done"
            onChange={(e) => {
              setObjectDimension((state) => ({ ...state, left: e.target.valueAsNumber }));
              documentManager.updateObjectLeft(e.target.valueAsNumber);
            }}
          />
          <small className="shrink-0">px</small>
        </div>
      </label>

      <label className="grow flex flex-col gap-1">
        <span>{t("Y")}</span>
        <div className="w-full h-9 flex items-center justify-between px-2.5 gap-2.5 bg-primary-50/10 rounded-lg">
          <input
            value={numberToFixed(objectDimension.top, 2)}
            className="grow w-5 bg-transparent h-full border-none outline-none text-xs"
            type="number"
            enterKeyHint="done"
            onChange={(e) => {
              setObjectDimension((state) => ({ ...state, top: e.target.valueAsNumber }));
              documentManager.updateObjectTop(e.target.valueAsNumber);
            }}
          />
          <small className="shrink-0">px</small>
        </div>
      </label>
      <label className="grow flex flex-col gap-1">
        <span>{t("Rotate")}</span>
        <div className="w-full h-9 flex items-center justify-between px-2.5 gap-2.5 bg-primary-50/10 rounded-lg">
          <input
            min={-360}
            max={360}
            value={numberToFixed(objectDimension.angle, 1)}
            className="grow w-5 bg-transparent h-full border-none outline-none text-xs"
            type="number"
            enterKeyHint="done"
            onChange={(e) => {
              setObjectDimension((state) => ({ ...state, angle: e.target.valueAsNumber }));
              documentManager.updateObjectAngle(e.target.valueAsNumber);
            }}
          />
          <small className="shrink-0">°</small>
        </div>
      </label>
    </div>
  );
}

export default AdvancedBar;
