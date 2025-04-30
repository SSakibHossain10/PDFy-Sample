import { CSSProperties, useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { LiaSpinnerSolid } from "react-icons/lia";
import { documentManager } from "../../../documentManager";

const AddPage = () => {
  const [adding, setAdding] = useState(false);

  const handleAddPage = () => {
    setAdding(true);
    const currentPage = documentManager.currentCanvas;
    documentManager
      .addDocumentPageAfter(currentPage._id, {
        pageSize: currentPage.page_size,
        pageOrientation: currentPage.page_orientation,
        customWidth: currentPage.page_size === "CUSTOM" ? currentPage.width : undefined,
        customHeight: currentPage.page_size === "CUSTOM" ? currentPage.height : undefined,
      })
      .finally(() => {
        setAdding(false);
      });
  };

  return (
    <>
      <button
        aria-describedby="add-page-tooltip"
        className="flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline disabled:animate-pulse"
        style={{ anchorName: "--add-page-anchor" } as CSSProperties}
        disabled={adding}
        onClick={handleAddPage}
      >
        {adding ? (
          <LiaSpinnerSolid className="size-5 animate-spin" />
        ) : (
          <BsFillPlusCircleFill className="size-5 p-0.25" />
        )}

        <span className="sm:hidden text-2xs text-nowrap">{adding ? "Adding" : "Add"} page</span>
      </button>
      {/* add-page-tooltip */}
      <div
        id="add-page-tooltip"
        className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
        style={{ positionAnchor: "--add-page-anchor" } as CSSProperties}
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
          Add page
        </p>
      </div>
    </>
  );
};

export default AddPage;
