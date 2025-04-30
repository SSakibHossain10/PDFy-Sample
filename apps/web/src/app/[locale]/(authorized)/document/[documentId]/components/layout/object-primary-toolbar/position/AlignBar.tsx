import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import { IPopover } from "@/hooks/usePopover";
import { useI18n } from "@/locales/client";
import AlignBottomIcn from "@icons/doutone/align-bottom.svg";
import AlignCenterIcn from "@icons/doutone/align-center.svg";
import AlignLeftIcn from "@icons/doutone/align-left.svg";
import AlignMiddleIcn from "@icons/doutone/align-middle.svg";
import AlignRightIcn from "@icons/doutone/align-right.svg";
import AlignTopIcn from "@icons/doutone/align-top..svg";
import { ToggleEvent, useEffect, useState } from "react";
import { CanvasObject } from "../../../../types/document";

function AlignBar({ parentPopover }: { parentPopover: IPopover<HTMLDialogElement> }) {
  const [objectAlign, setObjectPosition] = useState({
    toTop: false,
    toBottom: false,
    toLeft: false,
    toRight: false,
    toCenter: false,
    toMiddle: false,
  });

  const setStateHandler = () => {
    const activeObj = documentManager.currentCanvas.getActiveObject() as CanvasObject;
    const objectBoundingRect = activeObj.getBoundingRect();

    setObjectPosition({
      toTop: activeObj.top === 0,
      toBottom: activeObj.top === documentManager.currentCanvas.height - objectBoundingRect.height,
      toLeft: activeObj.left === 0,
      toRight: activeObj.left === documentManager.currentCanvas.width - objectBoundingRect.width,
      toCenter: activeObj.left === documentManager.currentCanvas.width / 2 - objectBoundingRect.width / 2,
      toMiddle: activeObj.top === documentManager.currentCanvas.height / 2 - objectBoundingRect.height / 2,
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
    <div className="grid grid-cols-2 gap-2.5">
      <button
        disabled={objectAlign.toTop}
        className="h-9 px-2 flex items-center gap-1.5 bg-primary-50/10 rounded-lg active:bg-primary-50/5 active:text-primary-500 disabled:opacity-50"
        onClick={() => {
          documentManager.alignObjectToPageTop();
          setObjectPosition((state) => ({
            ...state,
            toTop: true,
            toBottom: false,
            toMiddle: false,
          }));
        }}
      >
        <AlignTopIcn className="size-7 p-1" />
        <span>{t("Top")}</span>
      </button>

      <button
        disabled={objectAlign.toLeft}
        className="h-9 px-2 flex items-center gap-1.5 bg-primary-50/10 rounded-lg active:text-primary-500 disabled:opacity-50"
        onClick={() => {
          documentManager.alignObjectToPageLeft();
          setObjectPosition((state) => ({
            ...state,
            toLeft: true,
            toRight: false,
            toCenter: false,
          }));
        }}
      >
        <AlignLeftIcn className="size-7 p-1" />
        <span>{t("Left")}</span>
      </button>

      <button
        disabled={objectAlign.toMiddle}
        className="h-9 px-2 flex items-center gap-1.5 bg-primary-50/10 rounded-lg active:text-primary-500 disabled:opacity-50"
        onClick={() => {
          documentManager.alignObjectToPageMiddle();
          setObjectPosition((state) => ({
            ...state,
            toMiddle: true,
            toTop: false,
            toBottom: false,
          }));
        }}
      >
        <AlignMiddleIcn className="size-7 p-1" />
        <span>{t("Middle")}</span>
      </button>

      <button
        disabled={objectAlign.toCenter}
        className="h-9 px-2 flex items-center gap-1.5 bg-primary-50/10 rounded-lg active:text-primary-500 disabled:opacity-50"
        onClick={() => {
          documentManager.alignObjectToPageCenter();
          setObjectPosition((state) => ({
            ...state,
            toCenter: true,
            toLeft: false,
            toRight: false,
          }));
        }}
      >
        <AlignCenterIcn className="size-7 p-1" />
        <span>{t("Center")}</span>
      </button>

      <button
        disabled={objectAlign.toBottom}
        className="h-9 px-2 flex items-center gap-1.5 bg-primary-50/10 rounded-lg active:text-primary-500 disabled:opacity-50"
        onClick={() => {
          documentManager.alignObjectToPageBottom();
          setObjectPosition((state) => ({
            ...state,
            toBottom: true,
            toTop: false,
            toMiddle: false,
          }));
        }}
      >
        <AlignBottomIcn className="size-7 p-1" />
        <span>{t("Bottom")}</span>
      </button>

      <button
        disabled={objectAlign.toRight}
        className="h-9 px-2 flex items-center gap-1.5 bg-primary-50/10 rounded-lg active:text-primary-500 disabled:opacity-50"
        onClick={() => {
          documentManager.alignObjectToPageRight();
          setObjectPosition((state) => ({
            ...state,
            toRight: true,
            toLeft: false,
            toCenter: false,
          }));
        }}
      >
        <AlignRightIcn className="size-7 p-1" />
        <span>{t("Right")}</span>
      </button>
    </div>
  );
}

export default AlignBar;
