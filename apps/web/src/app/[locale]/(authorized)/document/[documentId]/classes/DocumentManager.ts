import { FABRIC_VERSION } from "@/constants";
import { DRAWING_ERASER_CURSOR } from "@/constants/canvas";
import { BLACK_COLOR } from "@/constants/colors";
import {
  api_document_add_page,
  api_document_add_page_after,
  api_document_delete_page,
  api_document_duplicate_page,
  api_document_reorder_page,
} from "@/constants/urls";
import { PAGE_SIZES } from "@/data/page_sizing";
import { IDocument, IDocumentPage, TDocumentFont } from "@/schemas/documentSchema";
import { TFont, TGoogleFont } from "@/schemas/fontSchema";
import { ITemplate } from "@/schemas/templateSchema";
import addfontInDocument from "@/server-actions/add_font_in_document";
import addTemplateInDocument from "@/server-actions/add_template_document";
import clientNotification from "@/utils/clientNotification";
import { pdfDateToJsDate } from "@/utils/convert_data";
import BlobStream from "blob-stream";
import { Canvas, FabricObject, StaticCanvas, TPointerEvent, TPointerEventInfo } from "fabric";
import { isEmpty } from "lodash";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import { TborderStyle } from "../components/layout/object-primary-toolbar/BorderStyleBar";
import { TDocumentPageOrientation } from "../types/document";
import CanvasEraserBrush from "./CanvasEraserBrush";
import CanvasGroup from "./CanvasGroup";
import CanvasImage from "./CanvasImage";
import CanvasMarkerBrush from "./CanvasMarkerBrush";
import CanvasMarkerDrawingPath from "./CanvasMarkerDrawingPath";
import CanvasPage from "./CanvasPage";
import CanvasPath from "./CanvasPath";
import CanvasPencilBrush from "./CanvasPencilBrush";
import CanvasPencilDrawingPath from "./CanvasPencilDrawingPath";
import CanvasRect from "./CanvasRect";
import CanvasSignatureText from "./CanvasSignatureText";
import CanvasTextbox from "./CanvasTextbox";
import CanvasFeildCheckbox from "./form/CanvasFeildCheckbox";
import CanvasFeildInput from "./form/CanvasFeildInput";
import CanvasFeildRadio from "./form/CanvasFeildRadio";
import CanvasFeildSelect from "./form/CanvasFeildSelect";
import CanvasFeildSelectMultiple from "./form/CanvasFeildSelectMultiple";
import CanvasFeildTextarea from "./form/CanvasFeildTextarea";

// Generic callback type
export type TEventCallback<T> = (options?: T) => void;

// Event-specific handlers

export type TMouseDownHandler = TEventCallback<TPointerEventInfo<TPointerEvent>>;

export type TSelectionHandlerCreated = TEventCallback<
  Partial<TPointerEventInfo<TPointerEvent>> & {
    selected: FabricObject[];
  }
>;

export type TSelectionHandlerUpdated = TEventCallback<
  Partial<TPointerEventInfo<TPointerEvent>> & {
    selected: FabricObject[];
    deselected: FabricObject[];
  }
>;

export type TSelectionHandlerCleared = TEventCallback<
  Partial<TPointerEventInfo<TPointerEvent>> & {
    deselected: FabricObject[];
  }
>;

type TObjectAddedHandler = TEventCallback<TPointerEventInfo<TPointerEvent>>;
type TObjectModifiedHandler = TEventCallback<TPointerEventInfo<TPointerEvent>>;
type TObjectRemovedHandler = TEventCallback<TPointerEventInfo<TPointerEvent>>;
type TObjectMovingHandler = TEventCallback<TPointerEventInfo<TPointerEvent>>;
type TObjectResizingHandler = TEventCallback<TPointerEventInfo<TPointerEvent>>;
type TObjectRotatingHandler = TEventCallback<TPointerEventInfo<TPointerEvent>>;
type TObjectScalingHandler = TEventCallback<TPointerEventInfo<TPointerEvent>>;
type TObjectSkewingHandler = TEventCallback<TPointerEventInfo<TPointerEvent>>;
export type TDocumentInit = () => void;
export type TCanvasAddedHandler = () => void;
export type TCanvasDeletedHandler = () => void;
export type TCanvaseOrderedHandler = () => void;
export type TCurrentCanvasBefopreCangedHandler = () => void;
export type TCurrentCanvasCangedHandler = () => void;
export type TCurrentCanvasHistoryAddedHandler = () => void;
export type TCurrentCanvasSyncStatusHandler = (sync_status: "NEED_SYNC" | "SYNCING" | "SYNCED" | "ERROR") => void;
export type TTextEnterEditingHandler = () => void;

// Mapping event names to their handler types
export type TEventHandlers = {
  "mouse:down": TMouseDownHandler;
  "selection:created": TSelectionHandlerCreated;
  "selection:updated": TSelectionHandlerUpdated;
  "selection:cleared": TSelectionHandlerCleared;
  "object:added": TObjectAddedHandler;
  "object:modified": TObjectModifiedHandler;
  "object:removed": TObjectRemovedHandler;
  "object:moving": TObjectMovingHandler;
  "object:resizing": TObjectResizingHandler;
  "object:rotating": TObjectRotatingHandler;
  "object:scaling": TObjectScalingHandler;
  "object:skewing": TObjectSkewingHandler;
  "document:init": TDocumentInit;
  "canvas:added": TCanvasAddedHandler;
  "canvas:deleted": TCanvasDeletedHandler;
  "canvas:reorder": TCanvaseOrderedHandler;
  "current-canvas:before-changed": TCurrentCanvasBefopreCangedHandler;
  "current-canvas:changed": TCurrentCanvasCangedHandler;
  "current-canvas:history-changed": TCurrentCanvasHistoryAddedHandler;
  "current-canvas:sync-status": TCurrentCanvasSyncStatusHandler;
  "text:editing:entered": TTextEnterEditingHandler;
};

type TEvents = keyof TEventHandlers;

export default class DocumentManager {
  // Listeners store for event handlers
  private listeners: { [K in TEvents]: TEventHandlers[K][] } = {
    "mouse:down": [],
    "selection:created": [],
    "selection:updated": [],
    "selection:cleared": [],
    "object:added": [],
    "object:modified": [],
    "object:removed": [],
    "object:moving": [],
    "object:resizing": [],
    "object:rotating": [],
    "object:scaling": [],
    "object:skewing": [],
    "document:init": [],
    "canvas:added": [],
    "canvas:deleted": [],
    "canvas:reorder": [],
    "current-canvas:before-changed": [],
    "current-canvas:changed": [],
    "current-canvas:history-changed": [],
    "current-canvas:sync-status": [],
    "text:editing:entered": [],
  };
  //@ts-ignore
  document: Omit<IDocument, "pages">; // The document data
  pages: (CanvasPage | IDocumentPage)[] = []; // Array of document pages
  currentCanvas!: CanvasPage; // The currently active canvas
  copiedObj: FabricObject | null = null;

  fonts: TDocumentFont[] = [];

  //@ts-expect-error
  documentPagesWrapperElState: HTMLElement;

  freeDrawingPancilBrush: CanvasPencilBrush | null = null;
  freeDrawingMarkerBrush: CanvasMarkerBrush | null = null;
  freeDrawingEraserBrush: CanvasEraserBrush | null = null;
  freeDrawingCursor: string = `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23a)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M3.939 18.93a1 1 0 0 0 1.131 1.13l4.29-.613a3 3 0 0 0 1.697-.848l9.428-9.428a3 3 0 0 0 0-4.243l-1.414-1.414a3 3 0 0 0-4.243 0L5.4 12.943a3 3 0 0 0-.848 1.697l-.613 4.29Z' fill='%23fff'/%3E%3Cpath d='m4.929 19.071 2.475-.354-2.121-2.12-.354 2.474Zm.531-3.712 3.18 3.181.578-.083a2 2 0 0 0 1.131-.566l9.428-9.428a1.99 1.99 0 0 0 .537-.973 1.99 1.99 0 0 0-.537-1.855l-1.414-1.414a2 2 0 0 0-2.828 0L6.107 13.65a2 2 0 0 0-.565 1.131l-.083.578Z' fill='${encodeURIComponent(BLACK_COLOR)}'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='a' x='-2' y='-1' width='28' height='28' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3CfeComposite in2='hardAlpha' operator='out'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/%3E%3CfeBlend in2='BackgroundImageFix' result='effect1_dropShadow_3181_2634'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow_3181_2634' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E") 2 20,auto`;

  constructor() {
    if (typeof document !== "undefined") {
      this.currentCanvas = new CanvasPage(undefined, { document: this });
    }

    // Bind methods
    this.fireMouseDown = this.fireMouseDown.bind(this);
    this.fireSelectionCreated = this.fireSelectionCreated.bind(this);
    this.fireSelectionUpdated = this.fireSelectionUpdated.bind(this);
    this.fireSelectionCleared = this.fireSelectionCleared.bind(this);
    this.fireObjectAdded = this.fireObjectAdded.bind(this);
    this.fireObjectModified = this.fireObjectModified.bind(this);
    this.fireObjectRemoved = this.fireObjectRemoved.bind(this);
    this.fireObjectMoving = this.fireObjectMoving.bind(this);
    this.fireObjectResizing = this.fireObjectResizing.bind(this);
    this.fireObjectRotating = this.fireObjectRotating.bind(this);
    this.fireObjectScaling = this.fireObjectScaling.bind(this);
    this.fireObjectSkewing = this.fireObjectSkewing.bind(this);
    this.fireObjectSkewing = this.fireObjectSkewing.bind(this);
    this.fireDocumentInit = this.fireDocumentInit.bind(this);
    this.fireCanvasAdded = this.fireCanvasAdded.bind(this);
    this.fireCanvasDeleted = this.fireCanvasDeleted.bind(this);
    this.fireCanvaseOrdered = this.fireCanvaseOrdered.bind(this);
    this.fireCurrentCanvasBeforeCanged = this.fireCurrentCanvasBeforeCanged.bind(this);
    this.fireCurrentCanvasCanged = this.fireCurrentCanvasCanged.bind(this);
    this.fireCurrentCanvasHistoryAdded = this.fireCurrentCanvasHistoryAdded.bind(this);
    this.fireCurrentCanvasSyncStatus = this.fireCurrentCanvasSyncStatus.bind(this);
    this.fireTextEnterEditing = this.fireTextEnterEditing.bind(this);
  }

  get documentPagesWrapperEl() {
    if (!this.documentPagesWrapperElState) {
      this.documentPagesWrapperElState = document.querySelector("#document-pages-wrapper") as HTMLElement;
    }
    return this.documentPagesWrapperElState;
  }
  // # event-listeners #

  // Add an event listener
  on<E extends TEvents>(eventName: E, callback: TEventHandlers[E]): void {
    this.listeners[eventName].push(callback);
  }

  // Remove an event listener
  off<E extends TEvents>(eventName: E, callback: TEventHandlers[E]): void {
    //@ts-expect-error
    this.listeners[eventName] = this.listeners[eventName].filter((listener) => listener !== callback);
  }

  // Fireters for new events
  fireMouseDown(options: TEventHandlers["mouse:down"]) {
    //@ts-expect-error
    this.listeners["mouse:down"].forEach((callback) => callback(options));
  }
  fireSelectionCreated(options: TEventHandlers["selection:created"]) {
    // if (!this.currentCanvas.getActiveObject()?.hasControls) return;
    this.listeners["selection:created"].forEach(
      (
        callback //@ts-expect-error
      ) => callback(options)
    );
  }
  fireSelectionUpdated(options: TEventHandlers["selection:updated"]) {
    // if (!this.currentCanvas.getActiveObject()?.hasControls) return;
    this.listeners["selection:updated"].forEach(
      (
        callback //@ts-expect-error
      ) => callback(options)
    );
  }
  fireSelectionCleared(options: TEventHandlers["selection:cleared"]) {
    this.listeners["selection:cleared"].forEach(
      (
        callback //@ts-expect-error
      ) => callback(options)
    );
  }
  fireObjectAdded(options: TEventHandlers["object:added"]) {
    //@ts-expect-error
    this.listeners["object:added"].forEach((callback) => callback(options));
  }
  fireObjectModified(options: TEventHandlers["object:modified"]) {
    //@ts-expect-error
    this.listeners["object:modified"].forEach((callback) => callback(options));
  }
  fireObjectRemoved(options: TEventHandlers["object:removed"]) {
    //@ts-expect-error
    this.listeners["object:removed"].forEach((callback) => callback(options));
  }
  fireObjectMoving(options: TEventHandlers["object:moving"]) {
    //@ts-expect-error
    this.listeners["object:moving"].forEach((callback) => callback(options));
  }
  fireObjectResizing(options: TEventHandlers["object:resizing"]) {
    //@ts-expect-error
    this.listeners["object:resizing"].forEach((callback) => callback(options));
  }
  fireObjectRotating(options: TEventHandlers["object:rotating"]) {
    //@ts-expect-error
    this.listeners["object:rotating"].forEach((callback) => callback(options));
  }
  fireObjectScaling(options: TEventHandlers["object:scaling"]) {
    //@ts-expect-error
    this.listeners["object:scaling"].forEach((callback) => callback(options));
  }
  fireObjectSkewing(options: TEventHandlers["object:skewing"]) {
    //@ts-expect-error
    this.listeners["object:skewing"].forEach((callback) => callback(options));
  }
  fireCurrentCanvasHistoryAdded() {
    this.listeners["current-canvas:history-changed"].forEach((callback) => callback());
  }
  fireCurrentCanvasSyncStatus(options: any) {
    this.listeners["current-canvas:sync-status"].forEach((callback) => callback(options));
  }
  fireTextEnterEditing() {
    this.listeners["text:editing:entered"].forEach((callback) => callback());
  }
  fireDocumentInit() {
    this.listeners["document:init"].forEach((callback) => callback());
  }
  fireCanvasAdded() {
    this.listeners["canvas:added"].forEach((callback) => callback());
  }
  fireCanvasDeleted() {
    this.listeners["canvas:deleted"].forEach((callback) => callback());
  }
  fireCanvaseOrdered() {
    this.listeners["canvas:reorder"].forEach((callback) => callback());
  }
  fireCurrentCanvasBeforeCanged() {
    this.listeners["current-canvas:before-changed"].forEach((callback) => callback());
  }
  fireCurrentCanvasCanged() {
    this.listeners["current-canvas:changed"].forEach((callback) => callback());
  }

  private subscribeCanvasEvents() {
    // Subscribe to the new events
    //@ts-expect-error
    this.currentCanvas.on("mouse:down", this.fireMouseDown); //@ts-expect-error
    this.currentCanvas.on("selection:created", this.fireSelectionCreated); //@ts-expect-error
    this.currentCanvas.on("selection:updated", this.fireSelectionUpdated); //@ts-expect-error
    this.currentCanvas.on("selection:cleared", this.fireSelectionCleared); //@ts-expect-error
    this.currentCanvas.on("object:added", this.fireObjectAdded); //@ts-expect-error
    this.currentCanvas.on("object:modified", this.fireObjectModified); //@ts-expect-error
    this.currentCanvas.on("object:removed", this.fireObjectRemoved); //@ts-expect-error
    this.currentCanvas.on("object:moving", this.fireObjectMoving); //@ts-expect-error
    this.currentCanvas.on("object:resizing", this.fireObjectResizing); //@ts-expect-error
    this.currentCanvas.on("object:rotating", this.fireObjectRotating); //@ts-expect-error
    this.currentCanvas.on("object:scaling", this.fireObjectScaling); //@ts-expect-error
    this.currentCanvas.on("object:skewing", this.fireObjectSkewing);
    this.currentCanvas.on("history:updated", this.fireCurrentCanvasHistoryAdded);
    this.currentCanvas.on("sync:status", this.fireCurrentCanvasSyncStatus);
    this.currentCanvas.on("text:editing:entered", this.fireTextEnterEditing);
  }

  private unscribeCanvasEvents() {
    // Unsubscribe from the previous events
    this.currentCanvas.off("mouse:down", this.fireMouseDown);
    this.currentCanvas.off("selection:created", this.fireSelectionCreated);
    this.currentCanvas.off("selection:updated", this.fireSelectionUpdated);
    this.currentCanvas.off("selection:cleared", this.fireSelectionCleared);
    this.currentCanvas.off("object:added", this.fireObjectAdded);
    this.currentCanvas.off("object:modified", this.fireObjectModified);
    this.currentCanvas.off("object:removed", this.fireObjectRemoved);
    this.currentCanvas.off("object:moving", this.fireObjectMoving);
    this.currentCanvas.off("object:resizing", this.fireObjectResizing);
    this.currentCanvas.off("object:rotating", this.fireObjectRotating);
    this.currentCanvas.off("object:scaling", this.fireObjectScaling);
    this.currentCanvas.off("object:skewing", this.fireObjectSkewing);
    this.currentCanvas.off("history:updated", this.fireCurrentCanvasHistoryAdded);
    this.currentCanvas.off("sync:status", this.fireCurrentCanvasSyncStatus);
    this.currentCanvas.off("text:editing:entered", this.fireTextEnterEditing);
  }

  async addNewFont(font: TDocumentFont | TGoogleFont) {
    await addfontInDocument(this.document._id, font);
  }

  async addFontToDocument(font: TFont) {
    // @ts-expect-error // Check if the font is already loaded
    if (!this.fonts.find((f) => (f.font_id || f._id) === (font.font_id || font._id))) {
      return await this.addNewFont(font);
    }
  }

  getFontByName(fontName: string) {
    return this.fonts.find((font) => font.name === fontName);
  }

  // Set a specific canvas page as current
  setCanvasPageAsCurrent(documentPageId: IDocumentPage["_id"]) {
    let findCanvas = this.pages.find((canvas) => canvas._id === documentPageId);
    if (!findCanvas || this.currentCanvas._id === findCanvas._id) return;

    this.fireCurrentCanvasBeforeCanged();

    if (!(findCanvas instanceof CanvasPage)) {
      //@ts-expect-error
      findCanvas.document = this;
      findCanvas = new CanvasPage(`canvas-${findCanvas._id}`, findCanvas);

      //set aspect ratio to canvas wrapper
      findCanvas.wrapperEl.style.aspectRatio = `${findCanvas.width}/${findCanvas.height}`;

      this.pages[this.pages.findIndex((canvas) => canvas._id === documentPageId)] = findCanvas;
    }

    // Remove event listeners from the previous canvas
    this.unscribeCanvasEvents();

    const prevCanvasIsDranignMode = this.currentCanvas.isDrawingMode; // Save the current drawing mode state
    const prevCanvasDrawingBrush = this.currentCanvas.freeDrawingBrush; // Save the current drawing mode state
    this.currentCanvas.isDrawingMode = false; // Set freeDrawing to false // case if exist drawing mode

    this.currentCanvas.discardActiveObject(); // Discard active selection
    this.currentCanvas.requestRenderAll(); // Request a re-render for clear selection

    // Set the new current canvas
    this.currentCanvas = findCanvas;

    //# set freeDrawing states to new canvas
    this.currentCanvas.freeDrawingBrush = prevCanvasDrawingBrush; // Restore the previous drawing brush
    if (this.currentCanvas.freeDrawingBrush) {
      this.currentCanvas.freeDrawingBrush.canvas = this.currentCanvas as unknown as Canvas; // Change the canvas of the brush
    }
    this.currentCanvas.isDrawingMode = prevCanvasIsDranignMode; // Restore the previous is drawing mode state
    this.currentCanvas.freeDrawingCursor = this.freeDrawingCursor; // Restore the previous drawing cursor
    if (!this.freeDrawingPancilBrush) {
      this.freeDrawingPancilBrush = new CanvasPencilBrush(this.currentCanvas);
    }
    this.freeDrawingPancilBrush.canvas = this.currentCanvas as unknown as Canvas; // Change the canvas of the pencil brush
    if (!this.freeDrawingMarkerBrush) {
      this.freeDrawingMarkerBrush = new CanvasMarkerBrush(this.currentCanvas);
    }
    this.freeDrawingMarkerBrush.canvas = this.currentCanvas as unknown as Canvas; // Change the canvas of the marker brush
    if (!this.freeDrawingEraserBrush) {
      this.freeDrawingEraserBrush = new CanvasEraserBrush(this.currentCanvas);
    }
    this.freeDrawingEraserBrush.canvas = this.currentCanvas as unknown as Canvas; // Change the canvas of the eraser brush

    // Add event listeners to the new current canvas
    this.subscribeCanvasEvents();

    this.fireCurrentCanvasCanged();

    this.currentCanvas.selectCanvasPage(); // Select the new canvas

    if (!this.currentCanvas.initialized) {
      this.loadCanvasObjectsfromJson(documentPageId);
    }
  }

  // Load canvas objects from JSON
  loadCanvasObjectsfromJson(documentPageId: IDocumentPage["_id"]) {
    const canvas = this.pages.find((canvas) => canvas._id === documentPageId) as CanvasPage;
    if (!canvas || canvas.initialized) return;

    canvas.loadFromJSON(canvas as string | Record<string, any>).then(() => {
      canvas.initialized = true;
      this.currentCanvas._addHistory();
      canvas.requestRenderAll();
      this.currentCanvas.removeCanvasPlachholderBlurImage();
      this.currentCanvas.selectCanvasPage(); // Select the new canvas
      console.log("Loaded from JSON:", canvas);
    });
  }

  // Retrieve a canvas page by its ID
  getCanvasPageById(canvasPageId: IDocumentPage["_id"]) {
    return this.pages.find((canvas) => canvas._id === canvasPageId);
  }

  getPages() {
    return this.pages;
  }

  initDocument(document: IDocument) {
    this.document = document;

    this.pages = document.pages as unknown as CanvasPage[];

    this.setCanvasPageAsCurrent(document.pages[0]._id);

    this.freeDrawingPancilBrush = new CanvasPencilBrush(this.currentCanvas);
    this.freeDrawingMarkerBrush = new CanvasMarkerBrush(this.currentCanvas);
    this.freeDrawingEraserBrush = new CanvasEraserBrush(this.currentCanvas);

    this.fireDocumentInit();
  }

  async addDocumentPage({
    pageSize,
    pageOrientation,
    customWidth,
    customHeight,
  }: {
    pageSize: keyof typeof PAGE_SIZES | "CUSTOM";
    pageOrientation: TDocumentPageOrientation;
    customWidth?: number;
    customHeight?: number;
  }) {
    try {
      const width =
        pageSize === "CUSTOM"
          ? customWidth
          : pageOrientation === "PORTRAIT"
            ? PAGE_SIZES[pageSize].width
            : PAGE_SIZES[pageSize].height;
      const height =
        pageSize === "CUSTOM"
          ? customHeight
          : pageOrientation === "PORTRAIT"
            ? PAGE_SIZES[pageSize].height
            : PAGE_SIZES[pageSize].width;

      const newCanvas = {
        _id: new mongoose.Types.ObjectId().toString(),
        page_orientation: pageOrientation,
        page_size: pageSize,
        width,
        height,
        thumbnail: new StaticCanvas("", {
          width,
          height,
          backgroundColor: "white",
        }).toDataURL({ quality: 0.01, multiplier: 1, format: "webp" }),
        version: FABRIC_VERSION,
        objects: [],
      };

      await fetch(`${api_document_add_page}/${this.document._id}`, {
        method: "POST",
        body: JSON.stringify(newCanvas),
      })
        .then((res) => res.json())
        .then((res) => {
          clientNotification(res);

          if (res.type === "error") return;

          this.pages.push(newCanvas as unknown as CanvasPage);

          this.fireCanvasAdded();
        });

      return;
    } catch (error) {
      throw error;
    }
  }

  async addDocumentPageAfter(
    pageId: IDocumentPage["_id"],
    {
      pageSize = "A4",
      pageOrientation = "PORTRAIT",
      customWidth,
      customHeight,
    }: {
      pageSize?: keyof typeof PAGE_SIZES | "CUSTOM";
      pageOrientation?: TDocumentPageOrientation;
      customWidth?: number;
      customHeight?: number;
    }
  ) {
    try {
      const width =
        pageSize === "CUSTOM"
          ? customWidth
          : pageOrientation === "PORTRAIT"
            ? PAGE_SIZES[pageSize].width
            : PAGE_SIZES[pageSize].height;
      const height =
        pageSize === "CUSTOM"
          ? customHeight
          : pageOrientation === "PORTRAIT"
            ? PAGE_SIZES[pageSize].height
            : PAGE_SIZES[pageSize].width;

      const newCanvas = {
        _id: new mongoose.Types.ObjectId().toString(),
        page_orientation: pageOrientation,
        page_size: pageSize,
        width,
        height,
        thumbnail: new StaticCanvas("", {
          width,
          height,
          backgroundColor: "white",
        }).toDataURL({ quality: 0.01, multiplier: 1, format: "webp" }),
        version: FABRIC_VERSION,
        objects: [],
      };

      await fetch(`${api_document_add_page_after}/${this.document._id}/${pageId}`, {
        method: "POST",
        body: JSON.stringify(newCanvas),
      })
        .then((res) => res.json())
        .then((res) => {
          clientNotification(res);

          if (res.type === "error") return;
          this.pages.splice(
            this.pages.findIndex((canvas) => canvas._id === pageId) + 1,
            0,
            newCanvas as unknown as CanvasPage
          );

          this.fireCanvasAdded();
        });

      return;
    } catch (error) {
      throw error;
    }
  }

  async duplucateDocumentPage(
    pageId: IDocumentPage["_id"],
    {
      pageSize = "A4",
      pageOrientation = "PORTRAIT",
      customWidth,
      customHeight,
    }: {
      pageSize?: keyof typeof PAGE_SIZES | "CUSTOM";
      pageOrientation?: TDocumentPageOrientation;
      customWidth?: number;
      customHeight?: number;
    }
  ) {
    try {
      const targetCanvas = this.pages.find((canvas) => canvas._id === pageId) as CanvasPage | IDocumentPage;

      const width =
        pageSize === "CUSTOM"
          ? (customWidth as number)
          : pageOrientation === "PORTRAIT"
            ? PAGE_SIZES[pageSize].width
            : PAGE_SIZES[pageSize].height;
      const height =
        pageSize === "CUSTOM"
          ? (customHeight as number)
          : pageOrientation === "PORTRAIT"
            ? PAGE_SIZES[pageSize].height
            : PAGE_SIZES[pageSize].width;

      const newCanvasPayload = {
        _id: new mongoose.Types.ObjectId().toString(),
        page_orientation: pageOrientation,
        page_size: pageSize,
        width,
        height,
        backgroundColor: targetCanvas.backgroundColor as string,
        version: FABRIC_VERSION,
        thumbnail: targetCanvas.thumbnail,
        objects: targetCanvas instanceof CanvasPage ? targetCanvas.toJSON().objects : targetCanvas.objects,
      };

      await fetch(`${api_document_duplicate_page}/${this.document._id}/${pageId}`, {
        method: "POST",
        body: JSON.stringify({
          _id: newCanvasPayload._id,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          clientNotification(res);

          if (res.type === "error") return;
          this.pages.splice(this.pages.findIndex((canvas) => canvas._id === pageId) + 1, 0, newCanvasPayload);

          this.fireCanvasAdded();
        });

      return;
    } catch (error) {
      throw error;
    }
  }

  async deleteDocumentPage(pageId: IDocumentPage["_id"]) {
    try {
      const targetCanvasIndx = this.pages.findIndex((canvas) => canvas._id === pageId);

      await fetch(`${api_document_delete_page}/${this.document._id}/${pageId}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((res) => {
          clientNotification(res);

          if (res.type === "error") return;

          const targetCanvas = this.pages[targetCanvasIndx] as CanvasPage;

          this.pages.splice(targetCanvasIndx, 1);

          if (targetCanvas === this.currentCanvas) {
            this.setCanvasPageAsCurrent(
              targetCanvasIndx === 0 ? this.pages[0]._id : this.pages[targetCanvasIndx - 1]._id
            );
          }

          this.fireCanvasDeleted();
        });

      return;
    } catch (error) {
      throw error;
    }
  }

  async reOrderDocumentPages({ draggedIndex, dropIndex }: { draggedIndex: number; dropIndex: number }) {
    try {
      const draggedPage = this.pages[draggedIndex];

      const updatedPages = this.pages;

      updatedPages.splice(draggedIndex, 1); // remove from drag
      updatedPages.splice(dropIndex - (draggedIndex < dropIndex ? 1 : 0), 0, draggedPage); // add to drop

      this.fireCanvaseOrdered();

      await fetch(`${api_document_reorder_page}/${this.document._id}`, {
        method: "POST",
        body: JSON.stringify({ draggedIndex, dropIndex }),
      });

      return;
    } catch (error) {
      throw error;
    }
  }

  async addTemplate(template: ITemplate) {
    const templateFontsPayload = template.fonts.filter(
      (templateFont) =>
        !this.document.fonts.find(
          (documentFont) => documentFont.type === "GOOGLE" && documentFont.font_id === templateFont.font_id
        )
    );

    await templateFontsPayload.forEach(async (fontData) => {
      this.loadDocumentFont({ font: fontData, reflectDB: false });
    });

    const templatePagesPayload = template.pages.map((page) => ({
      ...page,
      _id: new mongoose.Types.ObjectId().toString(),
    }));

    templatePagesPayload.forEach((page) => {
      page.document = this;
      const canvas = new CanvasPage(`canvas-${page._id}`, page);

      //set aspect ratio to canvas wrapper
      canvas.wrapperEl.style.aspectRatio = `${page.width}/${page.height}`;

      this.pages.push(canvas);
    });

    await addTemplateInDocument(this.document._id, templatePagesPayload, templateFontsPayload);

    this.fireCanvasAdded();
  }

  //# Export handling
  async exportToPDF() {
    if (isEmpty(this.pages)) return;

    console.time("Exporting to PDF");

    const pdfDoc = new PDFDocument({
      autoFirstPage: false,
      displayTitle: true,
      // pdfVersion: ["1.3", "1.4", "1.5", "1.6", "1.7", "1.7ext3"].includes(this.document.metadata.PDFFormatVersion)
      //   ? (this.document.metadata.PDFFormatVersion as "1.3" | "1.4" | "1.5" | "1.6" | "1.7" | "1.7ext3")
      //   : undefined,
      pdfVersion: "1.7ext3", //using the latest version
      info: {
        CreationDate: this.document.metadata.CreationDate
          ? pdfDateToJsDate(this.document.metadata.CreationDate)
          : new Date(),
        ModDate: this.document.metadata.ModDate ? pdfDateToJsDate(this.document.metadata.ModDate) : new Date(),
        Creator: this.document.metadata.Creator || "",
        Producer: this.document.metadata.Producer || "",
        Title: this.document.metadata.Title || "",
        Subject: this.document.metadata.Subject || "",
        Keywords: this.document.metadata.Keywords || "",
      },
    });
    // pipe the document to a blob
    const stream = pdfDoc.pipe(BlobStream());

    pdfDoc.initForm();

    for (const canvas of this.pages) {
      console.log("page");

      pdfDoc.addPage({
        size:
          canvas.page_size !== "CUSTOM" && PAGE_SIZES[canvas.page_size].pdfKit_support
            ? canvas.page_size
            : canvas.page_orientation === "LANDSCAPE"
              ? [canvas.height, canvas.width]
              : [canvas.width, canvas.height],
        layout: canvas.page_orientation.toLowerCase() as "landscape" | "portrait",
      });

      if (canvas instanceof CanvasPage) {
        if (canvas.getActiveObject()) {
          canvas.discardActiveObject(); // Discard active selection to get objects instead of selection
          canvas.requestRenderAll(); // Request a re-render for clear selection
        }
      }

      const canvasObjects = canvas instanceof CanvasPage ? canvas.getObjects() : canvas.objects;

      for (let object of canvasObjects) {
        switch (object.type) {
          //# group
          case CanvasGroup.type:
            if (!(object instanceof CanvasGroup)) {
              object = (await CanvasGroup.fromObject(object)) as unknown as CanvasGroup;
            }
            await object.toPDF(pdfDoc, this.document);
            break;
          //# text
          case CanvasTextbox.type:
            if (!(object instanceof CanvasTextbox)) {
              object = (await CanvasTextbox.fromObject(object)) as unknown as CanvasTextbox;
            }
            object.toPDF(pdfDoc, this.document);
            break;
          //# element
          case CanvasRect.type:
            if (!(object instanceof CanvasRect)) {
              object = (await CanvasRect.fromObject(object)) as unknown as CanvasRect;
            }
            object.toPDF(pdfDoc);
            break;
          case CanvasPath.type:
            if (!(object instanceof CanvasPath)) {
              object = (await CanvasPath.fromObject(object)) as unknown as CanvasPath;
            }
            object.toPDF(pdfDoc);
            break;
          //# meadia
          case CanvasImage.type:
            if (!(object instanceof CanvasImage)) {
              object = (await CanvasImage.fromObject(object)) as unknown as CanvasImage;
            }
            await object.toPDF(pdfDoc);
            break;
          //# form
          case CanvasFeildInput.type:
            if (!(object instanceof CanvasFeildInput)) {
              object = (await CanvasFeildInput.fromObject(object)) as unknown as CanvasFeildInput;
            }
            object.toPDF(pdfDoc, this.document);
            break;
          case CanvasFeildTextarea.type:
            if (!(object instanceof CanvasFeildTextarea)) {
              object = (await CanvasFeildTextarea.fromObject(object)) as unknown as CanvasFeildTextarea;
            }
            object.toPDF(pdfDoc, this.document);
            break;
          case CanvasFeildSelect.type:
            if (!(object instanceof CanvasFeildSelect)) {
              object = (await CanvasFeildSelect.fromObject(object)) as unknown as CanvasFeildSelect;
            }
            object.toPDF(pdfDoc, this.document);
            break;
          case CanvasFeildSelectMultiple.type:
            if (!(object instanceof CanvasFeildSelectMultiple)) {
              object = (await CanvasFeildSelectMultiple.fromObject(object)) as unknown as CanvasFeildSelectMultiple;
            }
            object.toPDF(pdfDoc, this.document);
            break;
          case CanvasFeildCheckbox.type:
            if (!(object instanceof CanvasFeildCheckbox)) {
              object = (await CanvasFeildCheckbox.fromObject(object)) as unknown as CanvasFeildCheckbox;
            }
            object.toPDF(pdfDoc, this.document);
            break;
          case CanvasFeildRadio.type:
            if (!(object instanceof CanvasFeildRadio)) {
              object = (await CanvasFeildRadio.fromObject(object)) as unknown as CanvasFeildRadio;
            }
            object.toPDF(pdfDoc, this.document);
            break;
          //# drawing
          case CanvasPencilDrawingPath.type:
            if (!(object instanceof CanvasPencilDrawingPath)) {
              object = (await CanvasPencilDrawingPath.fromObject(object)) as unknown as CanvasPencilDrawingPath;
            }
            object.toPDF(pdfDoc);
            break;
          case CanvasMarkerDrawingPath.type:
            if (!(object instanceof CanvasMarkerDrawingPath)) {
              object = (await CanvasMarkerDrawingPath.fromObject(object)) as unknown as CanvasMarkerDrawingPath;
            }
            object.toPDF(pdfDoc);
            break;
          //# signature
          case CanvasSignatureText.type:
            if (!(object instanceof CanvasSignatureText)) {
              object = (await CanvasSignatureText.fromObject(object)) as unknown as CanvasSignatureText;
            }
            object.toPDF(pdfDoc, this.document);
            break;
        }
      }
    }

    pdfDoc.end();

    const documentName = this.document.name;

    // download the pdf
    stream.on("finish", function () {
      // get a blob you can do whatever you like with
      const blob = stream.toBlob("application/pdf");

      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = documentName;
      link.click();
      URL.revokeObjectURL(url);
    });
  }

  //# Page handling
  changePageBackgroundColor(
    ...args: Parameters<CanvasPage["changePageBackgroundColor"]>
  ): ReturnType<CanvasPage["changePageBackgroundColor"]> {
    this.currentCanvas.changePageBackgroundColor(...args);
  }
  changePageBackgroundOpacity(
    ...args: Parameters<CanvasPage["changePageBackgroundOpacity"]>
  ): ReturnType<CanvasPage["changePageBackgroundOpacity"]> {
    this.currentCanvas.changePageBackgroundOpacity(...args);
  }

  changeActiveObject(
    ...args: Parameters<CanvasPage["changeActiveObject"]>
  ): ReturnType<CanvasPage["changeActiveObject"]> {
    this.currentCanvas.changeActiveObject(...args);
  }
  setObjectFillColor(
    ...args: Parameters<CanvasPage["setObjectFillColor"]>
  ): ReturnType<CanvasPage["setObjectFillColor"]> {
    this.currentCanvas.setObjectFillColor(...args);
  }

  changeObjectStrokeColor(
    ...args: Parameters<CanvasPage["changeObjectStrokeColor"]>
  ): ReturnType<CanvasPage["changeObjectStrokeColor"]> {
    this.currentCanvas.changeObjectStrokeColor(...args);
  }

  changeObjectBorderWidth(
    ...args: Parameters<CanvasPage["changeObjectBorderWidth"]>
  ): ReturnType<CanvasPage["changeObjectBorderWidth"]> {
    this.currentCanvas.changeObjectBorderWidth(...args);
  }
  changeObjectStrokeDashArray(
    ...args: Parameters<CanvasPage["changeObjectStrokeDashArray"]>
  ): ReturnType<CanvasPage["changeObjectStrokeDashArray"]> {
    this.currentCanvas.changeObjectStrokeDashArray(...args);
  }

  setObjectOpacity(...args: Parameters<CanvasPage["setObjectOpacity"]>): ReturnType<CanvasPage["setObjectOpacity"]> {
    this.currentCanvas.setObjectOpacity(...args);
  }

  nudgeObject(...args: Parameters<CanvasPage["nudgeObject"]>): ReturnType<CanvasPage["nudgeObject"]> {
    this.currentCanvas.nudgeObject(...args);
  }

  // # Object arraing
  bringActiveObjectForward(): ReturnType<CanvasPage["bringActiveObjectForward"]> {
    this.currentCanvas.bringActiveObjectForward();
  }
  bringActiveObjectToFront(): ReturnType<CanvasPage["bringActiveObjectToFront"]> {
    this.currentCanvas.bringActiveObjectToFront();
  }
  sendActiveObjectBackward(): ReturnType<CanvasPage["sendActiveObjectBackward"]> {
    this.currentCanvas.sendActiveObjectBackward();
  }
  sendActiveObjectToBack(): ReturnType<CanvasPage["sendActiveObjectToBack"]> {
    this.currentCanvas.sendActiveObjectToBack();
  }

  // # Object align
  alignObjectToPageLeft(): ReturnType<CanvasPage["alignObjectToPageLeft"]> {
    this.currentCanvas.alignObjectToPageLeft();
  }
  alignObjectToPageCenter(): ReturnType<CanvasPage["alignObjectToPageCenter"]> {
    this.currentCanvas.alignObjectToPageCenter();
  }
  alignObjectToPageRight(): ReturnType<CanvasPage["alignObjectToPageRight"]> {
    this.currentCanvas.alignObjectToPageRight();
  }
  alignObjectToPageTop(): ReturnType<CanvasPage["alignObjectToPageTop"]> {
    this.currentCanvas.alignObjectToPageTop();
  }
  alignObjectToPageMiddle(): ReturnType<CanvasPage["alignObjectToPageMiddle"]> {
    this.currentCanvas.alignObjectToPageMiddle();
  }
  alignObjectToPageBottom(): ReturnType<CanvasPage["alignObjectToPageBottom"]> {
    this.currentCanvas.alignObjectToPageBottom();
  }

  // # Object dimension
  updateObjectWidth(...args: Parameters<CanvasPage["updateObjectWidth"]>): ReturnType<CanvasPage["updateObjectWidth"]> {
    this.currentCanvas.updateObjectWidth(...args);
  }
  updateObjectHeight(
    ...args: Parameters<CanvasPage["updateObjectHeight"]>
  ): ReturnType<CanvasPage["updateObjectHeight"]> {
    this.currentCanvas.updateObjectHeight(...args);
  }
  updateObjectLeft(...args: Parameters<CanvasPage["updateObjectLeft"]>): ReturnType<CanvasPage["updateObjectLeft"]> {
    this.currentCanvas.updateObjectLeft(...args);
  }
  updateObjectTop(...args: Parameters<CanvasPage["updateObjectTop"]>): ReturnType<CanvasPage["updateObjectTop"]> {
    this.currentCanvas.updateObjectTop(...args);
  }
  updateObjectAngle(...args: Parameters<CanvasPage["updateObjectAngle"]>): ReturnType<CanvasPage["updateObjectAngle"]> {
    this.currentCanvas.updateObjectAngle(...args);
  }

  // # Object layering
  changeObjectLayerOrder(
    ...args: Parameters<CanvasPage["changeObjectLayerOrder"]>
  ): ReturnType<CanvasPage["changeObjectLayerOrder"]> {
    this.currentCanvas.changeObjectLayerOrder(...args);
  }
  isObjectOverLaping(
    ...args: Parameters<CanvasPage["isObjectOverLaping"]>
  ): ReturnType<CanvasPage["isObjectOverLaping"]> {
    return this.currentCanvas.isObjectOverLaping(...args);
  }

  // # element panel
  addPathElement(...args: Parameters<CanvasPage["addPathElement"]>): ReturnType<CanvasPage["addPathElement"]> {
    this.currentCanvas.addPathElement(...args);
  }
  addRectElement(...args: Parameters<CanvasPage["addRectElement"]>): ReturnType<CanvasPage["addRectElement"]> {
    this.currentCanvas.addRectElement(...args);
  }
  addCircleElement(...args: Parameters<CanvasPage["addCircleElement"]>): ReturnType<CanvasPage["addCircleElement"]> {
    this.currentCanvas.addCircleElement(...args);
  }
  addLineElement(...args: Parameters<CanvasPage["addLineElement"]>): ReturnType<CanvasPage["addLineElement"]> {
    this.currentCanvas.addLineElement(...args);
  }

  // # text
  addText(...args: Parameters<CanvasPage["addText"]>): ReturnType<CanvasPage["addText"]> {
    this.currentCanvas.addText(...args);
  }
  changeObjectFont(...args: Parameters<CanvasPage["changeObjectFont"]>): ReturnType<CanvasPage["changeObjectFont"]> {
    this.currentCanvas.changeObjectFont(...args);
  }
  changeObjectFontSize(
    ...args: Parameters<CanvasPage["changeObjectFontSize"]>
  ): ReturnType<CanvasPage["changeObjectFontSize"]> {
    this.currentCanvas.changeObjectFontSize(...args);
  }
  changeObjectFontWeight(
    ...args: Parameters<CanvasPage["changeObjectFontWeight"]>
  ): ReturnType<CanvasPage["changeObjectFontWeight"]> {
    this.currentCanvas.changeObjectFontWeight(...args);
  }
  changeObjectFontStyle(
    ...args: Parameters<CanvasPage["changeObjectFontStyle"]>
  ): ReturnType<CanvasPage["changeObjectFontStyle"]> {
    this.currentCanvas.changeObjectFontStyle(...args);
  }
  changeObjectUnderline(
    ...args: Parameters<CanvasPage["changeObjectUnderline"]>
  ): ReturnType<CanvasPage["changeObjectUnderline"]> {
    this.currentCanvas.changeObjectUnderline(...args);
  }
  changeObjectLinethrough(
    ...args: Parameters<CanvasPage["changeObjectLinethrough"]>
  ): ReturnType<CanvasPage["changeObjectLinethrough"]> {
    this.currentCanvas.changeObjectLinethrough(...args);
  }
  changeTextUppercase(
    ...args: Parameters<CanvasPage["changeTextUppercase"]>
  ): ReturnType<CanvasPage["changeTextUppercase"]> {
    this.currentCanvas.changeTextUppercase(...args);
  }
  changeObjectTextAlign(
    ...args: Parameters<CanvasPage["changeObjectTextAlign"]>
  ): ReturnType<CanvasPage["changeObjectTextAlign"]> {
    this.currentCanvas.changeObjectTextAlign(...args);
  }
  changeTextListType(
    ...args: Parameters<CanvasPage["changeTextListType"]>
  ): ReturnType<CanvasPage["changeTextListType"]> {
    this.currentCanvas.changeTextListType(...args);
  }
  changeObjectCharSpacing(
    ...args: Parameters<CanvasPage["changeObjectCharSpacing"]>
  ): ReturnType<CanvasPage["changeObjectCharSpacing"]> {
    this.currentCanvas.changeObjectCharSpacing(...args);
  }
  changeObjectLineHeight(
    ...args: Parameters<CanvasPage["changeObjectLineHeight"]>
  ): ReturnType<CanvasPage["changeObjectLineHeight"]> {
    this.currentCanvas.changeObjectLineHeight(...args);
  }

  //# form
  changeFieldName(...args: Parameters<CanvasPage["changeFieldName"]>): ReturnType<CanvasPage["changeFieldName"]> {
    this.currentCanvas.changeFieldName(...args);
  }
  changeFieldPlaceholder(
    ...args: Parameters<CanvasPage["changeFieldPlaceholder"]>
  ): ReturnType<CanvasPage["changeFieldPlaceholder"]> {
    this.currentCanvas.changeFieldPlaceholder(...args);
  }
  changeFieldRequired(
    ...args: Parameters<CanvasPage["changeFieldRequired"]>
  ): ReturnType<CanvasPage["changeFieldRequired"]> {
    this.currentCanvas.changeFieldRequired(...args);
  }
  changeFieldSelectAllowMultiple(
    ...args: Parameters<CanvasPage["changeFieldSelectAllowMultiple"]>
  ): ReturnType<CanvasPage["changeFieldSelectAllowMultiple"]> {
    this.currentCanvas.changeFieldSelectAllowMultiple(...args);
  }
  changeFieldOption(...args: Parameters<CanvasPage["changeFieldOption"]>): ReturnType<CanvasPage["changeFieldOption"]> {
    this.currentCanvas.changeFieldOption(...args);
  }
  addFieldOption(...args: Parameters<CanvasPage["addFieldOption"]>): ReturnType<CanvasPage["addFieldOption"]> {
    this.currentCanvas.addFieldOption(...args);
  }
  deleteFieldOption(...args: Parameters<CanvasPage["deleteFieldOption"]>): ReturnType<CanvasPage["deleteFieldOption"]> {
    this.currentCanvas.deleteFieldOption(...args);
  }
  changeFieldBackgroundColor(
    ...args: Parameters<CanvasPage["changeFieldBackgroundColor"]>
  ): ReturnType<CanvasPage["changeFieldBackgroundColor"]> {
    this.currentCanvas.changeFieldBackgroundColor(...args);
  }
  addFormField(...args: Parameters<CanvasPage["addFormField"]>): ReturnType<CanvasPage["addFormField"]> {
    this.currentCanvas.addFormField(...args);
  }

  //# drawing
  setDrawingMode(mode: "pencil" | "marker" | "eraser") {
    this.currentCanvas.isDrawingMode = true;

    if (mode === "eraser") {
      this.freeDrawingCursor = DRAWING_ERASER_CURSOR; // set cursor to canvas
      this.currentCanvas.freeDrawingBrush = this.freeDrawingEraserBrush as CanvasEraserBrush; // set brush to canvas
    } else {
      if (mode === "marker") {
        this.currentCanvas.freeDrawingBrush = this.freeDrawingMarkerBrush as CanvasMarkerBrush; // set brush to canvas
        this.freeDrawingCursor = `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23a)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M3.939 18.93a1 1 0 0 0 1.131 1.13l4.29-.613a3 3 0 0 0 1.697-.848l9.428-9.428a3 3 0 0 0 0-4.243l-1.414-1.414a3 3 0 0 0-4.243 0L5.4 12.943a3 3 0 0 0-.848 1.697l-.613 4.29Z' fill='%23fff'/%3E%3Cpath d='m4.929 19.071 2.475-.354-2.121-2.12-.354 2.474Zm.531-3.712 3.18 3.181.578-.083a2 2 0 0 0 1.131-.566l9.428-9.428a1.99 1.99 0 0 0 .537-.973 1.99 1.99 0 0 0-.537-1.855l-1.414-1.414a2 2 0 0 0-2.828 0L6.107 13.65a2 2 0 0 0-.565 1.131l-.083.578Z' fill='${encodeURIComponent(this.freeDrawingMarkerBrush?.color || BLACK_COLOR)}'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='a' x='-2' y='-1' width='28' height='28' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3CfeComposite in2='hardAlpha' operator='out'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/%3E%3CfeBlend in2='BackgroundImageFix' result='effect1_dropShadow_3181_2634'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow_3181_2634' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E") 2 20,auto`; // set cursor to canvas
      } else {
        this.currentCanvas.freeDrawingBrush = this.freeDrawingPancilBrush as CanvasPencilBrush; // set brush to canvas
        this.freeDrawingCursor = `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23a)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M3.939 18.93a1 1 0 0 0 1.131 1.13l4.29-.613a3 3 0 0 0 1.697-.848l9.428-9.428a3 3 0 0 0 0-4.243l-1.414-1.414a3 3 0 0 0-4.243 0L5.4 12.943a3 3 0 0 0-.848 1.697l-.613 4.29Z' fill='%23fff'/%3E%3Cpath d='m4.929 19.071 2.475-.354-2.121-2.12-.354 2.474Zm.531-3.712 3.18 3.181.578-.083a2 2 0 0 0 1.131-.566l9.428-9.428a1.99 1.99 0 0 0 .537-.973 1.99 1.99 0 0 0-.537-1.855l-1.414-1.414a2 2 0 0 0-2.828 0L6.107 13.65a2 2 0 0 0-.565 1.131l-.083.578Z' fill='${encodeURIComponent(this.freeDrawingPancilBrush?.color || BLACK_COLOR)}'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='a' x='-2' y='-1' width='28' height='28' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3CfeComposite in2='hardAlpha' operator='out'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/%3E%3CfeBlend in2='BackgroundImageFix' result='effect1_dropShadow_3181_2634'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow_3181_2634' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E") 2 20,auto`; // set cursor to canvas
      }
    }

    this.currentCanvas.freeDrawingCursor = this.freeDrawingCursor; // set cursor to canvas

    const activeObj = this.currentCanvas.getActiveObject();
    if (activeObj) {
      this.currentCanvas.discardActiveObject();
      this.currentCanvas.requestRenderAll();
    }
  }
  setDrawingSelectMode() {
    this.currentCanvas.isDrawingMode = false;
    this.currentCanvas.selectMode = "drawing";
  }
  exitDrawingMode() {
    this.currentCanvas.isDrawingMode = false;
    this.currentCanvas.selectMode = null;
  }
  setDrawingColor(color: string, mode: "pencil" | "marker") {
    if (mode === "marker") {
      (this.freeDrawingMarkerBrush as CanvasMarkerBrush).color = color; // set color of the brush
    } else {
      (this.freeDrawingPancilBrush as CanvasPencilBrush).color = color; // set color of the brush
    }
    (this.currentCanvas.freeDrawingBrush as CanvasMarkerBrush).color = color; // set color of brush to canvas
    this.freeDrawingCursor = `url("data:image/svg+xml;charset=utf-8,%3Csvg width='24' height='24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg filter='url(%23a)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M3.939 18.93a1 1 0 0 0 1.131 1.13l4.29-.613a3 3 0 0 0 1.697-.848l9.428-9.428a3 3 0 0 0 0-4.243l-1.414-1.414a3 3 0 0 0-4.243 0L5.4 12.943a3 3 0 0 0-.848 1.697l-.613 4.29Z' fill='%23fff'/%3E%3Cpath d='m4.929 19.071 2.475-.354-2.121-2.12-.354 2.474Zm.531-3.712 3.18 3.181.578-.083a2 2 0 0 0 1.131-.566l9.428-9.428a1.99 1.99 0 0 0 .537-.973 1.99 1.99 0 0 0-.537-1.855l-1.414-1.414a2 2 0 0 0-2.828 0L6.107 13.65a2 2 0 0 0-.565 1.131l-.083.578Z' fill='${encodeURIComponent(color)}'/%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='a' x='-2' y='-1' width='28' height='28' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeColorMatrix in='SourceAlpha' values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0' result='hardAlpha'/%3E%3CfeOffset dy='1'/%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3CfeComposite in2='hardAlpha' operator='out'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0'/%3E%3CfeBlend in2='BackgroundImageFix' result='effect1_dropShadow_3181_2634'/%3E%3CfeBlend in='SourceGraphic' in2='effect1_dropShadow_3181_2634' result='shape'/%3E%3C/filter%3E%3C/defs%3E%3C/svg%3E") 2 20,auto`;
    this.currentCanvas.freeDrawingCursor = this.freeDrawingCursor;
  }
  setDrawingOpacity(opacity: number, mode: "pencil" | "marker") {
    if (mode === "marker") {
      (this.freeDrawingMarkerBrush as CanvasMarkerBrush).opacity = opacity; // set color of the brush
    } else {
      (this.freeDrawingPancilBrush as CanvasPencilBrush).opacity = opacity; // set color of the brush
    }
    (this.currentCanvas.freeDrawingBrush as CanvasMarkerBrush).opacity = opacity; // set brush to canvas
  }
  setDrawingWeightStyle(weightStyle: TborderStyle, mode: "pencil" | "marker") {
    if (mode === "marker") {
      (this.freeDrawingMarkerBrush as CanvasMarkerBrush).width = weightStyle.strokeWidth; // set color of the brush
      (this.freeDrawingMarkerBrush as CanvasMarkerBrush).strokeDashArray = weightStyle.strokeDashArray; // set color of the brush
    } else {
      (this.freeDrawingPancilBrush as CanvasPencilBrush).width = weightStyle.strokeWidth; // set color of the brush
      (this.freeDrawingPancilBrush as CanvasPencilBrush).strokeDashArray = weightStyle.strokeDashArray; // set color of the brush
    }
    (this.currentCanvas.freeDrawingBrush as CanvasPencilBrush).width = weightStyle.strokeWidth; // set brush to canvas
    (this.currentCanvas.freeDrawingBrush as CanvasPencilBrush).strokeDashArray = weightStyle.strokeDashArray; // set brush to canvas
  }

  //#signature
  addSignatureText(...args: Parameters<CanvasPage["addSignatureText"]>): ReturnType<CanvasPage["addSignatureText"]> {
    this.currentCanvas.addSignatureText(...args);
  }

  //#media
  addMediaImage(...args: Parameters<CanvasPage["addMediaImage"]>): ReturnType<CanvasPage["addMediaImage"]> {
    this.currentCanvas.addMediaImage(...args);
  }
  addMediaVideo(...args: Parameters<CanvasPage["addMediaVideo"]>): ReturnType<CanvasPage["addMediaVideo"]> {
    this.currentCanvas.addMediaVideo(...args);
  }
  addMediaAudio(...args: Parameters<CanvasPage["addMediaAudio"]>): ReturnType<CanvasPage["addMediaAudio"]> {
    this.currentCanvas.addMediaAudio(...args);
  }
  //undo
  undo(...args: Parameters<CanvasPage["undo"]>) {
    this.currentCanvas.undo(...args);
  }
  //redo
  redo(...args: Parameters<CanvasPage["redo"]>) {
    this.currentCanvas.redo(...args);
  }
}
