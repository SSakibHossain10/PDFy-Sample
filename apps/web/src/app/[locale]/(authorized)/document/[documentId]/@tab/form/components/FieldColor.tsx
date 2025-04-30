import { COLOR_IMG } from "@/constants";
import { IPopover } from "@/hooks/usePopover";
import { useRef } from "react";
import { soloidColors } from "../../../data/color";

function FieldColorPicker({
  fieldColor,
  setFieldColor,
  myPopover,
}: {
  fieldColor: string;
  setFieldColor: (color: string) => void;
  myPopover: IPopover<HTMLDialogElement>;
}) {
  const colorPickerRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-svw sm:w-50 sx:px-2 sx:pb-1 sm:pl-6">
      <div className="bg-gr-multi-dark grid grid-cols-8 sm:grid-cols-4 gap-2 p-4 sm:p-2 sx:pt-6 rounded-3xl">
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
          defaultValue={fieldColor as string}
          onChange={(e) => setFieldColor(e.target.value)}
        />

        {soloidColors.map((color) => (
          <button
            key={color.name}
            type="button"
            popoverTarget={myPopover.popoverTarget}
            popoverTargetAction="hide"
            className={`w-full aspect-square rounded-full${fieldColor === color.color ? " border-3" : ""}`}
            style={{
              background: color.color,
              borderColor: fieldColor === color.color ? "var(--color-primary-400)" : "none",
            }}
            onClick={() => setFieldColor(color.color)}
          />
        ))}
      </div>
    </div>
  );
}

export default FieldColorPicker;
