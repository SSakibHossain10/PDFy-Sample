import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import { COLOR_IMG, NO_COLOR_IMG } from "@/constants";
import { TRANSPARENT_COLOR } from "@/constants/colors";
import { IPopover } from "@/hooks/usePopover";
import { ToggleEvent, useEffect, useRef, useState } from "react";
import { FaArrowUp } from "react-icons/fa6";
import CanvasPage from "../../../../classes/CanvasPage";
import CanvasBaseField from "../../../../classes/form/CanvasBaseField";
import { soloidColors } from "../../../../data/color";

function BackgroundColorBar({
  myPopover,
  backgroundColorPanelPopover,
}: {
  myPopover: IPopover<HTMLDialogElement>;
  backgroundColorPanelPopover: IPopover<HTMLDialogElement>;
}) {
  const colorPickerRef = useRef<HTMLInputElement>(null);

  const [backgroundColor, setBackgroundColor] = useState<null | CanvasPage["backgroundColor"]>(null);

  const setStateHandler = () => {
    const activeObj = documentManager.currentCanvas.getActiveObject() as unknown as CanvasPage;
    setBackgroundColor(
      activeObj instanceof CanvasPage ? activeObj.backgroundColor : (activeObj as CanvasBaseField).fieldBackgroundColor
    );
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

  const handleSetBackgroundColor = (color: CanvasPage["backgroundColor"] | CanvasBaseField["fieldBackgroundColor"]) => {
    setBackgroundColor(color);
    const activeObject = documentManager.currentCanvas.getActiveObject();
    if (activeObject instanceof CanvasPage) {
      documentManager.changePageBackgroundColor(color);
    } else {
      documentManager.changeFieldBackgroundColor(color as CanvasBaseField["fieldBackgroundColor"]);
    }
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
          defaultValue={backgroundColor as string}
          onChange={(e) => handleSetBackgroundColor(e.target.value)}
        />

        <img
          loading="lazy"
          src={NO_COLOR_IMG}
          alt="no-color"
          width={36}
          height={36}
          className={`shrink-0 rounded-full cursor-pointer${!backgroundColor ? " border-4" : ""}`}
          style={{
            borderColor: !backgroundColor
              ? "hsl(var(--color-primary-950) / var(--color-primary-950-opacity, var(--tw-border-opacity)))"
              : "none",
          }}
          onClick={() => handleSetBackgroundColor(TRANSPARENT_COLOR)}
        />

        {soloidColors.map((color) => (
          <button
            key={color.name}
            className={`shrink-0 size-9 rounded-full${backgroundColor === color.color ? " border-4" : ""}`}
            style={{
              background: color.color,
              borderColor:
                backgroundColor === color.color
                  ? "hsl(var(--color-primary-950) / var(--color-primary-950-opacity, var(--tw-border-opacity)))"
                  : "none",
            }}
            onClick={() => handleSetBackgroundColor(color.color)}
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
          backgroundColorPanelPopover.popoverRef.current.showPopover();
        }}
        className="bg-gr-multi-dark h-ful absolute right-1 border rounded-full"
        style={{ boxShadow: "-10px 0px 15px #000000" }}
      >
        <FaArrowUp className="size-9 p-2" />
      </button>
    </div>
  );
}

export default BackgroundColorBar;
