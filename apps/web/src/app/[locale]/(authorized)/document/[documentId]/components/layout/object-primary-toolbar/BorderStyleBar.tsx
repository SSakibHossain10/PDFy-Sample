import { IPopover } from "@/hooks/usePopover";
import useTouchHold from "@/hooks/useTouchHold";
import { numberMax, numberMin } from "@/utils/number_formating";
import MinusIcon from "@icons/doutone/minus-fill.svg";
import PlusIcon from "@icons/doutone/plus-fill.svg";
import { ToggleEvent, useEffect, useState } from "react";
import { documentManager } from "../../../documentManager";
import { CanvasObject } from "../../../types/document";

export interface TborderStyle {
  strokeWidth: number;
  strokeDashArray: number[] | null;
}

const borderStyles = [
  {
    style: "solid",
    strokeDasharray: null,
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="1" x2="23" y1="50%" y2="50%" stroke="currentColor" stroke-width="2"></line></svg>`,
  },
  {
    style: "dashed",
    strokeDasharray: [4],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="-1" x2="25" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="12,2" stroke-width="2"></line></svg>`,
  },
  {
    style: "dotted",
    strokeDasharray: [3],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="1" x2="23" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="6,2" stroke-width="2"></line></svg>`,
  },
  {
    style: "dash-dot",
    strokeDasharray: [2],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="1" x2="23" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="4,2" stroke-width="2"></line></svg>`,
  },
];

const borderWidthSuggestions = [1, 2, 3, 5, 10, 15, 20, 30, 50, 100];

const BorderStyleBar = ({ myPopover }: { myPopover: IPopover<HTMLDialogElement> }) => {
  const [borderStyle, setBorderStyle] = useState<TborderStyle>({
    strokeWidth: 0,
    strokeDashArray: null,
  });

  const setStateHandler = () => {
    const activeobj = documentManager.currentCanvas.getActiveObject() as CanvasObject;
    setBorderStyle({
      strokeWidth: activeobj.strokeWidth || 0,
      strokeDashArray: activeobj.strokeDashArray || null,
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
    myPopover.popoverRef.current.addEventListener("beforetoggle", setStateOnPopoverOpen as unknown as EventListener);

    return () => {
      myPopover.popoverRef.current?.removeEventListener(
        "beforetoggle",
        setStateOnPopoverOpen as unknown as EventListener
      );
    };
  }, []);

  const handleBorderStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const borderWidth = e.target.valueAsNumber;
    setBorderStyle((prev) => ({ ...prev, strokeWidth: borderWidth }));
    documentManager.changeObjectBorderWidth(
      borderWidth,
      borderStyle.strokeDashArray
        ? borderStyle.strokeDashArray.map((dash) => dash * borderWidth)
        : borderStyle.strokeDashArray
    );
  };

  const handleBorderWidthIncrement = () => {
    setBorderStyle((prev) => {
      const strokeWidth = numberMax(+prev.strokeWidth + 1, 100);
      documentManager.changeObjectBorderWidth(
        strokeWidth,
        borderStyle.strokeDashArray
          ? borderStyle.strokeDashArray.map((dash) => dash * strokeWidth)
          : borderStyle.strokeDashArray
      );
      return { ...prev, strokeWidth };
    });
  };

  const handleBorderWidthDecrement = () => {
    setBorderStyle((prev) => {
      const strokeWidth = numberMin(+prev.strokeWidth - 1, 0);
      documentManager.changeObjectBorderWidth(
        strokeWidth,
        borderStyle.strokeDashArray
          ? borderStyle.strokeDashArray.map((dash) => dash * strokeWidth)
          : borderStyle.strokeDashArray
      );
      return { ...prev, strokeWidth };
    });
  };

  const handleChangeBorderWidth = (bordeWidth: number) => {
    setBorderStyle((prev) => ({ ...prev, strokeWidth: bordeWidth }));
    documentManager.changeObjectBorderWidth(
      bordeWidth,
      borderStyle.strokeDashArray
        ? borderStyle.strokeDashArray.map((dash) => dash * bordeWidth)
        : borderStyle.strokeDashArray
    );
  };

  const handleChangeStrokeDashArray = (
    strokeDashArray: number[] | null,
    strokeWidth = borderStyle.strokeWidth || 1
  ) => {
    setBorderStyle({ strokeDashArray, strokeWidth });
    documentManager.changeObjectStrokeDashArray(strokeDashArray);
  };

  const { handleholdStart: handleIncrementTouchStart, handleholdEnd: handleIncrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleBorderWidthIncrement,
  });
  const { handleholdStart: handleDecrementTouchStart, handleholdEnd: handleDecrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleBorderWidthDecrement,
  });

  return (
    <div className="sx:w-full sm:min-w-80 bg-gr-multi-dark flex flex-col sm:flex-col-reverse sx:rounded-2xl sm:rounded-xl overflow-hidden">
      <div className="flex justify-center gap-2.5 sm:gap-2 px-3 pt-4.5 sm:pt-1 sm:pb-2.5">
        <button
          data-selected={borderStyle.strokeWidth === 0}
          className="grow h-8 sm:w-10 sm:h-7 bg-primary-200/10 rounded-lg flex items-center justify-center cursor-pointer hover:text-primary-200 data-[selected=true]:bg-primary-200/25"
          onClick={() => handleChangeStrokeDashArray(null, 0)}
        >
          <svg className="size-7 sm:size-6 p-1.5 sm:p-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <circle cx={10} cy={10} r={8} fill="none" stroke="currentColor" strokeWidth={1.5} />
            <line x1={1} y1={10} x2={19} y2={10} stroke="currentColor" className="-rotate-45 origin-center" />
          </svg>
        </button>

        {borderStyles.map((style) => (
          <button
            data-selected={
              borderStyle.strokeWidth
                ? style.strokeDasharray
                  ? style.strokeDasharray?.toString() === borderStyle.strokeDashArray?.toString()
                  : !borderStyle.strokeDashArray && borderStyle.strokeWidth
                    ? true
                    : false
                : false
            }
            key={style.style}
            className="grow h-8 sm:w-10 sm:h-7 bg-primary-200/10 rounded-lg flex items-center justify-center cursor-pointer hover:text-primary-200 data-[selected=true]:bg-primary-200/25"
            onClick={() => handleChangeStrokeDashArray(style.strokeDasharray)}
            dangerouslySetInnerHTML={{ __html: style.icon }}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 p-2">
        <button
          className="shrink-0 active:text-primary-500 disabled:opacity-50"
          disabled={borderStyle.strokeWidth <= 0}
          onClick={handleBorderWidthDecrement}
          onTouchStart={handleDecrementTouchStart}
          onTouchEnd={handleDecrementTouchEnd}
          onMouseDown={handleDecrementTouchStart}
          onMouseUp={handleDecrementTouchEnd}
        >
          <MinusIcon className="size-9" />
        </button>

        <div className="grow flex flex-col gap-2 pb-3 pt-1">
          <div className="flex justify-center items-center gap-0.5">
            <input
              type="number"
              value={borderStyle.strokeWidth}
              min={0}
              max={100}
              onChange={handleBorderStyleChange}
              enterKeyHint="done"
              className="field-sizing-content text-sm"
            />
            <span className="text-sx">px</span>
          </div>

          <input
            type="range"
            value={borderStyle.strokeWidth}
            min={0}
            max={100}
            onChange={handleBorderStyleChange}
            list="border-style-suggestions-mobile"
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEndCapture={(e) => e.stopPropagation()}
          />
        </div>

        <button
          className="shrink-0 active:text-primary-500 disabled:opacity-50"
          disabled={borderStyle.strokeWidth >= 100}
          onClick={handleBorderWidthIncrement}
          onTouchStart={handleIncrementTouchStart}
          onTouchEnd={handleIncrementTouchEnd}
          onMouseDown={handleIncrementTouchStart}
          onMouseUp={handleIncrementTouchEnd}
        >
          <PlusIcon className="size-9" />
        </button>
      </div>

      <datalist
        id="border-style-suggestions-mobile"
        className="flex justify-evenly items-center bg-primary-200/5 overflow-x-auto scrollbar-hidden"
      >
        {borderWidthSuggestions.map((borderStyle) => (
          <option
            key={borderStyle}
            value={borderStyle}
            className="grow text-xs text-center px-2.5 py-1.5 active:bg-primary-200/10 border-r last:border-r-0 border-primary-200/5 cursor-pointer"
            onClick={() => handleChangeBorderWidth(borderStyle)}
          >
            {borderStyle}
          </option>
        ))}
      </datalist>
    </div>
  );
};

export default BorderStyleBar;
