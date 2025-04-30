import { CSSProperties } from "react";
import CheckboxField from "./components/CheckboxField";
import RadioField from "./components/RadioField";
import SelectField from "./components/SelectField";
import TextField from "./components/TextField";

const FormSlot = () => {
  return (
    <div
      className="w-full h-full bg-gr-multi-dark flex flex-col sx:rounded-t-xl sm:rounded-r-xl overflow-auto"
      id="form-slot"
      style={{ anchorName: "--form-slot" } as CSSProperties}
    >
      <div className="sm:hidden pt-2 pb-3 flex justify-center">
        <span className="h-1 w-10 rounded-full bg-primary-200/50" />
      </div>
      <div className="flex flex-col gap-4 p-4 sx:pt-0 overflow-x-hidden overflow-y-auto">
        <TextField />
        <SelectField />
        <CheckboxField />
        <RadioField />
      </div>
    </div>
  );
};

export default FormSlot;
