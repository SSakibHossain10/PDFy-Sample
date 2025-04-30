import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import { IPopover } from "@/hooks/usePopover";
import { useI18n } from "@/locales/client";
import BackwardIcn from "@icons/doutone/backward.svg";
import ForwardIcn from "@icons/doutone/forward.svg";
import ToBackIcn from "@icons/doutone/to-back.svg";
import ToFrontIcn from "@icons/doutone/to-front.svg";
import { ToggleEvent, useEffect, useState } from "react";
import { CanvasObject } from "../../../../types/document";

function ArrangeBar({ parentPopover }: { parentPopover: IPopover<HTMLDialogElement> }) {
  const [objectPosition, setObjectPosition] = useState({
    isBottom: false,
    isTop: false,
  });

  const setStateHandler = () => {
    const activeObj = documentManager.currentCanvas.getActiveObject() as CanvasObject;

    setObjectPosition({
      isBottom: activeObj === documentManager.currentCanvas._objects[0],
      isTop: activeObj === documentManager.currentCanvas._objects[documentManager.currentCanvas._objects.length - 1],
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
        disabled={objectPosition.isTop}
        className="h-9 px-2 flex items-center gap-1.5 bg-primary-50/10 rounded-lg active:bg-primary-50/5 active:text-primary-500 disabled:opacity-50"
        onClick={() => {
          documentManager.bringActiveObjectForward();
          setObjectPosition({
            isBottom: false,
            isTop:
              documentManager.currentCanvas.getActiveObject() ===
              documentManager.currentCanvas._objects[documentManager.currentCanvas._objects.length - 1],
          });
        }}
      >
        <ForwardIcn className="size-7 p-0.5" />
        <span>{t("Forward")}</span>
      </button>
      <button
        disabled={objectPosition.isBottom}
        className="h-9 px-2 flex items-center gap-1.5 bg-primary-50/10 rounded-lg active:text-primary-500 disabled:opacity-50"
        onClick={() => {
          documentManager.sendActiveObjectBackward();
          setObjectPosition({
            isTop: false,
            isBottom: documentManager.currentCanvas.getActiveObject() === documentManager.currentCanvas._objects[0],
          });
        }}
      >
        <BackwardIcn className="size-7 p-0.5 pb-0 pt-1" />
        <span>{t("Backward")}</span>
      </button>
      <button
        disabled={objectPosition.isTop}
        className="h-9 px-2 flex items-center gap-1.5 bg-primary-50/10 rounded-lg active:text-primary-500 disabled:opacity-50"
        onClick={() => {
          documentManager.bringActiveObjectToFront();
          setObjectPosition({
            isBottom: false,
            isTop: true,
          });
        }}
      >
        <ToFrontIcn className="size-7 pl-1.25 pb-1.25 pt-0.75 pr-0.75" />
        <span>{t("To front")}</span>
      </button>
      <button
        disabled={objectPosition.isBottom}
        className="h-9 px-2 flex items-center gap-1.5 bg-primary-50/10 rounded-lg active:text-primary-500 disabled:opacity-50"
        onClick={() => {
          documentManager.sendActiveObjectToBack();
          setObjectPosition({
            isTop: false,
            isBottom: true,
          });
        }}
      >
        <ToBackIcn className="size-7 pl-1.5 pb-1.5 pt-0.5 pr-0.5" />
        <span>{t("To back")}</span>
      </button>
    </div>
  );
}

export default ArrangeBar;
