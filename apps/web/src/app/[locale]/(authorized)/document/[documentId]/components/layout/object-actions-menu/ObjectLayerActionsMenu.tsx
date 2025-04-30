import { IPopover } from "@/hooks/usePopover";
import { BiLayerMinus, BiLayerPlus } from "react-icons/bi";
import { BsLayersHalf } from "react-icons/bs";
import { LuLayers2 } from "react-icons/lu";
import { documentManager } from "../../../documentManager";

const ObjectLayerActionsMenu = ({ parentPopover }: { parentPopover: IPopover<HTMLDialogElement> }) => {
  return (
    <section className="min-w-60 flex flex-col py-1.5 bg-gr-multi-dark rounded-xl border border-forground/20 shadow-md">
      <button
        className="w-full flex items-center gap-2 px-3 py-1.5 font-medium rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500"
        onClick={() => {
          documentManager.bringActiveObjectForward();
        }}
      >
        <BiLayerPlus size={21} />
        <h5 className="grow text-sm">Bring forward</h5>
        <span className="text-xs bg-primary-100/10 text-primary-400 font-light px-1.5 py-1 rounded-md">Ctrl+{"]"}</span>
      </button>
      <button
        className="w-full flex items-center gap-2 px-3 py-1.5 font-medium rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500"
        onClick={() => {
          documentManager.bringActiveObjectToFront();
        }}
        popoverTarget={parentPopover.popoverTarget}
        popoverTargetAction="hide"
      >
        <BsLayersHalf size={21} className="p-0.25" />
        <h5 className="grow text-sm">Bring to front</h5>
        <span className="text-xs bg-primary-100/10 text-primary-400 font-light px-1.5 py-1 rounded-md">
          Ctrl+Alt+{"]"}
        </span>
      </button>
      <button
        className="w-full flex items-center gap-2 px-3 py-1.5 font-medium rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500"
        onClick={() => {
          documentManager.sendActiveObjectBackward();
        }}
        popoverTarget={parentPopover.popoverTarget}
        popoverTargetAction="hide"
      >
        <BiLayerMinus size={21} />
        <h5 className="grow text-sm">Bring backward</h5>
        <span className="text-xs bg-primary-100/10 text-primary-400 font-light px-1.5 py-1 rounded-md">Ctrl+{"["}</span>
      </button>
      <button
        className="w-full flex items-center gap-2 px-3 py-1.5 font-medium rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500"
        onClick={() => {
          documentManager.sendActiveObjectToBack();
        }}
        popoverTarget={parentPopover.popoverTarget}
        popoverTargetAction="hide"
      >
        <BsLayersHalf size={21} className="p-0.25 rotate-180" />
        <h5 className="grow text-sm">Bring to back</h5>
        <span className="text-xs bg-primary-100/10 text-primary-400 font-light px-1.5 py-1 rounded-md">
          Ctrl+Atl+{"["}
        </span>
      </button>
      <span className="w-full h-0.25 bg-primary-200/30 my-1" />
      <button
        className="w-full flex items-center gap-2 px-3 py-1.5 font-medium cursor-pointer hover:bg-forground/10 active:text-primary-500"
        popoverTarget={parentPopover.popoverTarget}
        popoverTargetAction="hide"
      >
        <LuLayers2 size={21} className="p-0.5" />
        <h5 className="grow text-sm">Show layers</h5>
        <span className="text-xs bg-primary-100/10 text-primary-400 font-light px-1.5 py-1 rounded-md">Ctrl+1</span>
      </button>
    </section>
  );
};

export default ObjectLayerActionsMenu;
