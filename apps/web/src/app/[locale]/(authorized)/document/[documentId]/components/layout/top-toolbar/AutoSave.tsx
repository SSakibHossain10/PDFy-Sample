import CloudSyncLayoutIcn from "@icons/cloud-sync-layout.svg";
import { CSSProperties, useEffect, useState } from "react";
import { FaSyncAlt } from "react-icons/fa";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { MdOutlineError } from "react-icons/md";
import CanvasPage from "../../../classes/CanvasPage";
import { documentManager } from "../../../documentManager";

function AutoSave() {
  const [syncStatus, setSyncStatus] = useState<CanvasPage["sync_status"]>("SYNCED");

  const updateSyncStatusState = (sync_status: CanvasPage["sync_status"]) => {
    setSyncStatus(sync_status);
  };
  useEffect(() => {
    documentManager.on("current-canvas:sync-status", updateSyncStatusState);
    return () => {
      documentManager.off("current-canvas:sync-status", updateSyncStatusState);
    };
  }, []);

  const updateSyncStatusOnCanvasChanged = () => {
    setSyncStatus(documentManager.currentCanvas.sync_status);
  };
  useEffect(() => {
    documentManager.on("current-canvas:changed", updateSyncStatusOnCanvasChanged);
    return () => {
      documentManager.off("current-canvas:changed", updateSyncStatusOnCanvasChanged);
    };
  }, []);

  return (
    <>
      <button
        aria-describedby="auto-sync-tooltip"
        className="p-1.25 hover:bg-forground/10 active:text-primary-500 rounded-lg relative disabled:opacity-80 hover:[&+*]:inline active:[&+*]:inline disabled:animate-pulse"
        style={{ anchorName: "--auto-sync-anchor" } as CSSProperties}
        disabled={syncStatus === "SYNCING"}
        onClick={() => documentManager.currentCanvas.syncCanvas()}
      >
        <CloudSyncLayoutIcn className="size-7" />

        {syncStatus === "SYNCED" ? (
          <IoIosCheckmarkCircle className="size-3 absolute left-3 top-3.75" />
        ) : syncStatus === "SYNCING" ? (
          <FaSyncAlt className="size-2.5 absolute left-3.25 top-4.25 animate-spin" />
        ) : syncStatus === "ERROR" ? (
          <MdOutlineError className="size-2.5 absolute left-3.25 top-4.25 text-red-400" />
        ) : (
          <FaSyncAlt className="size-2.5 absolute left-3.25 top-4.25" />
        )}
      </button>
      {/* auto-sync-tooltip */}
      <div
        id="auto-sync-tooltip"
        className="hidden transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[right]"
        style={{ positionAnchor: "--auto-sync-anchor" } as CSSProperties}
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 ml-1 text-sm text-nowrap rounded-2xl shadow-lg">
          {syncStatus === "SYNCED" ? "Up to date" : syncStatus === "SYNCING" ? "Syncing..." : "Error syncing"}
        </p>
      </div>
    </>
  );
}

export default AutoSave;
