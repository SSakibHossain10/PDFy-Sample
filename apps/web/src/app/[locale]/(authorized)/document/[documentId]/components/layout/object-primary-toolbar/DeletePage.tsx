import { CSSProperties, useEffect, useState } from "react";
import { LiaSpinnerSolid } from "react-icons/lia";
import { MdDeleteForever } from "react-icons/md";
import { documentManager } from "../../../documentManager";

const DeletePage = () => {
  const [isDelatable, setIsDelatable] = useState(false);

  const setStateHandler = () => {
    setIsDelatable(documentManager.pages.length > 1);
  };
  useEffect(() => {
    documentManager.on("document:init", setStateHandler);
    documentManager.on("canvas:added", setStateHandler);
    documentManager.on("canvas:deleted", setStateHandler);
    documentManager.on("canvas:reorder", setStateHandler);
    return () => {
      documentManager.off("document:init", setStateHandler);
      documentManager.off("canvas:added", setStateHandler);
      documentManager.off("canvas:deleted", setStateHandler);
      documentManager.off("canvas:reorder", setStateHandler);
    };
  }, []);

  const [deleteing, setDeleteing] = useState(false);

  const handleDeletePage = () => {
    setDeleteing(true);
    const currentPage = documentManager.currentCanvas;
    documentManager.deleteDocumentPage(currentPage._id).finally(() => {
      setDeleteing(false);
    });
  };

  return (
    <>
      <button
        aria-describedby="delete-page-tooltip"
        className={`flex flex-col items-center gap-1 p-1.25 rounded-lg hover:bg-forground/10 active:text-primary-500 hover:[&+*]:inline active:[&+*]:inline ${!isDelatable ? "disabled:opacity-50" : "disabled:animate-pulse"}`}
        style={{ anchorName: "--delete-page-anchor" } as CSSProperties}
        disabled={!isDelatable || deleteing}
        onClick={handleDeletePage}
      >
        {deleteing ? <LiaSpinnerSolid className="size-5 animate-spin" /> : <MdDeleteForever className="size-5" />}

        <span className="sm:hidden text-2xs text-nowrap">{deleteing ? "Deleting" : "Delete"} page</span>
      </button>
      {/* delete-page-tooltip */}
      <div
        id="delete-page-tooltip"
        className="hidden hover:inline transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[top_center] sm:position-area-[bottom_center]"
        style={{ positionAnchor: "--delete-page-anchor" } as CSSProperties}
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 sx:mb-2 sm:mt-2 text-sm text-nowrap rounded-2xl shadow-lg">
          {isDelatable ? "Delete page" : "Cannot delete page as only one page is left"}
        </p>
      </div>
    </>
  );
};

export default DeletePage;
