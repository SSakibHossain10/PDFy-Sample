import { IControlKey } from "@/types/canvas";
import { createDefaultCanvasObjectControls } from "@/utils/canvas/controls";
import {
  classRegistry,
  Control,
  FabricObject,
  iMatrix,
  ObjectEvents,
  Path,
  PathProps,
  Pattern,
  SerializedPathProps,
  TClassProperties,
  TComplexPathData,
  TOptions,
  util,
} from "fabric";
import CanvasObject from "./CanvasObject";

const canvaspathDefaultValues: Partial<TClassProperties<CanvasPath>> = {
  hello: false,
};

type THello = boolean;

interface UniqueCanvasPathProps {
  hello: THello;
}

export interface SerializedCanvasPathProps extends SerializedPathProps, UniqueCanvasPathProps {}

export interface CanvasPathProps extends PathProps, UniqueCanvasPathProps {}

export default class CanvasPath<
    Props extends TOptions<CanvasPathProps> = Partial<CanvasPathProps>,
    SProps extends SerializedCanvasPathProps = SerializedCanvasPathProps,
    EventSpec extends ObjectEvents = ObjectEvents,
  >
  extends Path<Props, SProps, EventSpec>
  implements UniqueCanvasPathProps
{
  static type = "canvas-path" as const;
  //only for type checking
  get type(): typeof CanvasPath.type {
    return CanvasPath.type;
  }

  static ownDefaults = canvaspathDefaultValues;
  declare hello: THello;

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      ...CanvasPath.ownDefaults,
    };
  }

  static createControls(): { controls: Partial<Record<IControlKey, Control>> } {
    const defaultCanvasObjectControls = createDefaultCanvasObjectControls();
    return {
      controls: {
        tl: defaultCanvasObjectControls.tl,
        tr: defaultCanvasObjectControls.tr,
        bl: defaultCanvasObjectControls.bl,
        br: defaultCanvasObjectControls.br,
        mtr: defaultCanvasObjectControls.mtr,
      },
    };
  }

  constructor(path: TComplexPathData | string, options: Partial<Props> = {}) {
    super(path, { ...CanvasPath.ownDefaults, ...options } as Props);
  }
  toObject(propertiesToInclude: Parameters<FabricObject["toObject"]>[0] = []): ReturnType<FabricObject["toObject"]> {
    return super.toObject([...propertiesToInclude, "hello"]);
  }

  toPDF(pdfDoc: PDFKit.PDFDocument): void {
    if (this.fill instanceof Pattern || this.stroke instanceof Pattern) {
      //#TO_DO implement pattern color (for now exported as image)
      pdfDoc.save().transform(...this.calcOwnMatrix());

      const pathImgDataUrl = this.toDataURL();
      pdfDoc.image(pathImgDataUrl, -this.width / 2, -this.height / 2, {
        width: this.width,
        height: this.height,
      });

      pdfDoc.restore();
    } else {
      const pathString = util
        .transformPath(this.path, iMatrix, this.pathOffset)
        .map((c) => c.join(" "))
        .join(" ");

      pdfDoc
        .save()
        .transform(...this.calcOwnMatrix())
        .opacity(this.opacity);

      if (this.clipPath instanceof CanvasPath) {
        CanvasObject.prototype.applyPdfClipPath(pdfDoc, this.clipPath as CanvasPath);
      }

      pdfDoc.path(pathString);

      if (this.stroke && this.stroke !== "transparent") {
        //stroke styles
        pdfDoc
          .lineWidth(this.strokeWidth)
          .lineCap(this.strokeLineCap)
          .lineJoin(this.strokeLineJoin)
          .miterLimit(this.strokeMiterLimit);

        if (this.strokeDashArray?.[0] && this.strokeDashArray[0] !== 0 && this.strokeDashArray[1] !== 0) {
          pdfDoc.dash(this.strokeDashArray[0] * this.strokeWidth, {
            space: this.strokeDashArray[1] * this.strokeWidth,
          });
        }
      }

      if (this.fill && this.fill !== "transparent" && this.stroke && this.stroke !== "transparent") {
        //fill & stroke
        pdfDoc.fillAndStroke(
          CanvasObject.prototype.toPdfColor.call(this, this.fill, pdfDoc),
          CanvasObject.prototype.toPdfColor.call(this, this.stroke, pdfDoc),
          this.fillRule
        );
      } else if (this.fill && this.fill !== "transparent") {
        // only fill
        pdfDoc.fill(CanvasObject.prototype.toPdfColor.call(this, this.fill, pdfDoc), this.fillRule);
      } else if (this.stroke && this.stroke !== "transparent") {
        // only stroke
        pdfDoc.stroke(CanvasObject.prototype.toPdfColor.call(this, this.stroke, pdfDoc));
      }

      pdfDoc.restore();
    }
  }
}

classRegistry.setClass(CanvasPath, "canvas-path");
