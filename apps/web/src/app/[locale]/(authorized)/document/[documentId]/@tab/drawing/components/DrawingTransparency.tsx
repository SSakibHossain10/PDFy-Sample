// import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import { IPopover } from "@/hooks/usePopover";
import useTouchHold from "@/hooks/useTouchHold";
import { numberMax, numberMin, numberToFixed } from "@/utils/number_formating";
import MinusIcon from "@icons/doutone/minus-fill.svg";
import PlusIcon from "@icons/doutone/plus-fill.svg";

const opacitySuggestions = [0.05, 0.1, 0.25, 0.5, 0.75, 0.9, 1];

const DrawingTransparency = ({
  opacity,
  onHndleSetOpacity,
  myPopover,
}: {
  opacity: number;
  onHndleSetOpacity: (opacity: number | ((opacity: number) => number)) => void;
  myPopover: IPopover<HTMLDialogElement>;
}) => {
  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const opacity = e.target.valueAsNumber;
    onHndleSetOpacity(opacity);
  };

  const handleOpacityIncrement = () => {
    onHndleSetOpacity((prev) => {
      const opacity = numberMax(+prev + 0.01, 1);
      return opacity;
    });
  };

  const handleOpacityDecrement = () => {
    onHndleSetOpacity((prev) => {
      const opacity = numberMin(+prev - 0.01, 0);
      return opacity;
    });
  };

  const handleChangeOpacity = (opacity: number) => {
    onHndleSetOpacity(opacity);
  };

  const { handleholdStart: handleIncrementTouchStart, handleholdEnd: handleIncrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleOpacityIncrement,
  });
  const { handleholdStart: handleDecrementTouchStart, handleholdEnd: handleDecrementTouchEnd } = useTouchHold({
    holdInterval: 25,
    onHold: handleOpacityDecrement,
  });

  return (
    <div className="bg-gr-multi-dark flex flex-col sm:flex-row-reverse sx:pt-1 rounded-2xl sm:rounded-xl overflow-hidden">
      <div className="flex sm:w-14 sm:flex-col-reverse items-center gap-3 p-2 sm:py-3">
        <button
          className="shrink-0 active:text-primary-500 disabled:opacity-50"
          disabled={opacity <= 0}
          onClick={handleOpacityDecrement}
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
              value={numberToFixed(opacity * 100, 1)}
              min={0}
              max={1}
              step={0.01}
              onChange={handleOpacityChange}
              enterKeyHint="done"
              className="field-sizing-content text-sm"
            />
            <span className="text-sx">%</span>
          </div>

          <div className="grow sm:aspect-square flex items-center">
            <input
              type="range"
              value={opacity}
              min={0}
              max={1}
              step={0.01}
              onChange={handleOpacityChange}
              className="w-full sm:rotate-90"
              list="opacity-suggestions"
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              onTouchEndCapture={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        <button
          className="shrink-0 active:text-primary-500 disabled:opacity-50"
          disabled={opacity >= 1}
          onClick={handleOpacityIncrement}
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
            value={numberToFixed(opacity * 100, 1)}
            min={0}
            max={1}
            step={0.01}
            onChange={handleOpacityChange}
            enterKeyHint="done"
            className="field-sizing-content text-sm"
          />
          <span className="text-sx">%</span>
        </div>
      </div>

      <datalist
        id="opacity-suggestions"
        className="z-10 grid grid-cols-7 sm:flex sm:flex-col-reverse sx:h-7 bg-gradient-to-l sm:bg-gradient-to-b from-primary-300/30 to-transparent"
      >
        {opacitySuggestions.map((opacity) => (
          <option
            key={opacity}
            value={opacity}
            className="sm:h-13 sm:w-7 sm:writing-mode-vertical-lr sm:rotate-180 flex justify-center items-center text-xs sm:text-[11px] font-light active:bg-primary-200/20 sx:border-r sm:border-b sx:last:border-r-0 sm:last:border-b-0 border-primary-300/20 cursor-pointer"
            onClick={() => {
              myPopover.popoverRef.current?.hidePopover();
              handleChangeOpacity(opacity);
            }}
          >
            {opacity * 100}%
          </option>
        ))}
      </datalist>
    </div>
  );
};

export default DrawingTransparency;
