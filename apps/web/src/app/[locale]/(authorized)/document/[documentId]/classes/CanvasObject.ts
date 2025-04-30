import {
  classRegistry,
  Color,
  FabricObject,
  FabricObjectProps,
  Gradient,
  iMatrix,
  ObjectEvents,
  Pattern,
  SerializedObjectProps,
  TClassProperties,
  TFiller,
  TMat2D,
  TOptions,
  util,
} from "fabric";
import CanvasPath from "./CanvasPath";

const canvasobjectDefaultValues: Partial<TClassProperties<CanvasObject>> = {
  hello: false,
};

type THello = boolean;

interface UniqueCanvasObjectProps {
  hello: THello;
}

export interface SerializedCanvasObjectProps extends SerializedObjectProps, UniqueCanvasObjectProps {}

export interface CanvasObjectProps extends FabricObjectProps, UniqueCanvasObjectProps {}

export default class CanvasObject<
    Props extends TOptions<CanvasObjectProps> = Partial<CanvasObjectProps>,
    SProps extends SerializedCanvasObjectProps = SerializedCanvasObjectProps,
    EventSpec extends ObjectEvents = ObjectEvents,
  >
  extends FabricObject<Props, SProps, EventSpec>
  implements UniqueCanvasObjectProps
{
  static type = "canvas-object" as const;
  //only for type checking
  get type(): typeof FabricObject.type {
    return FabricObject.type;
  }

  static ownDefaults = canvasobjectDefaultValues;
  declare hello: THello;

  static getDefaults(): Record<string, any> {
    return {
      ...super.getDefaults(),
      ...CanvasObject.ownDefaults,
    };
  }

  constructor(options?: Props) {
    super({ ...CanvasObject.ownDefaults, ...options } as Props);
  }

  toObject<T extends Omit<Props & TClassProperties<this>, keyof SProps>, K extends keyof T = never>(
    propertiesToInclude: K[] = []
  ): Pick<T, K> & SProps {
    return super.toObject([...propertiesToInclude, "hello"] as (keyof T)[]);
  }

  applyPdfClipPath(pdfDoc: PDFKit.PDFDocument, clipPath: CanvasPath): void {
    const clipPathString = util
      .transformPath(clipPath.path, iMatrix, clipPath.pathOffset)
      .map((c) => c.join(" "))
      .join(" ");

    pdfDoc
      .transform(...clipPath.calcOwnMatrix()) // apply clip path transform
      .path(clipPathString)
      .clip()
      .transform(...util.invertTransform(clipPath.calcOwnMatrix())); // revert clip path transform
  }

  rgbToPDFColor(rgb?: [number, number, number]) {
    if (!rgb) return;
    return rgb.map((c) => c / 255).join(" "); // Convert 0-255 to 0-1 range
  }

  toPdfColor(color: string | TFiller | null, pdfDoc: PDFKit.PDFDocument): PDFKit.Mixins.ColorValue | undefined {
    if (!color) return;
    if ((color as Gradient<"linear">).colorStops) {
      if ((color as Gradient<"linear">).type === "linear") {
        const fabricGrad = color as Gradient<"linear">;
        const { coords, gradientTransform, offsetX, offsetY, colorStops } = fabricGrad;
        const { x1, y1, x2, y2 } = coords;
        const sortedStops = [...colorStops].sort((a, b) => a.offset - b.offset);
        const grad = pdfDoc.linearGradient(x1, y1, x2, y2);
        const matOffset = [1, 0, 0, 1, offsetX - this.width / 2, offsetY - this.height / 2] as TMat2D; //@ts-ignore
        grad.transform = util.multiplyTransformMatrixArray([matOffset, gradientTransform ?? iMatrix]);
        sortedStops.forEach(({ color, offset }) => {
          const col = new Color(color as unknown as string);
          grad.stop(offset, col.getSource().slice(0, 3));
        });
        return grad;
      } else if ((color as Gradient<"radial">).type === "radial") {
        const fabricGrad = color as Gradient<"radial">;
        const { coords, gradientTransform, offsetX, offsetY, colorStops } = fabricGrad;
        const { x1, y1, r1, x2, y2, r2 } = coords;
        const sortedStops = [...colorStops].sort((a, b) => a.offset - b.offset);
        const grad = pdfDoc.radialGradient(x1, y1, r1, x2, y2, r2);
        const matOffset = [1, 0, 0, 1, offsetX - this.width / 2, offsetY - this.height / 2] as TMat2D; //@ts-ignore
        grad.transform = util.multiplyTransformMatrixArray([matOffset, gradientTransform ?? iMatrix]);
        sortedStops.forEach(({ color, offset }) => {
          const col = new Color(color as unknown as string);
          grad.stop(offset, col.getSource().slice(0, 3));
        });
        return grad;
      } else {
        return;
      }
    } else if ((color as Pattern).type === "pattern") {
      return; //pattern color handled in each object
    } else {
      const fill = new Color(color as unknown as string);
      return fill.getSource().slice(0, 3);
    }
  }
}

classRegistry.setClass(CanvasObject, "canvas-object");
