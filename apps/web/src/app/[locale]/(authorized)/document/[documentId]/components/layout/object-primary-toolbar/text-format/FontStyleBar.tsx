import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_STYLE } from "@/constants/document";
import { IPopover } from "@/hooks/usePopover";
import ItalicIcn from "@icons/italic.svg";
import { FabricText } from "fabric";
import { CSSProperties, ToggleEvent, useEffect, useState } from "react";
import CanvasTextbox from "../../../../classes/CanvasTextbox";
import CanvasFeildInput from "../../../../classes/form/CanvasFeildInput";
import CanvasFeildSelect from "../../../../classes/form/CanvasFeildSelect";
import CanvasFeildSelectMultiple from "../../../../classes/form/CanvasFeildSelectMultiple";
import CanvasFeildTextarea from "../../../../classes/form/CanvasFeildTextarea";
import { documentManager } from "../../../../documentManager";

const OBJECTS_SHOULD_ACTIVE = [
  CanvasTextbox.type,
  CanvasFeildInput.type,
  CanvasFeildTextarea.type,
  CanvasFeildSelect.type,
  CanvasFeildSelectMultiple.type,
];

const FontStyleBar = ({ parentPopover }: { parentPopover: IPopover<HTMLDivElement | HTMLDialogElement> }) => {
  const [fontStyle, setFontStyle] = useState<CanvasTextbox["fontStyle"]>("" as unknown as CanvasTextbox["fontStyle"]);
  const [fontFamily, setFontFamily] = useState<CanvasTextbox["fontFamily"]>(
    "" as unknown as CanvasTextbox["fontFamily"]
  );

  const setStateHandler = () => {
    const activeObject = documentManager.currentCanvas.getActiveObject();
    if (OBJECTS_SHOULD_ACTIVE.includes(activeObject?.type as (typeof OBJECTS_SHOULD_ACTIVE)[number])) {
      setFontStyle((activeObject as FabricText).fontStyle || DEFAULT_FONT_STYLE);
      setFontFamily((activeObject as FabricText).fontFamily || DEFAULT_FONT_FAMILY);
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

  const [isSupportItalic, setIsSupportItalic] = useState(true);

  useEffect(() => {
    setIsSupportItalic(documentManager.getFontByName(fontFamily)?.support_italic === false ? false : true);
  }, [fontFamily]);

  const handleSetFontStyle = (fontStyle: CanvasTextbox["fontStyle"]) => {
    setFontStyle(fontStyle);
    documentManager.changeObjectFontStyle(fontStyle);
  };

  return (
    <>
      <button
        aria-describedby="italic-tooltip"
        className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg hover:[&+*]:inline active:[&+*]:inline disabled:opacity-50 ${
          fontStyle === "italic"
            ? "bg-forground/15 text-primary-200 active:text-primary-500"
            : "hover:bg-forground/10 active:text-primary-500"
        }`}
        style={{ anchorName: "--italic-anchor" } as CSSProperties}
        disabled={!isSupportItalic}
        onClick={() => handleSetFontStyle(fontStyle === "italic" ? "normal" : "italic")}
      >
        <ItalicIcn className="size-5" />
        <span className="sm:hidden text-2xs">Italic</span>
      </button>

      {/* italic-tooltip */}
      <div
        id="italic-tooltip"
        className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
        style={
          {
            positionAnchor: "--italic-anchor",
          } as CSSProperties
        }
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
          {isSupportItalic ? "Italic" : "This font does not support italic"}
        </p>
      </div>
    </>
  );
};

export default FontStyleBar;
