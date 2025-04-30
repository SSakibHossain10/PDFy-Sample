import usePopover from "@/hooks/usePopover";
import PagesIcn from "@public/icons/pages.svg";
import { CSSProperties, useEffect, useLayoutEffect, useState } from "react";
import { documentManager } from "../../../documentManager";
import OrganizePages from "../organize-pges/OrganizePages";

const OranizePagesIcn = () => {
  const organizPagesPopover = usePopover<HTMLDialogElement>();

  const [pageCount, setPageCount] = useState({
    totalPage: null as unknown as number,
    currentPage: 1,
  });

  const handleSetPageCount = () => {
    setPageCount({
      totalPage: documentManager.pages.length,
      currentPage: documentManager.pages.findIndex((cavas) => cavas === documentManager.currentCanvas) + 1,
    });
  };

  const handleSetTotalPageCount = () => {
    setPageCount((state) => ({
      ...state,
      totalPage: documentManager.pages.length,
    }));
  };

  const handleSetCurentPageCount = () => {
    setPageCount((state) => ({
      ...state,
      currentPage: documentManager.pages.findIndex((cavas) => cavas === documentManager.currentCanvas) + 1,
    }));
  };

  useEffect(() => {
    documentManager.on("document:init", handleSetPageCount);
    documentManager.on("canvas:added", handleSetTotalPageCount);
    documentManager.on("canvas:deleted", handleSetTotalPageCount);
    documentManager.on("canvas:reorder", handleSetCurentPageCount);
    documentManager.on("current-canvas:changed", handleSetCurentPageCount);
    return () => {
      documentManager.off("document:init", handleSetPageCount);
      documentManager.off("canvas:added", handleSetTotalPageCount);
      documentManager.off("canvas:deleted", handleSetTotalPageCount);
      documentManager.off("canvas:reorder", handleSetCurentPageCount);
      documentManager.off("current-canvas:changed", handleSetCurentPageCount);
    };
  }, []);

  const handleOpenOrganizePagesPopover = () => {
    if (document.documentElement.clientWidth >= 1024) {
      setTimeout(() => {
        organizPagesPopover.popoverRef.current.showPopover(); // show popover initially on large screens
      }, 0);
    }
  };

  useLayoutEffect(() => {
    documentManager.on("document:init", handleOpenOrganizePagesPopover);
    return () => {
      documentManager.off("document:init", handleOpenOrganizePagesPopover);
    };
  }, []);

  return (
    <>
      <dialog
        popover="manual"
        id={organizPagesPopover.id}
        ref={organizPagesPopover.popoverRef}
        className="popover-animation-translate-from-right top-12 sm:top-11 right-1 sm:right-0 sx:h-[calc(100dvh-var(--layout-top-bar)-var(--layout-bottom-bar)-var(--layout-tab-height)-8px)] sm:h-[calc(100dvh-var(--layout-top-bar))] organize-pages-panel-popover open:[&+*]:bg-forground/15"
      >
        <OrganizePages myPopover={organizPagesPopover} />
      </dialog>

      <button
        aria-describedby="pages-tooltip"
        disabled={pageCount.totalPage < 1}
        className="p-1.25 mx-1 hover:bg-forground/10 active:text-primary-500 rounded-lg relative hover:[&+*]:inline active:[&+*]:inline disabled:opacity-50"
        style={{ anchorName: "--pages-anchor" } as CSSProperties}
        popoverTarget={organizPagesPopover.popoverTarget}
      >
        <small className="absolute top-3.25 left-2.25 right-3 text-[9px] text-center" style={{ fontFamily: "serif" }}>
          {pageCount.totalPage}
        </small>
        <PagesIcn className="size-6 data-[loading=true]:animate-pulse" data-loading={!pageCount.totalPage} />
        <small
          className="absolute -bottom-0.25 right-4.5 text-[9px] p-0.5 min-w-[11px] underline"
          style={{ fontFamily: "serif" }}
        >
          {pageCount.currentPage}
        </small>
      </button>
      {/* pages-tooltip */}
      <div
        id="pages-tooltip"
        className="hidden transition-opacity delay-200 sm:delay-700 transition-discrete starting:opacity-0 opacity-100 z-50 absolute position-area-[left]"
        style={{ positionAnchor: "--pages-anchor" } as CSSProperties}
      >
        <p className="bg-gr-multi-dark bg-background/10 px-4 py-1.5 mr-1 text-sm text-nowrap rounded-2xl shadow-lg">
          {pageCount.totalPage < 1 ? "Pages not loaded yet" : "Pages"}
        </p>
      </div>
    </>
  );
};

export default OranizePagesIcn;
