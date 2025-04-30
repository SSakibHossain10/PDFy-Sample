import { BLACK_COLOR } from "@/constants/colors";
import { FIELD_DEFAULT_BACKGROUND_COLOR, FIELD_DEFAULT_BORDER_COLOR } from "@/constants/pdf";
import usePopover, { IPopover } from "@/hooks/usePopover";
import useTouchVerticalSwiper from "@/hooks/useTouchVerticalSwiper";
import CloseIcn from "@icons/doutone/close-circle.svg";
import Deleteicn from "@icons/doutone/delete-fill.svg";
import { CSSProperties, RefObject, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import CanvasFeildCheckbox from "../../../classes/form/CanvasFeildCheckbox";
import CanvasFeildInput from "../../../classes/form/CanvasFeildInput";
import CanvasFeildRadio from "../../../classes/form/CanvasFeildRadio";
import CanvasFeildSelect from "../../../classes/form/CanvasFeildSelect";
import CanvasFeildSelectMultiple from "../../../classes/form/CanvasFeildSelectMultiple";
import CanvasFeildTextarea from "../../../classes/form/CanvasFeildTextarea";
import FieldColorPicker from "./FieldColor";

const FileldSettingsModal = ({
  fieldType,
  myPopover,
}: {
  fieldType:
    | CanvasFeildInput["type"]
    | CanvasFeildTextarea["type"]
    | CanvasFeildSelect["type"]
    | CanvasFeildSelectMultiple["type"]
    | CanvasFeildCheckbox["type"]
    | CanvasFeildRadio["type"];
  myPopover: IPopover<HTMLDialogElement>;
}) => {
  const [fieldFontSize, setFieldFontSize] = useState(16);

  const handleChangeFontSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldFontSize(e.target.valueAsNumber);
  };

  const [fieldBorderWidth, setFieldBorderWidth] = useState(1);

  const handleChangeBorderWidth = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldBorderWidth(e.target.valueAsNumber);
  };

  const fieldBorderColorBarPopover = usePopover<HTMLDialogElement>();

  const [fieldBorderColor, setFieldBorderColor] = useState(FIELD_DEFAULT_BORDER_COLOR);

  const {
    onTouchStart: borderColorOnTouchStart,
    onTouchMove: borderColorOnTouchMove,
    onTouchEndCapture: borderColorOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => fieldBorderColorBarPopover.popoverRef.current?.hidePopover(),
    layoutRef: fieldBorderColorBarPopover.popoverRef,
  });

  const fieldTextColorBarPopover = usePopover<HTMLDialogElement>();

  const [fieldTextColor, setFieldTextColor] = useState(BLACK_COLOR);

  const {
    onTouchStart: textColorOnTouchStart,
    onTouchMove: textColorOnTouchMove,
    onTouchEndCapture: textColorOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => fieldTextColorBarPopover.popoverRef.current?.hidePopover(),
    layoutRef: fieldTextColorBarPopover.popoverRef,
  });

  const fieldBackgroundColorBarPopover = usePopover<HTMLDialogElement>();

  const [fieldBackgroundColor, setFieldBackgroundColor] = useState(FIELD_DEFAULT_BACKGROUND_COLOR);

  const {
    onTouchStart: backgroundColorOnTouchStart,
    onTouchMove: backgroundColorOnTouchMove,
    onTouchEndCapture: backgroundColorOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => fieldBackgroundColorBarPopover.popoverRef.current?.hidePopover(),
    layoutRef: fieldBackgroundColorBarPopover.popoverRef,
  });

  const newOptionInputEl = useRef(null) as unknown as RefObject<HTMLInputElement>;

  const [fieldOptions, setFieldOptions] = useState([
    { displayValue: "Option 1", exportValue: "Option 1" },
    { displayValue: "Option 2", exportValue: "Option 2" },
    { displayValue: "Option 3", exportValue: "Option 3" },
  ]);
  const handleChangeFieldOption = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newFieldOptions = [...fieldOptions];

    newFieldOptions[index] = {
      displayValue: e.target.value,
      exportValue: e.target.value,
    };

    setFieldOptions(newFieldOptions);
  };

  const handleDeleteFieldOption = (index: number) => {
    const newFieldOptions = [...fieldOptions];

    newFieldOptions.splice(index, 1);

    setFieldOptions(newFieldOptions);
  };

  const handleAddFieldOption = () => {
    setFieldOptions((state) => [
      ...state,
      {
        displayValue: newOptionInputEl.current.value,
        exportValue: newOptionInputEl.current.value,
      },
    ]);
    newOptionInputEl.current.value = "";
  };

  return (
    <div className="bg-primary-50/5 sm:w-80 sx:w-[calc(100dvw-8px)] max-h-svh sm:max-h-[calc(100svh-var(--layout-top-bar))] flex flex-col">
      <h5 className="px-10 py-2 sx:pt-4 text-center">Field settings</h5>
      <button
        popoverTarget={myPopover.popoverTarget}
        popoverTargetAction="hide"
        type="button"
        className="absolute right-2 top-2"
      >
        <CloseIcn className="size-6 active:text-primary-500" />
      </button>

      <div className="flex flex-col gap-5 px-4 pt-2 pb-4 overflow-x-hidden overflow-y-auto">
        <label
          className="flex-col gap-1 px-1.5 pt-0.5 pb-1 bg-primary-100/10 rounded-md"
          style={{
            display: [CanvasFeildCheckbox.type, CanvasFeildRadio.type].includes(fieldType as any) ? "none" : "flex",
          }}
        >
          <p className="text-primary-400">Placeholder</p>
          <input type="text" name="field_placeholder" className="text-center text-sm font-light bg-black/10 rounded" />
        </label>

        <label
          className="flex-col pt-0.5 pb-3 px-1.5 gap-2 bg-primary-100/10 rounded-md"
          style={{
            display: [CanvasFeildCheckbox.type, CanvasFeildRadio.type].includes(fieldType as any) ? "none" : "flex",
          }}
        >
          <div className="flex justify-between">
            <p className="text-primary-400">Font size</p>
            <div className="flex justify-center items-center gap-0.5">
              <input
                type="number"
                value={fieldFontSize}
                min={1}
                max={100}
                onChange={handleChangeFontSize}
                enterKeyHint="done"
                className="field-sizing-content text-sm"
              />
              <span className="text-sx">px</span>
            </div>
          </div>
          <input
            type="range"
            value={fieldFontSize}
            min={1}
            max={100}
            onChange={handleChangeFontSize}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEndCapture={(e) => e.stopPropagation()}
            name="field_font_size"
            className="mx-1 slider-thumb:mb-0 slider-thumb:outline-6 text-center text-sm font-light"
          />
        </label>

        <label className="flex flex-col pt-0.5 pb-3 px-1.5 gap-2 bg-primary-100/10 rounded-md">
          <div className="flex justify-between">
            <p className="text-primary-400">Border width</p>
            <div className="flex justify-center items-center gap-0.5">
              <input
                type="number"
                value={fieldBorderWidth}
                min={1}
                max={100}
                onChange={handleChangeBorderWidth}
                enterKeyHint="done"
                className="field-sizing-content text-sm"
              />
              <span className="text-sx">px</span>
            </div>
          </div>
          <input
            type="range"
            value={fieldBorderWidth}
            min={1}
            max={10}
            onChange={handleChangeBorderWidth}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEndCapture={(e) => e.stopPropagation()}
            name="field_border_width"
            className="bg-primary-200/20 rounded-xl h-1 mx-1 slider-thumb:mb-0 slider-thumb:outline-6 text-center text-sm font-light"
          />
        </label>

        <div className="flex flex-col pt-0.5 pb-2 px-1.5 gap-1 bg-primary-100/10 rounded-md">
          <p className="text-primary-400">Border color</p>
          <dialog
            popover="auto"
            id={fieldBorderColorBarPopover.id}
            ref={fieldBorderColorBarPopover.popoverRef}
            onTouchStart={borderColorOnTouchStart}
            onTouchMove={borderColorOnTouchMove}
            onTouchEndCapture={borderColorOnTouchEndCapture}
            className="popover-animation-opacity sx:position-area-top sm:position-area-[right] open:[&+*]:border"
            style={{ positionAnchor: fieldBorderColorBarPopover.positionAnchor } as CSSProperties}
          >
            <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />

            <FieldColorPicker
              myPopover={fieldBorderColorBarPopover}
              fieldColor={fieldBorderColor}
              setFieldColor={setFieldBorderColor}
            />
          </dialog>
          {/* borderColor popover action btn */}
          <button
            type="button"
            popoverTarget={fieldBorderColorBarPopover.popoverTarget}
            className="grow h-4 text-transparent border-primary-300 cursor-pointer rounded hover:opacity-90 active:opacity-80"
            style={
              { backgroundColor: fieldBorderColor, anchorName: fieldBorderColorBarPopover.anchorName } as CSSProperties
            }
          />
          <input type="text" name="field_border_color" value={fieldBorderColor} className="hidden" />
        </div>

        <div className="flex flex-col pt-0.5 pb-2 px-1.5 gap-1 bg-primary-100/10 rounded-md">
          <p className="text-primary-400">Text color</p>
          <dialog
            popover="auto"
            id={fieldTextColorBarPopover.id}
            ref={fieldTextColorBarPopover.popoverRef}
            onTouchStart={textColorOnTouchStart}
            onTouchMove={textColorOnTouchMove}
            onTouchEndCapture={textColorOnTouchEndCapture}
            className="popover-animation-opacity sx:position-area-top sm:position-area-[right] open:[&+*]:border"
            style={{ positionAnchor: fieldTextColorBarPopover.positionAnchor } as CSSProperties}
          >
            <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />

            <FieldColorPicker
              myPopover={fieldTextColorBarPopover}
              fieldColor={fieldTextColor}
              setFieldColor={setFieldTextColor}
            />
          </dialog>
          {/* textColor popover action btn */}
          <button
            type="button"
            popoverTarget={fieldTextColorBarPopover.popoverTarget}
            className="grow h-4 text-transparent border-primary-300 cursor-pointer rounded hover:opacity-90 active:opacity-80"
            style={
              { backgroundColor: fieldTextColor, anchorName: fieldTextColorBarPopover.anchorName } as CSSProperties
            }
          />
          <input type="text" name="field_text_color" value={fieldTextColor} className="hidden" />
        </div>

        <div className="flex flex-col pt-0.5 pb-2 px-1.5 gap-1 bg-primary-100/10 rounded-md">
          <p className="text-primary-400">Background color</p>
          <dialog
            popover="auto"
            id={fieldBackgroundColorBarPopover.id}
            ref={fieldBackgroundColorBarPopover.popoverRef}
            onTouchStart={backgroundColorOnTouchStart}
            onTouchMove={backgroundColorOnTouchMove}
            onTouchEndCapture={backgroundColorOnTouchEndCapture}
            className="popover-animation-opacity sx:position-area-top sm:position-area-[right] open:[&+*]:border"
            style={{ positionAnchor: fieldBackgroundColorBarPopover.positionAnchor } as CSSProperties}
          >
            <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />

            <FieldColorPicker
              myPopover={fieldBackgroundColorBarPopover}
              fieldColor={fieldBackgroundColor}
              setFieldColor={setFieldBackgroundColor}
            />
          </dialog>
          {/* backgroundColor popover action btn */}
          <button
            type="button"
            popoverTarget={fieldBackgroundColorBarPopover.popoverTarget}
            className="grow h-4 text-transparent border-primary-300 cursor-pointer rounded hover:opacity-90 active:opacity-80"
            style={
              {
                backgroundColor: fieldBackgroundColor,
                anchorName: fieldBackgroundColorBarPopover.anchorName,
              } as CSSProperties
            }
          />
          <input type="text" name="field_background_color" value={fieldBackgroundColor} className="hidden" />
        </div>

        <div className="grow grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 px-1.5 pt-0.5 pb-1 bg-primary-100/10 rounded-md">
            <p className="text-primary-400">Width</p>
            <input
              type="number"
              min={1}
              name="field_width"
              defaultValue={fieldType === "canvas-field-checkbox" || fieldType === "canvas-field-radio" ? 30 : 200}
              className="text-center text-sm font-light bg-black/10 rounded"
            />
          </label>

          <label className="flex flex-col gap-1 px-1.5 pt-0.5 pb-1 bg-primary-100/10 rounded-md">
            <p className="text-primary-400">Height</p>
            <input
              type="number"
              min={1}
              name="field_height"
              defaultValue={fieldType === "canvas-field-textarea" ? 100 : 30}
              className="text-center text-sm font-light bg-black/10 rounded"
            />
          </label>
        </div>

        <label
          className="flex-col gap-2 px-1.5 pt-1 pb-2 bg-primary-100/10 rounded-md"
          style={{
            display: [CanvasFeildSelect.type, CanvasFeildSelectMultiple.type].includes(fieldType as any)
              ? "flex"
              : "none",
          }}
        >
          <p className="text-primary-300">Options</p>
          <div className="w-full flex flex-col gap-2 rounded">
            <div className="flex flex-col gap-2">
              {fieldOptions.map((option, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <input
                    type="text"
                    name="field-option"
                    value={option.displayValue}
                    onChange={(e) => handleChangeFieldOption(e, index)}
                    className="w-full p-1 bg-black/15 text-center text-sm rounded-md"
                  />
                  <button
                    className="bg-black/15 p-1.25 rounded-md"
                    type="button"
                    onClick={() => handleDeleteFieldOption(index)}
                  >
                    <Deleteicn className="size-4.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add new option"
                className="w-full p-1 bg-black/15 text-center text-sm rounded-md"
                ref={newOptionInputEl}
              />
              <button type="button" className="bg-black/15 p-1.5 rounded-md" onClick={handleAddFieldOption}>
                <FaPlus className="size-4" />
              </button>
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default FileldSettingsModal;
