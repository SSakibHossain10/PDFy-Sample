import { BLACK_COLOR } from "@/constants/colors";
import { FIELD_DEFAULT_BACKGROUND_COLOR, FIELD_DEFAULT_BORDER_COLOR } from "@/constants/pdf";
import { ITextEvents, Rect, TClassProperties, TextProps, TOptions } from "fabric";
import CanvasIText, { SerializedCanvasITextProps } from "../CanvasIText";
import CanvasPage from "../CanvasPage";
import { TValueCheckbox } from "./CanvasFeildCheckbox";

type TValueInput = null | string;
type TFieldPlaceholder = string;
type TFieldName = string;
type TRequired = boolean;
type TFieldValue = TValueInput | TValueCheckbox;
type TFieldBackgroundColor = string;
type TFieldBorderColor = string;
type TFieldBorderWidth = number;
type TFieldBorderDashArray = number[] | null;

interface UniqueCanvasBaseFieldProps {
  fieldPlaceholder: TFieldPlaceholder;
  fieldName: TFieldName;
  required: TRequired;
  fieldValue: TFieldValue;
  fieldBackgroundColor: TFieldBackgroundColor;
  fieldBorderColor: TFieldBorderColor;
  fieldBorderWidth: TFieldBorderWidth;
  fieldBorderDashArray: TFieldBorderDashArray;
}

export interface SerializedCanvasBaseFieldProps extends SerializedCanvasITextProps, UniqueCanvasBaseFieldProps {}

export interface CanvasBaseFieldProps extends TextProps, UniqueCanvasBaseFieldProps {}

const canvasBaseFieldDefaultValues: Partial<TClassProperties<CanvasBaseField>> = {
  strokeUniform: true,
  fieldPlaceholder: "",
  fieldName: "",
  required: false,
  fieldValue: "",
  fill: BLACK_COLOR,
  fieldBackgroundColor: FIELD_DEFAULT_BACKGROUND_COLOR,
  fieldBorderColor: FIELD_DEFAULT_BORDER_COLOR,
  fieldBorderWidth: 1,
  fieldBorderDashArray: null,
};

class CanvasBaseField<
    Props extends TOptions<CanvasBaseFieldProps> = Partial<CanvasBaseFieldProps>,
    SProps extends SerializedCanvasBaseFieldProps = SerializedCanvasBaseFieldProps,
    EventSpec extends ITextEvents = ITextEvents,
  >
  extends CanvasIText<Props, SProps, EventSpec>
  implements UniqueCanvasBaseFieldProps
{
  static type = "canvas-field" as const;
  //only for type checking
  get type(): typeof CanvasBaseField.type {
    return CanvasBaseField.type;
  }

  declare hiddenTextarea: HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement | null;

  declare fieldPlaceholder: TFieldPlaceholder;
  declare fieldName: TFieldName;
  declare required: TRequired;
  declare fieldValue: TFieldValue;
  declare fieldBackgroundColor: TFieldBackgroundColor;
  declare fieldBorderColor: TFieldBorderColor;
  declare fieldBorderWidth: TFieldBorderWidth;
  declare fieldBorderDashArray: TFieldBorderDashArray;

  static ownDefaults = canvasBaseFieldDefaultValues;

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      ...CanvasBaseField.ownDefaults,
    };
  }

  constructor(...args: [Props] | [string, Props]) {
    if (args.length === 2) {
      super(args[0] || args[1]?.fieldValue || "", { ...CanvasBaseField.ownDefaults, ...args[1] } as Props);
    } else {
      super({ ...CanvasBaseField.ownDefaults, ...args[0] } as Props);
    }
  }

  _hiddenFieldSetClass() {
    (this.hiddenTextarea as HTMLTextAreaElement).classList.add("canvas-hidden-field");
  }
  _hiddenFieldAppend() {
    this.canvas?.formContainer?.appendChild(this.hiddenTextarea as HTMLTextAreaElement);
  }
  _hiddenFieldSetAttributes() {
    Object.entries({
      placeholder: `${this.fieldPlaceholder || ""}`,
    }).forEach(([attribute, fieldValue]) => {
      if (!this.hiddenTextarea) return;
      this.hiddenTextarea.setAttribute(attribute, fieldValue);
    });
  }

  changeObjectStrokeColor(color: Parameters<CanvasPage["changeObjectStrokeColor"]>[0]) {
    this.fieldBorderColor = color;
    this.dirty = true;
    this.canvas?.requestRenderAll();
  }
  changeObjectBorderWidth(
    width: Parameters<CanvasPage["changeObjectBorderWidth"]>[0],
    dashArray: Parameters<CanvasPage["changeObjectBorderWidth"]>[1]
  ) {
    this.fieldBorderWidth = width;
    this.fieldBorderDashArray = dashArray;
    this.dirty = true;
    this.canvas?.requestRenderAll();
  }
  changeObjectStrokeDashArray(dashArray: Parameters<CanvasPage["changeObjectStrokeDashArray"]>[0]) {
    this.fieldBorderDashArray = dashArray;
    this.dirty = true;
    this.canvas?.requestRenderAll();
  }
  changeFieldBackgroundColor(color: Parameters<CanvasPage["changeFieldBackgroundColor"]>[0]) {
    this.fieldBackgroundColor = color;
    this.dirty = true;
    this.canvas?.requestRenderAll();
  }
  changeFieldName(name: Parameters<CanvasPage["changeFieldName"]>[0]) {
    this.fieldName = name;
  }
  changeFieldPlaceholder(placeholder: Parameters<CanvasPage["changeFieldPlaceholder"]>[0]) {
    this.fieldPlaceholder = placeholder;
  }
  changeFieldRequired(required: Parameters<CanvasPage["changeFieldRequired"]>[0]) {
    this.required = required;
  }

  _renderFieldStyle(ctx: CanvasRenderingContext2D) {
    // store current states
    const currentFill = this.fill;
    const currentStroke = this.stroke;
    const currentStrokeWidth = this.strokeWidth;
    const currentStrokeDashArray = this.strokeDashArray;
    const currentLeft = this.left;
    const currentTop = this.top;
    const currentWidth = this.width;
    const currentHeight = this.height;
    // for field graphic
    this.fill = this.fieldBackgroundColor;
    this.stroke = this.fieldBorderColor;
    this.strokeWidth = this.fieldBorderWidth;
    this.strokeDashArray = this.fieldBorderDashArray;
    this.left = this.left - this.fieldBorderWidth / this.scaleX / 2;
    this.top = this.top - this.fieldBorderWidth / this.scaleY / 2;
    this.width = this.width - this.fieldBorderWidth / this.scaleX;
    this.height = this.height - this.fieldBorderWidth / this.scaleY;
    // draw field style
    Rect.prototype._render.call(this, ctx);
    // revert to original
    this.fill = currentFill;
    this.stroke = currentStroke;
    this.strokeWidth = currentStrokeWidth;
    this.strokeDashArray = currentStrokeDashArray;
    this.left = currentLeft;
    this.top = currentTop;
    this.width = currentWidth;
    this.height = currentHeight;
  }

  toObject<T extends Omit<Props & TClassProperties<this>, keyof SProps>, K extends keyof T = never>(
    propertiesToInclude: K[] = []
  ): Pick<T, K> & SProps {
    const object = super.toObject([
      ...propertiesToInclude,
      "fieldPlaceholder",
      "fieldName",
      "required",
      "fieldValue",
      "fieldBackgroundColor",
      "fieldBorderColor",
      "fieldBorderWidth",
      "fieldBorderDashArray",
    ] as (keyof T)[]) as Pick<T, K> & SProps;

    return object;
  }
}

export default CanvasBaseField;
