import { IPopover } from "@/hooks/usePopover";
import useUpdatePopoverHeight from "@/hooks/useUpdatePopoverHeight";
import CloseIcn from "@icons/doutone/close-circle.svg";
import { ReactNode } from "react";

function FontFamilyPanel({
  myPopover,
  FontFamiliesProvider,
}: {
  myPopover: IPopover<HTMLDialogElement>;
  FontFamiliesProvider: ReactNode;
}) {
  useUpdatePopoverHeight(myPopover.popoverRef, "--font-family-popover-height");

  return (
    <section
      className="w-screen sm:w-89.5 bg-gr-multi-dark flex flex-col rounded-t-xl sm:rounded-xl"
      id="document-font-family-panel"
    >
      <button
        popoverTarget={myPopover.popoverTarget}
        popoverTargetAction="hide"
        className="absolute right-2.5 sm:right-3 top-2.5 sm:top-3 z-50"
      >
        <CloseIcn className="size-7 active:text-primary-500" />
      </button>

      <div className="flex justify-center py-2 pt-3 sm:py-3">
        <h4 className="font-medium">Font family</h4>
      </div>

      {FontFamiliesProvider}
    </section>
  );
}

export default FontFamilyPanel;
