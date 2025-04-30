import { colors } from "@/constants/colors";
import { Canvas, FabricImage, Point, Rect } from "fabric";

export default class ImageCropper extends Canvas {
  constructor(image: HTMLImageElement) {
    super("photo-cropper-canvas", {
      width: Math.max(image.width, image.height),
      height: Math.max(image.width, image.height),
    });

    const cropperImage = new FabricImage(image, {
      selectable: false,
      evented: false,
      originX: "center",
      originY: "center",
      left: this.getWidth() / 2,
      top: this.getHeight() / 2,
    });

    this.add(cropperImage);

    const rect = new Rect({
      width: Math.min(image.width, image.height),
      height: Math.min(image.width, image.height),
      stroke: colors.primary[500],
      strokeWidth: 3,
      cornerStyle: "rect",
    });

    //move to center
    rect.set({
      left: rect.translateToGivenOrigin(
        new Point(this.getWidth() / 2, rect.top),
        "center",
        rect.originY,
        "left",
        rect.originY
      ).x,
      originX: "left",
      top: rect.translateToGivenOrigin(
        new Point(rect.left, this.getHeight() / 2),
        rect.originX,
        "center",
        rect.originX,
        "top"
      ).y,
      originY: "top",
    });

    //only show corner controls
    rect.controls = {
      mtr: rect.controls.mtr,
      tl: rect.controls.tl,
      tr: rect.controls.tr,
      bl: rect.controls.bl,
      br: rect.controls.br,
    };

    this.add(rect);

    this.renderAll();
  }

  getCropedImage() {
    const rect = this.getObjects("rect")[0];

    const cropedImage = this.toDataURL({
      left: rect.left + rect.strokeWidth * rect.scaleX,
      top: rect.top + rect.strokeWidth * rect.scaleY,
      width: (rect.width - rect.strokeWidth) * rect.scaleX,
      height: (rect.height - rect.strokeWidth) * rect.scaleY,
      multiplier: 1,
    });

    return cropedImage;
  }
}
