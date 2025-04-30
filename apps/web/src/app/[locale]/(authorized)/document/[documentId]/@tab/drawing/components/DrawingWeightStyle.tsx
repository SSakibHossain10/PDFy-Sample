import { IPopover } from "@/hooks/usePopover";
import useTouchHold from "@/hooks/useTouchHold";
import { numberMax, numberMin } from "@/utils/number_formating";
import MinusIcon from "@icons/doutone/minus-fill.svg";
import PlusIcon from "@icons/doutone/plus-fill.svg";

export interface TborderStyle {
  strokeWidth: number;
  strokeDashArray: number[] | null;
}

const borderStyles = [
  {
    style: "solid",
    strokeDasharray: null,
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="sm:rotate-90"><line x1="1" x2="23" y1="50%" y2="50%" stroke="currentColor" stroke-width="2"></line></svg>`,
  },
  {
    style: "dashed",
    strokeDasharray: [4],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="sm:rotate-90"><line x1="-1" x2="25" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="12,2" stroke-width="2"></line></svg>`,
  },
  {
    style: "dotted",
    strokeDasharray: [3],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="sm:rotate-90"><line x1="1" x2="23" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="6,2" stroke-width="2"></line></svg>`,
  },
  {
    style: "dash-dot",
    strokeDasharray: [2],
    icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="sm:rotate-90"><line x1="1" x2="23" y1="50%" y2="50%" stroke="currentColor" stroke-dasharray="4,2" stroke-width="2"></line></svg>`,
  },
];

const borderWidthSuggestions = [1, 2, 3, 5, 10, 15, 20, 30, 50, 100];

const DrawingWeightStyle = ({
  borderStyle,
  onHndleSetBorderStyle,
  myPopover,
}: {
  borderStyle: TborderStyle;
  onHndleSetBorderStyle: (strokeProp: TborderStyle | ((strokeProp: TborderStyle) => TborderStyle)) => void;
  myPopover: IPopover<HTMLDialogElement>;
}) => {
  const handleBorderStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const borderWidth = e.target.valueAsNumber;
    onHndleSetBorderStyle({ strokeDashArray: borderStyle.strokeDashArray, strokeWidth: borderWidth });
  };

  const handleBorderWidthIncrement = () => {
    onHndleSetBorderStyle((prev) => {
      const strokeWidth = numberMax(+prev.strokeWidth + 1, 100);
      return { ...prev, strokeWidth };
    });
  };

  const handleBorderWidthDecrement = () => {
    onHndleSetBorderStyle((prev) => {
      const strokeWidth = numberMin(+prev.strokeWidth - 1, 1);
      return { ...prev, strokeWidth };
    });
  };

  const handleChangeBorderWidth = (bordeWidth: number) => {
    onHndleSetBorderStyle({ strokeDashArray: borderStyle.strokeDashArray, strokeWidth: bordeWidth });
  };

  const handleChangeStrokeDashArray = (
    strokeDashArray: number[] | null,
    strokeWidth = borderStyle.strokeWidth || 1
  ) => {
    onHndleSetBorderStyle({ strokeDashArray, strokeWidth });
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
    <div className="bg-gr-multi-dark flex flex-col sm:flex-row-reverse sx:pt-1 rounded-2xl sm:rounded-xl overflow-hidden">
      <div className="flex sm:flex-col justify-center gap-2.5 sm:gap-2 sx:p-3 sm:pl-2 sx:pb-0">
        {borderStyles.map((style) => (
          <button
            data-selected={
              style.strokeDasharray
                ? style.strokeDasharray?.toString() === borderStyle.strokeDashArray?.toString()
                : !borderStyle.strokeDashArray && borderStyle.strokeWidth
                  ? true
                  : false
            }
            key={style.style}
            className="grow sx:h-8 sm:w-8 bg-primary-200/10 rounded-lg flex items-center justify-center cursor-pointer hover:text-primary-200 data-[selected=true]:bg-primary-200/25"
            onClick={() => handleChangeStrokeDashArray(style.strokeDasharray)}
            dangerouslySetInnerHTML={{ __html: style.icon }}
          />
        ))}
      </div>

      <div className="flex sm:w-16 sm:flex-col-reverse items-center gap-3 p-2 sm:py-3 sm:pl-4">
        <button
          className="shrink-0 active:text-primary-500 disabled:opacity-50"
          disabled={borderStyle.strokeWidth <= 1}
          onClick={handleBorderWidthDecrement}
          onTouchStart={handleDecrementTouchStart}
          onTouchEnd={handleDecrementTouchEnd}
          onMouseDown={handleDecrementTouchStart}
          onMouseUp={handleDecrementTouchEnd}
        >
          <MinusIcon className="size-9" />
        </button>

        <div className="grow flex flex-col sm:justify-center sm:flex-row-reverse gap-2 sx:pb-3 sx:pt-1">
          <div className="sm:hidden flex justify-center items-center gap-0.5">
            <input
              type="number"
              value={borderStyle.strokeWidth}
              min={1}
              max={100}
              onChange={handleBorderStyleChange}
              enterKeyHint="done"
              className="field-sizing-content text-sm"
            />
            <span className="text-sx">px</span>
          </div>

          <div className="grow sm:aspect-square flex items-center">
            <input
              type="range"
              value={borderStyle.strokeWidth}
              min={1}
              max={100}
              onChange={handleBorderStyleChange}
              className="w-full sm:rotate-90"
              list="border-style-suggestions-mobile"
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEndCapture={(e) => e.stopPropagation()}
            />
          </div>
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

        <div className="sx:hidden flex justify-center items-center gap-0.5">
          <input
            type="number"
            value={borderStyle.strokeWidth}
            min={1}
            max={100}
            onChange={handleBorderStyleChange}
            enterKeyHint="done"
            className="field-sizing-content text-sm"
          />
          <span className="text-sx">px</span>
        </div>
      </div>

      <datalist
        id="border-style-suggestions-mobile"
        className="z-10 flex sm:flex-col-reverse justify-evenly items-center bg-primary-200/5 overflow-x-auto scrollbar-hidden"
      >
        {borderWidthSuggestions.map((borderStyle) => (
          <option
            key={borderStyle}
            value={borderStyle}
            className="grow sm:w-full text-xs sm:text-[11px] text-center px-2.5 sm:px-1 py-1.5 sm:py-3 active:bg-primary-200/10 sx:border-r sm:border-t sx:last:border-r-0 sm:last:border-t-0 border-primary-200/5 cursor-pointer"
            onClick={() => {
              myPopover.popoverRef.current?.hidePopover();
              handleChangeBorderWidth(borderStyle);
            }}
          >
            {borderStyle}
          </option>
        ))}
      </datalist>
    </div>
  );
};

export default DrawingWeightStyle;
