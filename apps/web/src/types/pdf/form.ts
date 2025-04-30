export interface TPDFFormFieldCommon {
  annotationFlags: number;
  borderStyle: {
    width: number;
    rawWidth: number;
    style: number;
    dashArray: number[];
    horizontalCornerRadius: number;
    verticalCornerRadius: number;
  };
  color: Uint8ClampedArray | null;
  backgroundColor: Uint8ClampedArray | null;
  borderColor: Uint8ClampedArray | null;
  rotation: number;
  contentsObj: {
    str: string;
    dir: "ltr" | "rtl";
  };
  hasAppearance: boolean;
  id: string;
  modificationDate: null;
  rect: [number, number, number, number];
  subtype: "Widget";
  hasOwnCanvas: boolean;
  noRotate: boolean;
  noHTML: boolean;
  isEditable: boolean;
  structParent: number;
  annotationType: number;
  fieldName: string;
  actions: null;
  alternativeText: string;
  defaultAppearanceData: {
    fontSize: number;
    fontName: string;
    fontColor: Uint8ClampedArray;
  };
  fieldType: string;
  fieldFlags: number;
  readOnly: boolean;
  required: boolean;
  hidden: boolean;
}

export interface TPDFFormFieldTx extends TPDFFormFieldCommon {
  fieldType: "Tx";
  defaultFieldValue: string | null;
  fieldValue: string | null;
  textAlignment: number;
  maxLen: number;
  multiLine: boolean;
  comb: boolean;
  doNotScroll: boolean;
}

export type PDFFormFeildChOption = {
  exportValue: string;
  displayValue: string;
};
export interface TPDFFormFieldCh extends TPDFFormFieldCommon {
  fieldType: "Ch";
  defaultFieldValue: string[] | null;
  fieldValue: string[];
  options: PDFFormFeildChOption[];
  combo: boolean;
  multiSelect: boolean;
  selected?: number;
}

export interface TPDFFormFieldBtn extends TPDFFormFieldCommon {
  fieldType: "Btn";
  checkBox: boolean;
  radioButton: boolean;
  pushButton: boolean;
  isTooltipOnly: boolean;

  exportValue?: string;
  fieldValue?: string;
  buttonValue?: string;
}

export type TPDFFormField = TPDFFormFieldTx | TPDFFormFieldCh | TPDFFormFieldBtn;

export type TPDFAnnotation = TPDFFormField;
