import { IPopover } from "@/hooks/usePopover";
import UppercaseIcn from "@icons/uppercase.svg";
import { CSSProperties, ToggleEvent, useEffect, useState } from "react";
import CanvasTextbox from "../../../../classes/CanvasTextbox";
import { documentManager } from "../../../../documentManager";

const OBJECTS_SHOULD_ACTIVE = [CanvasTextbox.type];

const TextUppercaseBar = ({ parentPopover }: { parentPopover: IPopover<HTMLDivElement | HTMLDialogElement> }) => {
  const [isTextUppercased, setIsTextUppercased] = useState<CanvasTextbox["uppercase"]>(
    false as unknown as CanvasTextbox["uppercase"]
  );

  const setStateHandler = () => {
    const activeObject = documentManager.currentCanvas.getActiveObject();

    if (OBJECTS_SHOULD_ACTIVE.includes(activeObject?.type as (typeof OBJECTS_SHOULD_ACTIVE)[number])) {
      setIsTextUppercased((activeObject as CanvasTextbox).uppercase || false);
    }
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

  const handleSetTextUppercased = (textUppercased: CanvasTextbox["uppercase"]) => {
    setIsTextUppercased(textUppercased);
    documentManager.changeTextUppercase(textUppercased);
  };

  return (
    <>
      <button
        aria-describedby="upercase-tooltip"
        className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg hover:[&+*]:inline active:[&+*]:inline ${
          isTextUppercased
            ? "bg-forground/15 text-primary-200 active:text-primary-500"
            : "hover:bg-forground/10 active:text-primary-500"
        }`}
        style={{ anchorName: "--upercase-anchor" } as CSSProperties}
        onClick={() => handleSetTextUppercased(!isTextUppercased)}
      >
        <UppercaseIcn className="size-5" />
        <span className="sm:hidden text-2xs">Uppercase</span>
      </button>
      {/* upercase-tooltip */}
      <div
        id="upercase-tooltip"
        className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
        style={
          {
            positionAnchor: "--upercase-anchor",
          } as CSSProperties
        }
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
          Uppercase
        </p>
      </div>
    </>
  );
};

export default TextUppercaseBar;
