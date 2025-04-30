import { DragEvent, useRef, useState } from "react";

interface dragggerEl extends HTMLElement {
  distance_from_left: number;
  distance_from_top: number;
}

function useDrag() {
  const [isDraging, setIsDraging] = useState(false);

  const dragPreviewEl = useRef<dragggerEl>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>) => {
    dragPreviewEl.current = e.currentTarget.cloneNode(true) as dragggerEl;

    dragPreviewEl.current.popover = "auto";
    // dragPreviewEl.current.style.pointerEvents = "none";
    dragPreviewEl.current.inert = true;
    dragPreviewEl.current.style.width = e.currentTarget.clientWidth + "px";
    dragPreviewEl.current.style.height = e.currentTarget.clientHeight + "px";

    const elementBoundingRect = e.currentTarget.getBoundingClientRect();
    dragPreviewEl.current.distance_from_left = e.clientX - elementBoundingRect.left;
    dragPreviewEl.current.distance_from_top = e.clientY - elementBoundingRect.top;

    document.body.appendChild(dragPreviewEl.current);

    e.dataTransfer.setDragImage(new Image(), 0, 0);

    setTimeout(() => {
      setIsDraging(true);
    }, 0);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    if (!dragPreviewEl.current) return;

    dragPreviewEl.current.showPopover();
    dragPreviewEl.current.style.left = `${e.pageX - dragPreviewEl.current.distance_from_left}px`;
    dragPreviewEl.current.style.top = `${e.pageY - dragPreviewEl.current.distance_from_top}px`;
  };

  const handleDragEnd = () => {
    setIsDraging(false);

    dragPreviewEl.current?.remove();
  };

  return { isDraging, handleDragStart, handleDrag, handleDragEnd };
}

export default useDrag;
