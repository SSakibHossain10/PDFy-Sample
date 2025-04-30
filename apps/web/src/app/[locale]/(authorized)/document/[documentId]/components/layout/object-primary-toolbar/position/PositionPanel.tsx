import { IPopover } from "@/hooks/usePopover";
import useUpdatePopoverHeight from "@/hooks/useUpdatePopoverHeight";
import { useI18n } from "@/locales/client";
import CloseIcn from "@icons/doutone/close-circle.svg";
import { useState } from "react";
import AdvancedBar from "./AdvancedBar";
import AlignBar from "./AlignBar";
import ArrangeBar from "./ArrangeBar";

type TTabType = "arrange" | "align" | "advanced";

function PositionPanel({ myPopover }: { myPopover: IPopover<HTMLDialogElement> }) {
  const [activeTab, setActiveTab] = useState<TTabType>("arrange");

  const t = useI18n();

  useUpdatePopoverHeight(myPopover.popoverRef, "--position-panel-popover-height");

  return (
    <section className="w-screen sm:w-89.5 h-fit sm:h-[calc(100dvh-var(--layout-top-bar))] sx:max-h-[40vh] bg-gr-multi-dark flex flex-col rounded-t-xl sm:rounded-xl">
      <button
        popoverTarget={myPopover.popoverTarget}
        popoverTargetAction="hide"
        className="absolute right-2.5 sm:right-3 top-3"
      >
        <CloseIcn className="size-7 active:text-primary-500" />
      </button>

      <div className="flex justify-center pt-3">
        <h5 className="font-medium">{t("Position")}</h5>
      </div>

      <div className="p-2.5 sm:p-4 sx:pb-3.5 flex flex-col gap-7 overflow-y-auto scrollbar-hidden">
        <div
          className={`w-full h-fit flex-col gap-3 ${
            activeTab === "arrange" ? "flex" : "hidden sm:flex"
          } opacity-100 translate-y-0 transition-all sx:starting:translate-y-full sx:starting:opacity-0`}
        >
          <h6 className="hidden sm:inline-block">{t("Arrange")}</h6>
          <ArrangeBar parentPopover={myPopover} />
        </div>
        <div
          className={`w-full h-fit flex-col gap-3 ${
            activeTab === "align" ? "flex" : "hidden sm:flex"
          } opacity-100 translate-y-0 transition-all sx:starting:translate-y-full sx:starting:opacity-0`}
        >
          <h6 className="hidden sm:inline-block">{t("Align")}</h6>
          <AlignBar parentPopover={myPopover} />
        </div>
        <div
          className={`w-full h-fit flex-col gap-3 pb-1 ${
            activeTab === "advanced" ? "flex" : "hidden sm:flex"
          } opacity-100 translate-y-0 transition-all sx:starting:translate-y-full sx:starting:opacity-0`}
        >
          <h6 className="hidden sm:inline-block">{t("Advanced")}</h6>
          <AdvancedBar parentPopover={myPopover} />
        </div>
      </div>

      <div className="shrink-0 z-10 bg-primary-50/5 h-7 grid grid-cols-3 text-sm rounded-full w-full sm:hidden">
        <button
          className={`grow p-1 text-xs text-center rounded-full ${
            activeTab === "arrange" ? "bg-primary-50/10 font-light" : "font-semibold"
          }`}
          onClick={() => setActiveTab("arrange")}
        >
          {t("Arrange")}
        </button>
        <button
          className={`grow p-1 text-xs text-center rounded-full ${
            activeTab === "align" ? "bg-primary-50/10 font-light" : "font-semibold"
          }`}
          onClick={() => setActiveTab("align")}
        >
          {t("Align")}
        </button>
        <button
          className={`grow p-1 text-xs text-center rounded-full ${
            activeTab === "advanced" ? "bg-primary-50/10 font-light" : "font-semibold"
          }`}
          onClick={() => setActiveTab("advanced")}
        >
          {t("Advanced")}
        </button>
      </div>
    </section>
  );
}

export default PositionPanel;
