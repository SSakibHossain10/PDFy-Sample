import { IPopover } from "@/hooks/usePopover";
import useUpdatePopoverHeight from "@/hooks/useUpdatePopoverHeight";
import CloseIcn from "@icons/doutone/close-circle.svg";
import { useState } from "react";
import LayerAllPanel from "./LayerAllPanel";
import LayerOverlappingPanel from "./LayerOverlappingPanel";

type TTabType = "all" | "overlapping";

export const SVG_HEIGHT = 40;
export const SVG_WIDTH = 200;

function LayerPanel({ myPopover }: { myPopover: IPopover<HTMLDialogElement> }) {
  const [activeTab, setActiveTab] = useState<TTabType>("all");

  useUpdatePopoverHeight(myPopover.popoverRef, "--layer-panel-popover-height");

  return (
    <section className="w-screen sm:w-89.5 bg-gr-multi-dark sm:bg-gr-multi-dark flex flex-col rounded-t-xl sm:rounded-xl">
      <button
        popoverTarget={myPopover.popoverTarget}
        popoverTargetAction="hide"
        className="absolute right-2.5 sm:right-3 top-2.5 sm:top-3"
      >
        <CloseIcn className="size-7 active:text-primary-500" />
      </button>

      <div className="flex justify-center py-2 pt-3 sm:py-3">
        <h5 className="font-medium">Layer</h5>
      </div>

      <div
        className={`order-2 grow w-full opacity-100 translate-y-0 transition-all sx:starting:translate-y-full sx:starting:opacity-0 overflow-hidden ${
          activeTab === "all" ? "flex" : "hidden"
        }`}
      >
        <LayerAllPanel parentPopover={myPopover} />
      </div>

      <div
        className={`order-2 grow w-full opacity-100 translate-y-0 transition-all sx:starting:translate-y-full sx:starting:opacity-0 overflow-hidden ${
          activeTab === "overlapping" ? "flex" : "hidden"
        }`}
      >
        <LayerOverlappingPanel parentPopover={myPopover} />
      </div>

      <div className="shrink-0 z-10 order-3 sm:order-1 bg-primary-50/5 h-7 grid grid-cols-2 text-sm rounded-full w-full">
        <button
          className={`grow p-1 text-xs text-center rounded-full ${
            activeTab === "all" ? "bg-primary-50/10 font-light" : "font-semibold"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All
        </button>
        <button
          className={`grow p-1 text-xs text-center rounded-full ${
            activeTab === "overlapping" ? "bg-primary-50/10 font-light" : "font-semibold"
          }`}
          onClick={() => setActiveTab("overlapping")}
        >
          Overlapping
        </button>
      </div>
    </section>
  );
}

export default LayerPanel;
