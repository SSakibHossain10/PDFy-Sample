import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import useDrag from "@/hooks/useDrag";
import { IPopover } from "@/hooks/usePopover";
import { DragEvent, ToggleEvent, useEffect, useState } from "react";
import { IoReorderThreeOutline } from "react-icons/io5";
import { CanvasObject } from "../../../../types/document";
import { SVG_HEIGHT, SVG_WIDTH } from "./LayerPanel";

function LayerAllPanel({ parentPopover }: { parentPopover: IPopover<HTMLDialogElement> }) {
  const [layerObjects, setLayerObjects] = useState<{ svg: string; object: CanvasObject; isActiveObj: boolean }[]>([]);
  const { isDraging, handleDragStart, handleDrag, handleDragEnd } = useDrag();

  const setStateHandler = () => {
    const activeObject = documentManager.currentCanvas.getActiveObject();
    (async () => {
      Promise.all(
        documentManager.currentCanvas
          .getObjects()
          .reverse()
          .map(async (object) => {
            const newObj = await object.clone();

            newObj.setX(0);
            newObj.setY(0);
            newObj.scaleToHeight(SVG_HEIGHT - newObj.strokeWidth);

            if (newObj.width * newObj.scaleX > SVG_WIDTH) {
              newObj.scaleToWidth(SVG_WIDTH - newObj.strokeWidth);
            }

            const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${
              (newObj.width + newObj.strokeWidth) * newObj.scaleX
            }" height="${(newObj.height + newObj.strokeWidth) * newObj.scaleY}">
                ${
                  //@ts-expect-error
                  newObj.toSVG()
                }
              </svg>`;

            return { svg, object, isActiveObj: object === activeObject };
          })
      ).then((layerObjects) => setLayerObjects(layerObjects));
    })();
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

  const handleDropOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.setAttribute("data-dragging", true as unknown as string);
  };

  const handleDropLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.currentTarget.removeAttribute("data-dragging");
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();

    const draggedIndex = Number(e.dataTransfer.getData("aplication/layer-index"));

    const draggedObject = layerObjects[draggedIndex];

    const updatedObjects = layerObjects;
    updatedObjects.splice(draggedIndex, 1); // remove from drag
    updatedObjects.splice(dropIndex - (draggedIndex < dropIndex ? 1 : 0), 0, draggedObject); // add to drop

    setLayerObjects(updatedObjects);

    e.currentTarget.removeAttribute("data-dragging");

    console.log("draggedIndex", e.dataTransfer.getData("aplication/layer-index"));

    documentManager.changeObjectLayerOrder(draggedObject.object, layerObjects.length - dropIndex);

    setStateHandler();
  };

  return (
    <div className="grow w-full min-h-42 flex flex-col gap-3 pt-3 sm:pt-4 overflow-auto relative">
      {/* top dropable area */}
      <div
        className={`absolute left-0 -top-6 w-full h-15 px-2 sm:px-4 flex items-center opacity-0 data-dragging:opacity-100 transition-opacity ${
          isDraging ? "z-20" : "z-0"
        }`}
        onDragLeave={handleDropLeave}
        onDragOver={handleDropOver}
        onDrop={(e) => handleDrop(e, 0)}
      >
        <div className="w-full h-1 bg-primary-500" />
      </div>

      {layerObjects.map(({ svg, object, isActiveObj }, indx) => (
        <div className="shrink-0 w-full h-13 px-2 sm:px-4 relative" key={indx}>
          {/* //content */}
          <div
            draggable
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            onDragStart={(e) => {
              handleDragStart(e);
              e.dataTransfer.setData("aplication/layer-index", indx as unknown as string);
              e.currentTarget.classList.add("animate-bounce"); //@ts-expect-error
              setTimeout(() => e.target.classList.remove("animate-bounce"), 100);
            }}
            className={`relative z-10 h-full flex justify-between items-center gap-1 px-2 bg-primary-50/15 rounded-lg cursor-pointer hover:ring-1 ring-primary-200/50${
              isActiveObj ? " ring-2" : ""
            }`}
            onClick={() => {
              console.log("clicked");

              documentManager.changeActiveObject(object);
            }}
          >
            <IoReorderThreeOutline className="shrink-0 size-7 p-1" />
            <div dangerouslySetInnerHTML={{ __html: svg }} />
            <span className="size-7" />
          </div>

          {/* dropable area */}
          <div
            className={`absolute left-0 -bottom-9 w-full h-15 px-2 sm:px-4 flex items-center opacity-0 data-dragging:opacity-100 transition-opacity ${
              isDraging ? "z-20" : "z-0"
            }`}
            onDragLeave={handleDropLeave}
            onDragOver={handleDropOver}
            onDrop={(e) => handleDrop(e, indx + 1)}
          >
            <div className="w-full h-1 bg-primary-500" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LayerAllPanel;
