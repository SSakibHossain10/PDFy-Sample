import { PAGE_SIZES } from "@/data/page_sizing";
import { IPopover } from "@/hooks/usePopover";
import { IDocumentPage } from "@/schemas/documentSchema";
import { isEmpty } from "lodash";
import { Dispatch, RefObject, ToggleEvent, useEffect, useRef, useState } from "react";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { IoDuplicate, IoReorderThreeOutline } from "react-icons/io5";
import { LiaSpinnerSolid } from "react-icons/lia";
import { MdDeleteForever } from "react-icons/md";
import CanvasPage from "../../../classes/CanvasPage";
import { documentManager } from "../../../documentManager";
import { TDocumentPageOrientation } from "../../../types/document";
import PageSizing from "./page-sizing/PageSizing";

const OrganizePageCard = ({
  documentPage,
  index,
  currentPageId,
  parentPopover,
}: {
  documentPage: IDocumentPage | CanvasPage;
  index: number;
  currentPageId: string;
  parentPopover: IPopover<HTMLDialogElement>;
}) => {
  const [sizeSelectionType, setSizeSelectionType] = useState<"choose_from_a_preset" | "set_custom_page_size">(
    documentPage.page_size === "CUSTOM" ? "set_custom_page_size" : "choose_from_a_preset"
  );

  const [pageOrientation, setPageOrientation] = useState<TDocumentPageOrientation>("PORTRAIT");

  const [presetPageSize, setPresetPageSize] = useState<IDocumentPage["page_size"]>(documentPage.page_size || "A4");

  const [pageCustomWidth, setPageCustomWidth] = useState<number>(
    documentPage.page_size === "CUSTOM" ? documentPage.width : PAGE_SIZES.A4.width
  );
  const [pageCustomHeight, setPageCustomHeight] = useState<number>(
    documentPage.page_size === "CUSTOM" ? documentPage.height : PAGE_SIZES.A4.height
  );

  const pageAspectRatio =
    sizeSelectionType === "choose_from_a_preset"
      ? pageOrientation === "PORTRAIT"
        ? `1/${PAGE_SIZES[presetPageSize as keyof typeof PAGE_SIZES]?.aspectRatio}`
        : `${PAGE_SIZES[presetPageSize as keyof typeof PAGE_SIZES]?.aspectRatio}/1`
      : `${pageCustomWidth}/${pageCustomHeight}`;

  const previweEl = useRef(null) as unknown as RefObject<HTMLImageElement>;

  const curentCanvasGraphicsLiveUpdate = () => {
    const thisPage = documentManager.getCanvasPageById(documentPage._id);

    if (
      thisPage instanceof CanvasPage &&
      thisPage.initialized //this prevent exicutation while loaddFromJson
    ) {
      try {
        //  previweEl.current.src = util.copyCanvasElement(canvas.elements.lower.el).toDataURL({format: 'webp});
        previweEl.current.src = thisPage.toDataURL({
          quality: 0.1,
          multiplier: 1,
          format: "webp",
        });
      } catch (error) {
        console.error("error", error);
      }
    }
  };

  const currentCanvasGraphicsUpdateOnEditing = () => {
    if (documentManager.currentCanvas._id === documentPage._id) {
      curentCanvasGraphicsLiveUpdate();
    }
  };

  const currentCanvasGraphicsUpdateOnPopoverOpen = (e: ToggleEvent<HTMLDivElement>) => {
    if (e.newState === "open") {
      curentCanvasGraphicsLiveUpdate();

      documentManager.on("object:added", currentCanvasGraphicsUpdateOnEditing);
      documentManager.on("object:modified", currentCanvasGraphicsUpdateOnEditing);
      documentManager.on("object:removed", currentCanvasGraphicsUpdateOnEditing);
    } else {
      documentManager.off("object:added", currentCanvasGraphicsUpdateOnEditing);
      documentManager.off("object:modified", currentCanvasGraphicsUpdateOnEditing);
      documentManager.off("object:removed", currentCanvasGraphicsUpdateOnEditing);
    }
  };
  useEffect(() => {
    parentPopover.popoverRef.current.addEventListener(
      "toggle",
      currentCanvasGraphicsUpdateOnPopoverOpen as unknown as EventListener
    );
    return () => {
      parentPopover.popoverRef.current?.removeEventListener(
        "toggle",
        currentCanvasGraphicsUpdateOnPopoverOpen as unknown as EventListener
      );
    };
  }, []);

  const [adding, setAdding] = useState(false);
  const handleAddPage = () => {
    setAdding(true);
    documentManager
      .addDocumentPageAfter(documentPage._id, {
        pageSize: sizeSelectionType === "choose_from_a_preset" ? presetPageSize : "CUSTOM",
        pageOrientation:
          sizeSelectionType === "choose_from_a_preset"
            ? pageOrientation
            : pageCustomWidth > pageCustomHeight
              ? "LANDSCAPE"
              : "PORTRAIT",
        customWidth: sizeSelectionType === "choose_from_a_preset" ? undefined : pageCustomWidth,
        customHeight: sizeSelectionType === "choose_from_a_preset" ? undefined : pageCustomHeight,
      })
      .then(() => {
        setAdding(false);
        //#reconnect for update current page graphichs live update
        parentPopover.popoverRef.current.hidePopover();
        parentPopover.popoverRef.current.showPopover();
      })
      .catch(() => setAdding(false));
  };

  const [duplicating, setDuplicating] = useState(false);
  const handleDuplicatePage = () => {
    setDuplicating(true);
    documentManager
      .duplucateDocumentPage(documentPage._id, {
        pageSize: sizeSelectionType === "choose_from_a_preset" ? presetPageSize : "CUSTOM",
        pageOrientation:
          sizeSelectionType === "choose_from_a_preset"
            ? pageOrientation
            : pageCustomWidth > pageCustomHeight
              ? "LANDSCAPE"
              : "PORTRAIT",
        customWidth: sizeSelectionType === "choose_from_a_preset" ? undefined : pageCustomWidth,
        customHeight: sizeSelectionType === "choose_from_a_preset" ? undefined : pageCustomHeight,
      })
      .then(() => {
        setDuplicating(false);
        //#reconnect for update current page graphichs live update
        parentPopover.popoverRef.current.hidePopover();
        parentPopover.popoverRef.current.showPopover();
      })
      .catch(() => setDuplicating(false));
  };

  const [deleting, setDeleting] = useState(false);
  const handleDeletePage = () => {
    setDeleting(true);
    documentManager
      .deleteDocumentPage(documentPage._id)
      .then(() => setDeleting(false))
      .catch(() => setDeleting(false));
  };

  const handleSelectPage = () => {
    documentManager.setCanvasPageAsCurrent(documentPage._id);
  };

  return (
    <>
      <div className="shrink-0 w-8 flex flex-col justify-evenly z-10">
        {documentPage instanceof CanvasPage
          ? null //not show page sizing for current page ialeady initialized
          : isEmpty(documentPage.objects) && ( //show page sizing for empty page only
              <PageSizing
                setSizeSelectionType={(sizeSelectionType) => {
                  if (sizeSelectionType === "choose_from_a_preset") {
                    if (presetPageSize === "CUSTOM") {
                      // if user select preset page size then set default page size
                      setPageCustomWidth(PAGE_SIZES.A4.width);
                      setPageCustomHeight(PAGE_SIZES.A4.height);
                      setPresetPageSize("A4");
                    }
                  }

                  return setSizeSelectionType(sizeSelectionType as "choose_from_a_preset" | "set_custom_page_size");
                }}
                sizeSelectionType={sizeSelectionType}
                pageOrientation={pageOrientation}
                setPageOrientation={setPageOrientation}
                presetPageSize={presetPageSize as keyof typeof PAGE_SIZES}
                setPresetPageSize={setPresetPageSize as Dispatch<React.SetStateAction<keyof typeof PAGE_SIZES>>}
                pageCustomWidth={pageCustomWidth}
                setPageCustomWidth={setPageCustomWidth}
                pageCustomHeight={pageCustomHeight}
                setPageCustomHeight={setPageCustomHeight}
              />
            )}
        {documentManager.pages.length > 1 && (
          <button
            className="grow py-2 flex items-center justify-center hover:bg-primary-50/10 active:text-primary-500 rounded-md disabled:animate-pulse"
            onClick={handleDeletePage}
            disabled={deleting}
          >
            {deleting ? (
              <LiaSpinnerSolid className="size-5 p-0.5 animate-spin" />
            ) : (
              <MdDeleteForever className="size-5" />
            )}
          </button>
        )}

        <button
          className="grow py-2 flex items-center justify-center hover:bg-primary-50/10 active:text-primary-500 rounded-md disabled:animate-pulse"
          onClick={handleDuplicatePage}
          disabled={duplicating}
        >
          {duplicating ? <LiaSpinnerSolid className="size-4 animate-spin" /> : <IoDuplicate className="size-4" />}
        </button>

        <button
          className="grow py-2 flex items-center justify-center hover:bg-primary-50/10 active:text-primary-500 rounded-md disabled:animate-pulse"
          onClick={handleAddPage}
          disabled={adding}
        >
          {adding ? <LiaSpinnerSolid className="size-4 animate-spin" /> : <BsFillPlusCircleFill className="size-4" />}
        </button>
      </div>

      <div
        className="grow overflow-hidden z-10 flex items-center data-[active=true]:border-2 data-[active=true]:ring-1 border-primary-500 cursor-pointer hover:bg-forground/10 active:bg-background/10"
        data-active={documentPage._id === currentPageId}
        onClick={handleSelectPage}
      >
        <img
          ref={previweEl}
          loading="lazy"
          src={documentPage.thumbnail}
          width={documentPage.width}
          height={documentPage.height}
          alt={`page-${index + 1}-preview`}
          className="bg-primary-100/15 min-w-full"
          style={{
            aspectRatio: pageAspectRatio,
          }}
        />
      </div>

      <div className="shrink-0 w-8 py-2 gap-2 flex flex-col justify-between z-10">
        <h6 className="font-bold text-center">{index + 1}</h6>

        <button className="h-10 flex items-center justify-center hover:bg-primary-50/10 active:text-primary-500 rounded-md">
          <IoReorderThreeOutline className="size-6" />
        </button>

        <span className="h-5" />
      </div>
    </>
  );
};

export default OrganizePageCard;
