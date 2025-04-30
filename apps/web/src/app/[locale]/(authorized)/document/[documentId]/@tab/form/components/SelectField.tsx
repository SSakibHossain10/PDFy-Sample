"use client";

import usePopover from "@/hooks/usePopover";
import useTouchVerticalSwiper from "@/hooks/useTouchVerticalSwiper";
import FieldSelectIcn from "@icons/field-select.svg";
import FieldSettingsIcn from "@public/icons/doutone/field-settings.svg";
import { CSSProperties, useEffect, useState } from "react";
import { BiPlus } from "react-icons/bi";
import CanvasFeildSelect, { CanvasFeildSelectProps } from "../../../classes/form/CanvasFeildSelect";
import CanvasFeildSelectMultiple, {
  CanvasFeildSelectMultipleProps,
} from "../../../classes/form/CanvasFeildSelectMultiple";
import { documentManager } from "../../../documentManager";
import FileldSettingsModal from "./FileldSettingsModal";

const SelectField = () => {
  const fieldSettingsPopover = usePopover<HTMLDialogElement>();

  const [fieldName, setFieldName] = useState(`select-field-1`);
  const [isFieldMultiple, setIsFieldMultiple] = useState(false);

  const handleAddField = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const required = formData.get("required") === "on";
    const allowMultiple = formData.get("allow_multiple") === "on";
    const fieldName = formData.get("field_name") as string;
    const fieldPlaceholder = formData.get("field_placeholder") as string;
    const fontSize = Number(formData.get("field_font_size"));
    const fieldBorderWidth = Number(formData.get("field_border_width"));
    const fieldBorderColor = formData.get("field_border_color") as string;
    const fill = formData.get("field_text_color") as string;
    const fieldBackgroundColor = formData.get("field_background_color") as string;
    const width = Number(formData.get("field_width"));
    const height = Number(formData.get("field_height"));
    const fieldOptions = formData.getAll("field-option").map((option) => ({
      displayValue: option,
      exportValue: option,
    }));
    const fieldValue = fieldOptions[0].exportValue;

    documentManager.addFormField(allowMultiple ? CanvasFeildSelectMultiple.type : CanvasFeildSelect.type, {
      required,
      fieldName,
      fieldPlaceholder,
      fontSize,
      fieldBorderWidth,
      fieldBorderColor,
      fill,
      fieldBackgroundColor,
      width,
      height,
      fieldOptions,
      fieldValue,
    } as CanvasFeildSelectProps | CanvasFeildSelectMultipleProps);

    setFieldName(
      `select-field-${documentManager.currentCanvas.getObjects().filter(({ type }) => type === "canvas-field-select" || type === "canvas-field-select-multiple").length + 1}`
    );
  };

  const resetFeildName = () => {
    setFieldName(
      `select-field-${documentManager.currentCanvas.getObjects().filter(({ type }) => type === "canvas-field-select" || type === "canvas-field-select-multiple").length + 1}`
    );
  };

  useEffect(() => {
    setFieldName(
      `select-field-${documentManager.currentCanvas.getObjects().filter(({ type }) => type === "canvas-field-select" || type === "canvas-field-select-multiple").length + 1}`
    );
    documentManager.on("current-canvas:changed", resetFeildName);
    return () => {
      documentManager.off("current-canvas:changed", resetFeildName);
    };
  }, []);

  const {
    onTouchStart: fieldSettingsOnTouchStart,
    onTouchMove: fieldSettingsOnTouchMove,
    onTouchEndCapture: fieldSettingsOnTouchEndCapture,
  } = useTouchVerticalSwiper({
    onSwipingClose: () => fieldSettingsPopover.popoverRef.current?.hidePopover(),
    layoutRef: fieldSettingsPopover.popoverRef,
    LARGE_MAX_HEIGHT: "fit-content",
    BASE_MAX_HEIGHT: "fit-content",
  });

  return (
    <form onSubmit={handleAddField} className="bg-primary-100/10 flex flex-col gap-4 px-3 py-2.5 rounded-lg">
      <div className="flex items-center gap-2.5">
        <FieldSelectIcn className="size-6.5" />
        <h5 className="grow text-base text-center">Select field</h5>
        <dialog
          popover="auto"
          id={fieldSettingsPopover.id}
          ref={fieldSettingsPopover.popoverRef}
          onTouchStart={fieldSettingsOnTouchStart}
          onTouchMove={fieldSettingsOnTouchMove}
          onTouchEndCapture={fieldSettingsOnTouchEndCapture}
          style={{ positionAnchor: "--form-slot" } as CSSProperties}
          className="sx:backdrop:bg-black/20 popover-animation-opacity transition-discrete sx:inset-0 sx:m-auto sm:position-area-[right] bg-gr-multi-dark rounded-lg overflow-hidden open:[&+*]:bg-forground/15"
        >
          <span className="absolute sm:hidden top-1.5 left-[50%] -translate-x-[50%] h-1 w-10 rounded-full bg-primary-200/50" />
          <FileldSettingsModal
            fieldType={isFieldMultiple ? CanvasFeildSelectMultiple.type : CanvasFeildSelect.type}
            myPopover={fieldSettingsPopover}
          />
        </dialog>
        <button
          type="button"
          popoverTarget={fieldSettingsPopover.popoverTarget}
          aria-describedby="field-settings-tooltip"
          className="rounded-lg p-0.5 hover:bg-primary-100/20 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline"
          style={{ anchorName: fieldSettingsPopover.anchorName } as CSSProperties}
        >
          <FieldSettingsIcn className="size-5.5" />
        </button>
        {/* field-settings-tooltip */}
        <div
          id="field-settings-tooltip"
          className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[left_top] sm:position-area-[right]"
          style={{ positionAnchor: fieldSettingsPopover.positionAnchor } as CSSProperties}
        >
          <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mr-2 sm:ml-2 text-sm text-nowrap rounded-2xl shadow-lg">
            Field settings
          </p>
        </div>
      </div>
      <div className="flex gap-2 justify-evenly">
        <label className="bg-primary-100/10 flex items-center gap-2 text-xs px-2.5 py-1 rounded-xl hover:bg-primary-100/20 active:text-primary-500">
          <input type="checkbox" name="required" />
          Required
        </label>
        <label className="bg-primary-100/10 flex items-center gap-2 text-xs px-2.5 py-1 rounded-xl hover:bg-primary-100/20 active:text-primary-500">
          <input
            type="checkbox"
            name="allow_multiple"
            checked={isFieldMultiple}
            onChange={(e) => setIsFieldMultiple(e.target.checked)}
          />
          Allow multiple
        </label>
      </div>
      <label className="flex flex-col gap-1 px-1.5 pt-0.5 pb-1 bg-primary-100/10 rounded-md">
        <p className="text-primary-400">Field name</p>
        <input
          type="text"
          name="field_name"
          defaultValue={fieldName}
          className="text-center text-sm font-light bg-black/10 rounded"
        />
      </label>
      <button
        className="flex justify-center items-center gap-1 bg-primary-100/15 p-1 rounded-full hover:bg-primary-100/20 active:text-primary-500"
        type="submit"
      >
        <BiPlus className="size-4.5" />
        <span className="text-sm">Add field</span>
      </button>
    </form>
  );
};

export default SelectField;
