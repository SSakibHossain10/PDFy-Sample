import { sendPointToPlane } from "@/utils/canvas/util/misc";
import { BaseBrush, Canvas, Point, TEvent } from "fabric";
import CanvasMarkerDrawingPath from "./CanvasMarkerDrawingPath";
import CanvasPage from "./CanvasPage";
import CanvasPencilDrawingPath from "./CanvasPencilDrawingPath";

export default class CanvasEraserBrush extends BaseBrush {
  //# skip methods
  _render(): void {}
  onMouseUp(): void {}

  _checkTarget(
    obj: Parameters<Canvas["_checkTarget"]>[0],
    pointer: Parameters<Canvas["_checkTarget"]>[1]
  ): ReturnType<Canvas["_checkTarget"]> {
    if (
      obj &&
      obj.visible &&
      obj.evented &&
      (this.canvas as any as CanvasPage)._pointIsInObjectSelectionArea(
        obj,
        sendPointToPlane(pointer, undefined, this.canvas.viewportTransform)
      )
    ) {
      if (!this.canvas.isTargetTransparent(obj, pointer.x, pointer.y)) {
        return true;
      }
    }
    return false;
  }

  _eraseObjects(pointer: Point) {
    const containsPointObjects = this.canvas.getObjects().filter((obj) => {
      if (!(obj instanceof CanvasPencilDrawingPath || obj instanceof CanvasMarkerDrawingPath)) return;
      return this._checkTarget(obj, pointer) && this.canvas.remove(obj);
    });

    if (containsPointObjects.length > 0) {
      this.canvas.requestRenderAll();
    }
  }

  onMouseDown(pointer: Point, { e }: TEvent): void {
    if (!this.canvas._isMainEvent(e)) return;

    this._eraseObjects(pointer);
  }

  onMouseMove(pointer: Point, { e }: TEvent) {
    if (!this.canvas._isMainEvent(e)) return;

    this._eraseObjects(pointer);
  }

  constructor(canvas: CanvasPage) {
    super(canvas as any as Canvas);
  }
}
