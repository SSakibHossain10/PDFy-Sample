"use client";

import { DEFAULT_FONT_FAMILY, DEFAULT_FONT_WEIGHT } from "@/constants/document";
import { TDocumentFont } from "@/schemas/documentSchema";
import { TGoogleFont } from "@/schemas/fontSchema";
import DocumentIcn from "@icons/doutone/document.svg";
import FontIcn from "@icons/doutone/font.svg";
import { useSearchParams } from "next/navigation";
import { RefObject, ToggleEvent, useEffect, useMemo, useRef, useState } from "react";
import CanvasTextbox from "../../../../classes/CanvasTextbox";
import { documentManager } from "../../../../documentManager";
import FontFamilyCard from "./FontFamilyCard";

export type TActiveTextFont = {
  fontFamily: CanvasTextbox["fontFamily"];
  fontWeight: CanvasTextbox["fontWeight"];
};

export type THandleChangeActiveTextFont = ({
  fontFamily,
  fontWeight,
  font,
  fontUpdattedInDbCallback,
}: {
  fontFamily: TActiveTextFont["fontFamily"];
  fontWeight: TActiveTextFont["fontWeight"];
  font: TDocumentFont | TGoogleFont;
  fontUpdattedInDbCallback: () => void;
}) => void;

function FontFamilyCardsWrapper({
  globalFonts: globalFontsProp,
  documentFonts: documentFontsProp,
}: {
  globalFonts: TGoogleFont[];
  documentFonts: TDocumentFont[];
}) {
  const cardWrapperRef = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;

  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("searchQuery") as string;

  const documentFonts = useMemo(
    () =>
      searchQuery
        ? documentFontsProp.filter((font) => font.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : documentFontsProp,
    [documentFontsProp, searchQuery]
  );
  const globalFonts = useMemo(
    () =>
      searchQuery
        ? globalFontsProp.filter((font) => font.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : globalFontsProp,
    [globalFontsProp, searchQuery]
  );

  useEffect(() => {
    documentManager.loadDocumentFontsInitally(documentFonts);
  }, []);

  useEffect(() => {
    documentManager.fonts = documentFonts;
  }, [documentFonts]);

  const [activeTextFont, setActiveTextFont] = useState<TActiveTextFont>({
    fontFamily: DEFAULT_FONT_FAMILY,
    fontWeight: DEFAULT_FONT_WEIGHT,
  });

  const handleChangeActiveTextFont: THandleChangeActiveTextFont = ({
    fontFamily,
    fontWeight,
    font,
    fontUpdattedInDbCallback,
  }) => {
    setActiveTextFont({ fontFamily, fontWeight });
    documentManager.loadDocumentFont({
      font,
      fontLoadedcllbcak() {
        documentManager.changeObjectFont({ fontFamily, fontWeight });
      },
      fontUpdattedInDbCallback() {
        setActiveTextFont({ fontFamily, fontWeight });
        fontUpdattedInDbCallback();
      },
    });
  };

  const setStateHandler = () => {
    const activeObj = documentManager.currentCanvas.getActiveObject() as CanvasTextbox;
    setActiveTextFont({
      fontFamily: activeObj.fontFamily,
      fontWeight: activeObj.fontWeight || DEFAULT_FONT_WEIGHT,
    });
  };

  const setStateOnPopoverOpen = (e: ToggleEvent<HTMLDivElement>) => {
    if (e.newState === "open") {
      // setsearchQuery("");
      setStateHandler();
    }
  };

  //@ts-expect-error
  const resetStateOnObjectSelection: TSelectionHandlerCreated = ({ selected }: { selected: CanvasObject[] }) => {
    if (
      (cardWrapperRef.current.parentNode?.parentNode?.parentNode?.parentNode as HTMLDialogElement).matches(
        ":popover-open"
      )
    ) {
      if (
        !selected.some(
          (object) => object.type === "text"
          //new selection doesn't have a text object
        )
      ) {
        console.log("hide");
        (cardWrapperRef.current.parentNode?.parentNode?.parentNode?.parentNode as HTMLDialogElement).hidePopover();
        return;
      }

      setStateHandler();
    }
  };

  useEffect(() => {
    (cardWrapperRef.current.parentNode?.parentNode?.parentNode?.parentNode as HTMLDialogElement).addEventListener(
      "beforetoggle",
      setStateOnPopoverOpen as unknown as EventListener
    );
    documentManager.on("selection:created", resetStateOnObjectSelection);
    documentManager.on("selection:updated", resetStateOnObjectSelection);

    return () => {
      (
        cardWrapperRef.current?.parentNode?.parentNode?.parentNode?.parentNode as HTMLDialogElement
      )?.removeEventListener("beforetoggle", setStateOnPopoverOpen as unknown as EventListener);
      documentManager.off("selection:created", resetStateOnObjectSelection);
      documentManager.off("selection:updated", resetStateOnObjectSelection);
    };
  }, []);

  return (
    <div className="min-h-30 flex flex-col gap-4 p-4 overflow-x-hidden overflow-y-auto">
      {[...documentFonts, ...globalFonts].length === 0 && (
        <div className="flex flex-col gap-3 p-3 justify-center items-center">
          <h5>No fonts found</h5>
          <p>Try searching with different keywords</p>
        </div>
      )}

      {/* local */}
      {documentFonts.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex gap-1 data-[hide=true]:hidden" data-hide={!!searchQuery}>
            <DocumentIcn className="size-6" />
            <h4>Document fonts</h4>
          </div>
          <div className="flex flex-col" ref={cardWrapperRef}>
            {documentFonts.map((font) => (
              <FontFamilyCard
                font={font}
                key={font._id}
                activeTextFont={activeTextFont}
                handleChangeActiveTextFont={handleChangeActiveTextFont}
              />
            ))}
          </div>
        </div>
      )}

      <span
        className="border-t border-primary-300/30 data-[hide=true]:hidden"
        data-hide={!!searchQuery && (!documentFonts.length || !globalFonts.length)}
      />

      {/* global */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-1 data-[hide=true]:hidden" data-hide={!!searchQuery}>
          <FontIcn className="size-7" />
          <h4>Popular fonts</h4>
        </div>

        <div className="flex flex-col" ref={cardWrapperRef}>
          {globalFonts.map((font) => (
            <FontFamilyCard
              font={font}
              key={font._id}
              activeTextFont={activeTextFont}
              handleChangeActiveTextFont={handleChangeActiveTextFont}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default FontFamilyCardsWrapper;
