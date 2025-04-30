import { COLOR_IMG } from "@/constants";
import { IPopover } from "@/hooks/usePopover";
import { useRef } from "react";
import { soloidColors } from "../../../data/color";

function DrawingColorBar({
  drawingColor,
  setDrawingColor,
  myPopover,
}: {
  drawingColor: string;
  setDrawingColor: (color: string) => void;
  myPopover: IPopover<HTMLDialogElement>;
}) {
  const colorPickerRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-gr-multi-dark grid grid-cols-8 sm:grid-cols-3 gap-2 p-4 sm:p-2 sx:pt-6 rounded-3xl sm:rounded-2xl">
      <img
        loading="lazy"
        src={COLOR_IMG}
        alt="color"
        width={28}
        height={28}
        className="w-full aspect-square rounded-full cursor-pointer"
        onClick={() => colorPickerRef.current?.click()}
      />
      <input
        type="color"
        className="invisible absolute size-7 sm:size-6"
        ref={colorPickerRef}
        defaultValue={drawingColor as string}
        onChange={(e) => setDrawingColor(e.target.value)}
      />

      {soloidColors.map((color) => (
        <button
          key={color.name}
          popoverTarget={myPopover.popoverTarget}
          popoverTargetAction="hide"
          className={`w-full aspect-square rounded-full${drawingColor === color.color ? " border-3" : ""}`}
          style={{
            background: color.color,
            borderColor: drawingColor === color.color ? "var(--color-primary-400)" : "none",
          }}
          onClick={() => setDrawingColor(color.color)}
        />
      ))}
    </div>
  );
}

export default DrawingColorBar;
