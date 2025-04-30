import { CSSProperties } from "react";
import { LiaFileExportSolid } from "react-icons/lia";
import { documentManager } from "../../../documentManager";

const Export = () => {
  const handleExport = () => {
    console.log("exports", documentManager.currentCanvas.toJSON());
    documentManager.exportToPDF();
  };

  return (
    <>
      <button
        aria-describedby="export-tooltip"
        className="bg-primary-50/5 px-3 py-1.5 mr-2 flex items-center gap-1 rounded-full hover:[&+*]:inline active:[&+*]:inline"
        style={{ anchorName: "--export-anchor" } as CSSProperties}
        onClick={handleExport}
      >
        <LiaFileExportSolid className="size-4.5" />
        <p>Export</p>
      </button>
      {/* export-tooltip */}
      <div
        id="export-tooltip"
        className="hidden transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[left]"
        style={{ positionAnchor: "--export-anchor" } as CSSProperties}
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 mr-1 text-sm text-nowrap rounded-2xl shadow-lg">
          Export
        </p>
      </div>
    </>
  );
};

export default Export;
