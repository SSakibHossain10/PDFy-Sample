import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import { IPopover } from "@/hooks/usePopover";
import useUpdatePopoverHeight from "@/hooks/useUpdatePopoverHeight";
import CloseIcn from "@icons/doutone/close-circle.svg";
import Deleteicn from "@icons/doutone/delete-fill.svg";
import { RefObject, ToggleEvent, useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import CanvasFeildCheckbox from "../../../../classes/form/CanvasFeildCheckbox";
import CanvasFeildInput from "../../../../classes/form/CanvasFeildInput";
import CanvasFeildSelect from "../../../../classes/form/CanvasFeildSelect";
import CanvasFeildSelectMultiple from "../../../../classes/form/CanvasFeildSelectMultiple";
import CanvasFeildTextarea from "../../../../classes/form/CanvasFeildTextarea";
import { CanvasObject } from "../../../../types/document";

function FieldSettingsPannel({
  myPopover,
  activeObjType,
}: {
  myPopover: IPopover<HTMLDialogElement>;
  activeObjType: CanvasObject["type"];
}) {
  const newOptionInputEl = useRef(null) as unknown as RefObject<HTMLInputElement>;

  const [fieldState, setFieldState] = useState<{
    fieldName: CanvasBaseFieldops["fieldName"];
    fieldPlaceholder: CanvasBaseFieldops["fieldPlaceholder"];
    isRequired: CanvasBaseFieldops["required"];
    fieldOptions: CanvasFeildSelect["fieldOptions"];
    isMultiple: boolean;
  }>({
    fieldName: "",
    fieldPlaceholder: "",
    isRequired: false,
    fieldOptions: [],
    isMultiple: false,
  });

  const setStateHandler = () => {
    const activeObject = documentManager.currentCanvas.getActiveObject() as CanvasFeildInput;

    console.log("activeObject", activeObject);

    setFieldState({
      fieldName: activeObject.fieldName,
      fieldPlaceholder: activeObject.fieldPlaceholder,
      isRequired: activeObject.required,
      fieldOptions: (activeObject as unknown as CanvasFeildSelect).fieldOptions || [],
      isMultiple: (activeObject.type as any) === CanvasFeildSelectMultiple.type,
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

  const handleChangeFieldName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldState((prev) => ({ ...prev, fieldName: e.target.value }));
    documentManager.changeFieldName(e.target.value);
  };

  const handleChangeFielPlaceHolder = (e: React.ChangeEvent<HTMLInputElement>) => {
    documentManager.changeFieldPlaceholder(e.target.value);
    setFieldState((prev) => {
      return {
        ...prev,
        fieldPlaceholder: (documentManager.currentCanvas.getActiveObject() as CanvasFeildSelect).fieldPlaceholder,
      };
    });
  };

  const handleChangeFieldRequired = (e: React.ChangeEvent<HTMLInputElement>) => {
    documentManager.changeFieldRequired(e.target.checked);
    setFieldState((prev) => {
      return {
        ...prev,
        isRequired: (documentManager.currentCanvas.getActiveObject() as CanvasFeildSelect).required,
      };
    });
  };
  const handleChangeFieldSelectAllowMultiple = (e: React.ChangeEvent<HTMLInputElement>) => {
    documentManager.changeFieldSelectAllowMultiple(e.target.checked);
    setFieldState((prev) => {
      return {
        ...prev,
        isMultiple: e.target.checked,
      };
    });
  };

  const handleChangeFieldOption = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    documentManager.changeFieldOption(index, e.target.value);
    setFieldState((prev) => {
      return {
        ...prev,
        fieldOptions: (documentManager.currentCanvas.getActiveObject() as CanvasFeildSelect).fieldOptions,
      };
    });
  };

  const handleAddFieldOption = () => {
    documentManager.addFieldOption(newOptionInputEl.current.value);
    setFieldState((prev) => {
      return {
        ...prev,
        fieldOptions: (documentManager.currentCanvas.getActiveObject() as CanvasFeildSelect).fieldOptions,
      };
    });
    newOptionInputEl.current.value = "";
    // newOptionInputEl.current.focus();
  };

  const handleDeleteFieldOption = (index: number) => {
    documentManager.deleteFieldOption(index);
    setFieldState((prev) => {
      return {
        ...prev,
        fieldOptions: (documentManager.currentCanvas.getActiveObject() as CanvasFeildSelect).fieldOptions,
      };
    });
  };

  useUpdatePopoverHeight(myPopover.popoverRef, "--field-settings-popover-height");

  return (
    <section className="w-screen sm:w-89.5 bg-gr-multi-dark flex flex-col rounded-t-xl sm:rounded-xl">
      <button
        popoverTarget={myPopover.popoverTarget}
        popoverTargetAction="hide"
        className="absolute right-2.5 sm:right-3 top-3"
      >
        <CloseIcn className="size-7 active:text-primary-500" />
      </button>
      <div className="flex justify-center pt-3">
        <h4 className="font-medium">Field settings</h4>
      </div>

      <div className="px-4 pb-3 pt-2 sm:pt-4 flex flex-col gap-4 sm:gap-5 overflow-x-hidden overflow-y-auto">
        <label className="flex flex-col gap-1 px-1.5 pt-0.5 pb-1 bg-primary-100/10 rounded-md">
          <p className="text-primary-300">Name</p>
          <input
            type="text"
            value={fieldState.fieldName}
            onChange={handleChangeFieldName}
            className="p-0.5 text-center text-sm font-light bg-black/20 rounded"
          />
        </label>

        <label
          className="flex-col gap-1 px-1.5 pt-0.5 pb-1 bg-primary-100/10 rounded-md"
          style={{
            display: [CanvasFeildInput.type, CanvasFeildTextarea.type].includes(activeObjType as any) ? "flex" : "none",
          }}
        >
          <p className="text-primary-300">Placeholder</p>
          <input
            type="text"
            value={fieldState.fieldPlaceholder}
            onChange={handleChangeFielPlaceHolder}
            className="p-0.5 text-center text-sm font-light bg-black/20 rounded"
          />
        </label>

        <label
          className="flex-col gap-2 px-1.5 pt-1 pb-2 bg-primary-100/10 rounded-md"
          style={{
            display: [CanvasFeildSelect.type, CanvasFeildSelectMultiple.type].includes(activeObjType as any)
              ? "flex"
              : "none",
          }}
        >
          <p className="text-primary-300">Options</p>
          <div className="w-full flex flex-col gap-2 rounded">
            <div className="flex flex-col gap-2">
              {fieldState.fieldOptions.map((option, index) => (
                <div className="flex items-center gap-2" key={index}>
                  <input
                    type="text"
                    value={option.displayValue}
                    onChange={(e) => handleChangeFieldOption(e, index)}
                    className="w-full p-1 bg-black/20 text-center text-sm rounded-md"
                  />
                  <button className="bg-black/20 p-1.25 rounded-md" onClick={() => handleDeleteFieldOption(index)}>
                    <Deleteicn className="size-4.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add new option"
                className="w-full p-1 bg-black/20 text-center text-sm rounded-md"
                ref={newOptionInputEl}
              />
              <button className="bg-black/20 p-1.5 rounded-md" onClick={handleAddFieldOption}>
                <FaPlus className="size-4" />
              </button>
            </div>
          </div>
        </label>

        <div className="flex justify-center gap-4 p-1">
          <label
            className="items-center gap-2"
            style={{
              display: [CanvasFeildCheckbox.type].includes(activeObjType as any) ? "none" : "flex",
            }}
          >
            <input
              type="checkbox"
              name="required"
              checked={fieldState.isRequired}
              onChange={handleChangeFieldRequired}
            />
            <p>Required</p>
          </label>

          <label
            className="items-center gap-2"
            style={{
              display: [CanvasFeildSelect.type, CanvasFeildSelectMultiple.type].includes(activeObjType as any)
                ? "flex"
                : "none",
            }}
          >
            <input
              type="checkbox"
              name="allowMultiple"
              checked={fieldState.isMultiple}
              onChange={handleChangeFieldSelectAllowMultiple}
            />
            <p>Allow mulpiple</p>
          </label>
        </div>
      </div>
    </section>
  );
}

export default FieldSettingsPannel;
