import { IPopover } from "@/hooks/usePopover";
import { ToggleEvent, useEffect, useState } from "react";
import CanvasSignatureText from "../../../../classes/CanvasSignatureText";
import CanvasTextbox from "../../../../classes/CanvasTextbox";
import CanvasFeildInput from "../../../../classes/form/CanvasFeildInput";
import CanvasFeildSelect from "../../../../classes/form/CanvasFeildSelect";
import CanvasFeildSelectMultiple from "../../../../classes/form/CanvasFeildSelectMultiple";
import CanvasFeildTextarea from "../../../../classes/form/CanvasFeildTextarea";
import { documentManager } from "../../../../documentManager";

const OBJECTS_SHOULD_ACTIVE = [
  CanvasTextbox.type,
  CanvasSignatureText.type,
  CanvasFeildInput.type,
  CanvasFeildTextarea.type,
  CanvasFeildSelect.type,
  CanvasFeildSelectMultiple.type,
];

function FontFamilyBar({ parentPopover }: { parentPopover: IPopover<HTMLDivElement> }) {
  const [fontFamily, setFontFamily] = useState<CanvasTextbox["fontFamily"]>(
    "" as unknown as CanvasTextbox["fontFamily"]
  );

  const setStateHandler = () => {
    const activeObject = documentManager.currentCanvas.getActiveObject();

    if (OBJECTS_SHOULD_ACTIVE.includes(activeObject?.type as (typeof OBJECTS_SHOULD_ACTIVE)[number])) {
      setFontFamily((activeObject as CanvasTextbox).fontFamily);
    }
  };

  const setStateOnPopoverOpen = (e: ToggleEvent<HTMLDivElement>) => {
    if (e.newState === "open") {
      setStateHandler();

      documentManager.on("selection:updated", setStateHandler);
      documentManager.on("object:modified", setStateHandler);
    } else {
      documentManager.off("selection:updated", setStateHandler);
      documentManager.off("object:modified", setStateHandler);
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

  return (
    <h6 className="text-nowrap truncate" style={{ fontFamily: fontFamily }}>
      {fontFamily}
    </h6>
  );
}

export default FontFamilyBar;
