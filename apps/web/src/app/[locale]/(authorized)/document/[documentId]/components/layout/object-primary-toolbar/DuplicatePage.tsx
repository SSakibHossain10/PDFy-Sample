import { CSSProperties, useState } from "react";
import { IoDuplicate } from "react-icons/io5";
import { LiaSpinnerSolid } from "react-icons/lia";
import { documentManager } from "../../../documentManager";

const DuplicatePage = () => {
  const [duplicateing, setDuplicateing] = useState(false);

  const handleDuplicatePage = () => {
    setDuplicateing(true);
    const currentPage = documentManager.currentCanvas;
    documentManager
      .duplucateDocumentPage(currentPage._id, {
        pageSize: currentPage.page_size,
        pageOrientation: currentPage.page_orientation,
        customWidth: currentPage.page_size === "CUSTOM" ? currentPage.width : undefined,
        customHeight: currentPage.page_size === "CUSTOM" ? currentPage.height : undefined,
      })
      .finally(() => {
        setDuplicateing(false);
      });
  };

  return (
    <>
      <button
        aria-describedby="duplicate-page-tooltip"
        className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline disabled:animate-pulse"
        style={{ anchorName: "--duplicate-page-anchor" } as CSSProperties}
        disabled={duplicateing}
        onClick={handleDuplicatePage}
      >
        {duplicateing ? <LiaSpinnerSolid className="size-5 animate-spin" /> : <IoDuplicate className="size-5 p-0.25" />}

        <span className="sm:hidden text-2xs text-nowrap">{duplicateing ? "Duplicating" : "Duplicate"} page</span>
      </button>
      {/* duplicate-page-tooltip */}
      <div
        id="duplicate-page-tooltip"
        className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
        style={{ positionAnchor: "--duplicate-page-anchor" } as CSSProperties}
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
          Duplicate page
        </p>
      </div>
    </>
  );
};

export default DuplicatePage;
