"use client";

import {
  MARKER_DRAWING_DEFAULT_COLOR,
  MARKER_DRAWING_DEFAULT_OPACITY,
  MARKER_DRAWING_DEFAULT_WIDTH,
  PENCIL_DRAWING_DEFAULT_COLOR,
  PENCIL_DRAWING_DEFAULT_OPACITY,
  PENCIL_DRAWING_DEFAULT_WIDTH,
} from "@/constants/canvas";
import { colors } from "@/constants/colors";
import usePopover from "@/hooks/usePopover";
import useTouchVerticalSwiper from "@/hooks/useTouchVerticalSwiper";
import EraserIcon from "@icons/eraser.svg";
import MarkerIcon from "@icons/marker.svg";
import PencilIcon from "@icons/pencil.svg";
import OpacityIcn from "@public/icons/doutone/opacity.svg";
import { useParams, useRouter } from "next/navigation";
import { CSSProperties, RefObject, useEffect, useRef, useState } from "react";
import { BsBorderWidth, BsCursorFill } from "react-icons/bs";
import { FaCircle } from "react-icons/fa6";
import { TborderStyle } from "../../components/layout/object-primary-toolbar/BorderStyleBar";
import { documentManager } from "../../documentManager";
import DrawingColor from "./components/DrawingColor";
import DrawingTransparency from "./components/DrawingTransparency";
import DrawingWeightStyle from "./components/DrawingWeightStyle";

const DrawingSlot = () => {
  const drawingSlotLauout = useRef<HTMLDivElement>(null);

  const drawingColorBarPopover = usePopover<HTMLDialogElement>();
  const opacityPopover = usePopover<HTMLDialogElement>();
  const borderStylePopover = usePopover<HTMLDialogElement>();

  const [drawingMode, setDrawingMode] = useState<"pencil" | "marker" | "eraser" | "select">("pencil");

  const [pencilDrawingColor, setPencilDrawingColor] = useState<string>(
    documentManager.freeDrawingPancilBrush?.color || PENCIL_DRAWING_DEFAULT_COLOR
  );
  const [markerDrawingColor, setMarkerDrawingColor] = useState<string>(
    documentManager.freeDrawingMarkerBrush?.color || MARKER_DRAWING_DEFAULT_COLOR
  );

  const [pencilDrawingOpacity, setPencilDrawingOpacity] = useState(
    documentManager.freeDrawingPancilBrush?.opacity || PENCIL_DRAWING_DEFAULT_OPACITY
  );
  const [markerDrawingOpacity, setMarkerDrawingOpacity] = useState(
    documentManager.freeDrawingMarkerBrush?.opacity || MARKER_DRAWING_DEFAULT_OPACITY
  );

  const [pencilDrawingWeightStyle, setPencilDrawingWeightStyle] = useState<TborderStyle>({
    strokeWidth: documentManager.freeDrawingPancilBrush?.width || PENCIL_DRAWING_DEFAULT_WIDTH,
    strokeDashArray: documentManager.freeDrawingPancilBrush?.strokeDashArray || null,
  });
  const [markerDrawingWeightStyle, setMarkerDrawingWeightStyle] = useState<TborderStyle>({
    strokeWidth: documentManager.freeDrawingMarkerBrush?.width || MARKER_DRAWING_DEFAULT_WIDTH,
    strokeDashArray: documentManager.freeDrawingMarkerBrush?.strokeDashArray || null,
  });

  const handleSelelectPencil = () => {
    documentManager.setDrawingMode("pencil");
    setDrawingMode("pencil");
  };

  const handleSelelectMarker = () => {
    documentManager.setDrawingMode("marker");
    setDrawingMode("marker");
  };

  const handleSelelectEraser = () => {
    documentManager.setDrawingMode("eraser");
    setDrawingMode("eraser");
  };

  const handleSelelectSelect = () => {
    documentManager.setDrawingSelectMode();
    setDrawingMode("select");
  };

  const handleSetPencilDrawingColor = (color: string) => {
    setPencilDrawingColor(color);
    documentManager.setDrawingColor(color, "pencil");
  };
  const handleSetMarkerDrawingColor = (color: string) => {
    setMarkerDrawingColor(color);
    documentManager.setDrawingColor(color, "marker");
  };

  const handleSetPencilDrawingOpacity = (opacity: number | ((opacity: number) => number)) => {
    if (typeof opacity === "function") {
      return setPencilDrawingOpacity((prevState: number) => {
        documentManager.setDrawingOpacity(prevState, "pencil");
        return opacity(prevState);
      });
    }

    documentManager.setDrawingOpacity(opacity, "pencil");
    setPencilDrawingOpacity(opacity);
  };
  const handleSetMarkerDrawingOpacity = (opacity: number | ((opacity: number) => number)) => {
    if (typeof opacity === "function") {
      return setMarkerDrawingOpacity((prevState: number) => {
        documentManager.setDrawingOpacity(prevState, "marker");
        return opacity(prevState);
      });
    }

    documentManager.setDrawingOpacity(opacity, "marker");
    setMarkerDrawingOpacity(opacity);
  };

  const handleSetPencilDrawingWeightStyle = (
    weightStyle: TborderStyle | ((weightStyle: TborderStyle) => TborderStyle)
  ) => {
    if (typeof weightStyle === "function") {
      return setPencilDrawingWeightStyle((prevState) => {
        documentManager.setDrawingWeightStyle(
          {
            strokeWidth: prevState.strokeWidth,
            strokeDashArray: prevState.strokeDashArray
              ? prevState.strokeDashArray.map((dash) => dash * prevState.strokeWidth)
              : prevState.strokeDashArray,
          },
          "pencil"
        );
        return weightStyle(prevState);
      });
    }

    documentManager.setDrawingWeightStyle(
      {
        strokeWidth: weightStyle.strokeWidth,
        strokeDashArray: weightStyle.strokeDashArray
          ? weightStyle.strokeDashArray.map((dash) => dash * weightStyle.strokeWidth)
          : weightStyle.strokeDashArray,
      },
      "pencil"
    );
    setPencilDrawingWeightStyle(weightStyle);
  };
  const handleSetMarkerDrawingWeightStyle = (
    weightStyle: TborderStyle | ((weightStyle: TborderStyle) => TborderStyle)
  ) => {
    if (typeof weightStyle === "function") {
      return setMarkerDrawingWeightStyle((prevState) => {
        documentManager.setDrawingWeightStyle(
          {
            strokeWidth: prevState.strokeWidth,
            strokeDashArray: prevState.strokeDashArray
              ? prevState.strokeDashArray.map((dash) => dash * prevState.strokeWidth)
              : prevState.strokeDashArray,
          },
          "marker"
        );
        return weightStyle(prevState);
      });
    }

    documentManager.setDrawingWeightStyle(
      {
        strokeWidth: weightStyle.strokeWidth,
        strokeDashArray: weightStyle.strokeDashArray
          ? weightStyle.strokeDashArray.map((dash) => dash * weightStyle.strokeWidth)
          : weightStyle.strokeDashArray,
      },
      "marker"
    );
    setMarkerDrawingWeightStyle(weightStyle);
  };

  useEffect(() => {
    handleSelelectPencil(); // default pencil
    return () => {
      documentManager.exitDrawingMode(); // exit drawing mode on unmount
    };
  }, []);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    (drawingSlotLauout as RefObject<HTMLDivElement>).current.style.removeProperty("height");
    (drawingSlotLauout as RefObject<HTMLDivElement>).current.style.removeProperty("maxHeight");
  }, []);

  const closeTabPanlel = () => {
    router.replace(`/document/${params.documentId}/edit`);
  };

  const {
    onTouchStart: drawingSlotOnTouchStart,
    onTouchMove: drawingSlotOnTouchMove,
    onTouchEndCapture: drawingSlotOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: closeTabPanlel,
    layoutRef: drawingSlotLauout as unknown as RefObject<HTMLElement>,
    resetHeightAfterClose: false,
  });

  const {
    onTouchStart: colorOnTouchStart,
    onTouchMove: colorOnTouchMove,
    onTouchEndCapture: colorOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => drawingColorBarPopover.popoverRef.current?.hidePopover(),
    layoutRef: drawingColorBarPopover.popoverRef,
  });

  const {
    onTouchStart: opacityOnTouchStart,
    onTouchMove: opacityOnTouchMove,
    onTouchEndCapture: opacityOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => opacityPopover.popoverRef.current?.hidePopover(),
    layoutRef: opacityPopover.popoverRef,
  });

  const {
    onTouchStart: weightStyleOnTouchStart,
    onTouchMove: weightStyleOnTouchMove,
    onTouchEndCapture: weightStyleOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => borderStylePopover.popoverRef.current?.hidePopover(),
    layoutRef: borderStylePopover.popoverRef,
  });

  return (
    <div
      className="absolute sx:left-0 sm:left-15.5 sx:right-0 sx:bottom-13 sx:pb-1 sm:bottom-0 sm:top-0 w-fit h-fit m-auto flex flex-col sm:justify-center"
      id="drawing-slot"
      ref={drawingSlotLauout}
      onTouchStart={drawingSlotOnTouchStart}
      onTouchMove={drawingSlotOnTouchMove}
      onTouchEndCapture={drawingSlotOnTouchEndCapture}
    >
      <div className="sm:hidden pt-1 -mb-1.75 flex justify-center z-10">
        <span className="h-0.75 w-10 rounded-full bg-primary-200/50" />
      </div>
      <div
        className="bg-gr-multi-dark flex sm:flex-col justify-center items-center gap-1 sm:gap-2 px-2 sm:px-1 py-0.25 sm:py-3 rounded-3xl"
        style={{ anchorName: "--drawing-slot" } as CSSProperties}
      >
        {/* pen */}
        <button
          aria-describedby="pen-tooltip"
          data-selected={drawingMode === "pencil"}
          className="size-10 flex justify-center items-center data-[selected=true]:bg-primary-50/15 rounded-full hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
          style={{ anchorName: "--pen-anchor" } as CSSProperties}
          onClick={handleSelelectPencil}
        >
          <PencilIcon className="size-5.5" />
        </button>
        {/* pen-tooltip */}
        <div
          id="pen-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[right]"
          style={{ positionAnchor: "--pen-anchor" } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-4 sm:ml-2 text-sm text-nowrap rounded-2xl shadow-lg">
            Pen
          </p>
        </div>

        {/* marker  */}
        <button
          aria-describedby="marker-tooltip"
          data-selected={drawingMode === "marker"}
          className="size-10 flex justify-center items-center data-[selected=true]:bg-primary-50/15 rounded-full hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
          style={{ anchorName: "--marker-anchor" } as CSSProperties}
          onClick={handleSelelectMarker}
        >
          <MarkerIcon className="size-5.5" />
        </button>
        {/* marker-tooltip */}
        <div
          id="marker-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[right]"
          style={{ positionAnchor: "--marker-anchor" } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-4 sm:ml-2 text-sm text-nowrap rounded-2xl shadow-lg">
            Marker
          </p>
        </div>

        {/* eraser */}
        <button
          aria-describedby="eraser-tooltip"
          data-selected={drawingMode === "eraser"}
          className="size-10 flex justify-center items-center data-[selected=true]:bg-primary-50/15 rounded-full hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
          style={{ anchorName: "--eraser-anchor" } as CSSProperties}
          onClick={handleSelelectEraser}
        >
          <EraserIcon className="size-6 -ml-0.5 mr-0.5" />
        </button>
        {/* eraser-tooltip */}
        <div
          id="eraser-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[right]"
          style={{ positionAnchor: "--eraser-anchor" } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-4 sm:ml-2 text-sm text-nowrap rounded-2xl shadow-lg">
            Eraser
          </p>
        </div>

        {/* select */}
        <button
          aria-describedby="select-tooltip"
          data-selected={drawingMode === "select"}
          className="size-10 flex justify-center items-center data-[selected=true]:bg-primary-50/15 rounded-full hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
          style={{ anchorName: "--select-anchor" } as CSSProperties}
          onClick={handleSelelectSelect}
        >
          <BsCursorFill className="size-5 -scale-x-100" />
        </button>
        {/* select-tooltip */}
        <div
          id="select-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[right]"
          style={{ positionAnchor: "--select-anchor" } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-4 sm:ml-2 text-sm text-nowrap rounded-2xl shadow-lg">
            Select
          </p>
        </div>

        {/* color */}
        <dialog
          popover="auto"
          id={drawingColorBarPopover.id}
          ref={drawingColorBarPopover.popoverRef}
          onTouchStart={colorOnTouchStart}
          onTouchMove={colorOnTouchMove}
          onTouchEndCapture={colorOnTouchEndCapture}
          className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-left sx:position-area-top sm:position-area-[right] w-[calc(100dvw-16px)] sm:w-35 sx:mx-2 sx:mb-1 sm:ml-1 open:[&+*]:bg-forground/15"
          style={{ positionAnchor: "--drawing-slot" } as CSSProperties}
        >
          <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />

          <DrawingColor
            myPopover={drawingColorBarPopover}
            drawingColor={drawingMode === "marker" ? markerDrawingColor : pencilDrawingColor}
            setDrawingColor={drawingMode === "marker" ? handleSetMarkerDrawingColor : handleSetPencilDrawingColor}
          />
        </dialog>
        {/* color popover action btn */}
        <button
          aria-describedby="color-tooltip"
          popoverTarget={drawingColorBarPopover.popoverTarget}
          className="size-10 flex justify-center items-center rounded-full hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline disabled:opacity-50"
          style={{ anchorName: "--color-btn" } as CSSProperties}
          disabled={drawingMode === "eraser" || drawingMode === "select"}
        >
          <FaCircle
            className="size-5"
            style={{
              color:
                drawingMode === "pencil"
                  ? pencilDrawingColor
                  : drawingMode === "marker"
                    ? markerDrawingColor
                    : colors.primary[500],
            }}
          />
        </button>
        {/* color-tooltip */}
        <div
          id="color-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[right]"
          style={{ positionAnchor: "--color-btn" } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-4 sm:ml-2 text-sm text-nowrap rounded-2xl shadow-lg">
            {drawingMode === "eraser" || drawingMode === "select" ? "Select pen or marker" : "Color"}
          </p>
        </div>

        {/* opacity */}
        <dialog
          popover="auto"
          id={opacityPopover.id}
          ref={opacityPopover.popoverRef}
          onTouchStart={opacityOnTouchStart}
          onTouchMove={opacityOnTouchMove}
          onTouchEndCapture={opacityOnTouchEndCapture}
          className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-left sx:position-area-top sm:position-area-[right] sx:w-[calc(100dvw-16px)] sx:mx-2 sx:mb-1 sm:ml-1 open:[&+*]:bg-forground/15"
          style={{ positionAnchor: "--drawing-slot" } as CSSProperties}
        >
          <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />

          <DrawingTransparency
            myPopover={opacityPopover}
            opacity={drawingMode === "marker" ? markerDrawingOpacity : pencilDrawingOpacity}
            onHndleSetOpacity={drawingMode === "marker" ? handleSetMarkerDrawingOpacity : handleSetPencilDrawingOpacity}
          />
        </dialog>
        {/* opactiy popover action btn */}
        <button
          aria-describedby="transparency-tooltip"
          popoverTarget={opacityPopover.popoverTarget}
          className="size-10 flex justify-center items-center rounded-full hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline disabled:opacity-50"
          style={{ anchorName: "--opacity-btn" } as CSSProperties}
          disabled={drawingMode === "eraser" || drawingMode === "select"}
        >
          <OpacityIcn className="size-5" />
        </button>
        {/* transparency-tooltip */}
        <div
          id="transparency-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[right]"
          style={{ positionAnchor: "--opacity-btn" } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-4 sm:ml-2 text-sm text-nowrap rounded-2xl shadow-lg">
            {drawingMode === "eraser" || drawingMode === "select" ? "Select pen or marker" : "Transparency"}
          </p>
        </div>

        {/* stroke style */}
        <dialog
          popover="auto"
          id={borderStylePopover.id}
          ref={borderStylePopover.popoverRef}
          onTouchStart={weightStyleOnTouchStart}
          onTouchMove={weightStyleOnTouchMove}
          onTouchEndCapture={weightStyleOnTouchEndCapture}
          className="sx:popover-animation-translate-from-bottom sm:popover-animation-translate-from-left sx:position-area-top sm:position-area-[right] sx:w-[calc(100dvw-16px)] sx:mx-2 sx:mb-1 sm:ml-1 open:[&+*]:bg-forground/15"
          style={{ positionAnchor: "--drawing-slot" } as CSSProperties}
        >
          <span className="absolute sm:hidden top-1.25 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />

          <DrawingWeightStyle
            myPopover={borderStylePopover}
            borderStyle={drawingMode === "marker" ? markerDrawingWeightStyle : pencilDrawingWeightStyle}
            onHndleSetBorderStyle={
              drawingMode === "marker" ? handleSetMarkerDrawingWeightStyle : handleSetPencilDrawingWeightStyle
            }
          />
        </dialog>
        {/* style popover action btn */}
        <button
          aria-describedby="style-tooltip"
          popoverTarget={borderStylePopover.popoverTarget}
          className="size-10 flex justify-center items-center rounded-full hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline disabled:opacity-50"
          style={{ anchorName: "--weight-settings-btn" } as CSSProperties}
          disabled={drawingMode === "eraser" || drawingMode === "select"}
        >
          <BsBorderWidth className="size-5 -scale-y-110" />
        </button>
        {/* style-tooltip */}
        <div
          id="style-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[right]"
          style={{ positionAnchor: "--weight-settings-btn" } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-4 sm:ml-2 text-sm text-nowrap rounded-2xl shadow-lg">
            {drawingMode === "eraser" || drawingMode === "select" ? "Select pen or marker" : "Weight & Style"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DrawingSlot;
