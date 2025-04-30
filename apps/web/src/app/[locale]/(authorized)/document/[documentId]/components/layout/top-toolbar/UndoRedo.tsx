import RedoIcn from "@public/icons/redo.svg";
import UndoIcn from "@public/icons/undo.svg";
import { CSSProperties, useEffect, useState } from "react";
import { documentManager } from "../../../documentManager";

function UndoRedo() {
  const [undoable, setUndoable] = useState(false);
  const [redoable, setRedoable] = useState(false);

  const setUdoRedoableState = () => {
    console.log("setUdoRedoableState");

    setUndoable(documentManager.currentCanvas?.history.length > 1);
    setRedoable(documentManager.currentCanvas?.historyRedo.length > 0);
  };

  useEffect(() => {
    documentManager.on("current-canvas:changed", setUdoRedoableState);
    documentManager.on("current-canvas:history-changed", setUdoRedoableState);
    return () => {
      documentManager.off("current-canvas:changed", setUdoRedoableState);
      documentManager.off("current-canvas:history-changed", setUdoRedoableState);
    };
  }, []);

  const handleUndo = () => {
    documentManager.undo();
    setUdoRedoableState();
  };

  const handleRedo = () => {
    documentManager.redo();
    setUdoRedoableState();
  };
  return (
    <>
      <button
        aria-describedby="undo-tooltip"
        disabled={!undoable}
        onClick={handleUndo}
        className="p-1.25 hover:bg-forground/10 active:text-primary-500 rounded-lg hover:[&+*]:inline active:[&+*]:inline disabled:opacity-50"
        style={{ anchorName: "--undo-anchor" } as CSSProperties}
      >
        <UndoIcn className="size-6" />
      </button>
      {/* undo-tooltip */}
      <div
        id="undo-tooltip"
        className="hidden transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[right]"
        style={{ positionAnchor: "--undo-anchor" } as CSSProperties}
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 ml-1 text-sm text-nowrap rounded-2xl shadow-lg">
          {undoable ? "Undo" : "Nothing to undo"}
        </p>
      </div>

      <button
        aria-describedby="redo-tooltip"
        disabled={!redoable}
        onClick={handleRedo}
        className="p-1.25 hover:bg-forground/10 active:text-primary-500 rounded-lg hover:[&+*]:inline active:[&+*]:inline disabled:opacity-50"
        style={{ anchorName: "--redo-anchor" } as CSSProperties}
      >
        <RedoIcn className="size-6" />
      </button>
      {/* redo-tooltip */}
      <div
        id="redo-tooltip"
        className="hidden transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[right]"
        style={{ positionAnchor: "--redo-anchor" } as CSSProperties}
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 ml-1 text-sm text-nowrap rounded-2xl shadow-lg">
          {redoable ? "Redo" : "Nothing to redo"}
        </p>
      </div>
    </>
  );
}

export default UndoRedo;
