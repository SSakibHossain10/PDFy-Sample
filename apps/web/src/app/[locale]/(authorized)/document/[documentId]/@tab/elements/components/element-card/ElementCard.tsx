"use client";

import { TGetElementCategoryItemsRespose } from "@/app/api/element/get-categories-elements/route";
import { documentManager } from "../../../../documentManager";

const ElementCard = ({
  element,
  display,
}: {
  element: TGetElementCategoryItemsRespose["category_elements"][0];
  display: "inside-category" | "independent";
}) => {
  const handleAddElement = () => {
    if (!documentManager.currentCanvas) return;

    switch (element.type) {
      case "RECT":
        documentManager.addRectElement({
          width: element.src.width,
          height: element.src.height,
          rx: element.src.rx,
          ry: element.src.ry,
        });
        break;
      case "CIRCLE":
        documentManager.addCircleElement({
          radius: element.src.r,
        });
        break;
      case "LINE":
        documentManager.addLineElement([element.src.x1, element.src.y1, element.src.x2, element.src.y2], {
          stroke: "black",
          strokeWidth: 2,
        });
        break;
      case "PATH":
        documentManager.addPathElement(element.src.d);
        break;
    }
  };

  let Icon: JSX.Element | null;

  switch (element.type) {
    case "RECT":
      Icon = (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-[85%] h-[85%]">
          <rect {...element.src} fill="currentColor" />
        </svg>
      );
      break;
    case "CIRCLE":
      Icon = (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-[85%] h-[85%]">
          <circle {...element.src} fill="currentColor" />
        </svg>
      );
      break;
    case "LINE":
      Icon = (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-[85%] h-[85%]">
          <line {...element.src} stroke="currentColor" strokeWidth={2} />
        </svg>
      );
      break;
    case "PATH":
      Icon = (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-[85%] h-[85%]">
          <path {...element.src} fill="currentColor" />
        </svg>
      );
      break;

    default:
      Icon = null;
      break;
  }

  return (
    <button
      className={`snap-center flex-none ${display === "independent" ? "w-full" : "w-[18%] sm:w-[22.5%]"} aspect-square flex justify-center items-center rounded relative`}
      onClick={handleAddElement}
    >
      {Icon}
    </button>
  );
};

export default ElementCard;
