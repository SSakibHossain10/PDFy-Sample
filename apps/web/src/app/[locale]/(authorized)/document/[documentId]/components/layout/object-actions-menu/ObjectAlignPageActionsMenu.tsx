import {
  LuAlignCenterHorizontal,
  LuAlignCenterVertical,
  LuAlignEndHorizontal,
  LuAlignEndVertical,
  LuAlignStartHorizontal,
  LuAlignStartVertical,
} from "react-icons/lu";
import { documentManager } from "../../../documentManager";

const ObjectAlignPageActionsMenu = () => {
  return (
    <section className="min-w-36 flex flex-col py-1.5 bg-gr-multi-dark rounded-xl border border-forground/20 shadow-md">
      <button
        className="w-full flex items-center gap-2.5 px-3.5 py-1.5 font-medium rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500"
        onClick={() => {
          documentManager.alignObjectToPageLeft();
        }}
      >
        <LuAlignStartVertical size={21} className="p-0.5" />
        <h5 className="grow text-sm">Left</h5>
      </button>

      <button
        className="w-full flex items-center gap-2.5 px-3.5 py-1.5 font-medium rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500"
        onClick={() => {
          documentManager.alignObjectToPageCenter();
        }}
      >
        <LuAlignCenterVertical size={21} className="p-0.5" />
        <h5 className="grow text-sm">Center</h5>
      </button>

      <button
        className="w-full flex items-center gap-2.5 px-3.5 py-1.5 font-medium rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500"
        onClick={() => {
          documentManager.alignObjectToPageRight();
        }}
      >
        <LuAlignEndVertical size={21} className="p-0.5" />
        <h5 className="grow text-sm">Right</h5>
      </button>

      <span className="w-full h-0.25 bg-primary-200/30 my-1" />

      <button
        className="w-full flex items-center gap-2.5 px-3.5 py-1.5 font-medium rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500"
        onClick={() => {
          documentManager.alignObjectToPageTop();
        }}
      >
        <LuAlignStartHorizontal size={21} className="p-0.5" />
        <h5 className="grow text-sm">Top</h5>
      </button>

      <button
        className="w-full flex items-center gap-2.5 px-3.5 py-1.5 font-medium rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500"
        onClick={() => {
          documentManager.alignObjectToPageMiddle();
        }}
      >
        <LuAlignCenterHorizontal size={21} className="p-0.5" />
        <h5 className="grow text-sm">Middle</h5>
      </button>

      <button
        className="w-full flex items-center gap-2.5 px-3.5 py-1.5 font-medium rounded-xl cursor-pointer hover:bg-forground/10 active:text-primary-500"
        onClick={() => {
          documentManager.alignObjectToPageBottom();
        }}
      >
        <LuAlignEndHorizontal size={21} className="p-0.5" />
        <h5 className="grow text-sm">Bottom</h5>
      </button>
    </section>
  );
};

export default ObjectAlignPageActionsMenu;
