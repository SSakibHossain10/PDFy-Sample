import ListTypeCircleIcn from "@icons/list-type-circle.svg";
import CanvasTextbox from "../../../../../classes/CanvasTextbox";

const ListTypeCircleBar = ({
  listType,
  handleChangeListType,
}: {
  listType: CanvasTextbox["listType"];
  handleChangeListType: (listType: CanvasTextbox["listType"]) => void;
}) => {
  return (
    <button
      className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
        listType === "circle" ? "bg-forground/15 text-primary-200" : "hover:bg-forground/5 hover:text-primary-200"
      }`}
      onClick={() => handleChangeListType(listType === "circle" ? "none" : "circle")}
    >
      <ListTypeCircleIcn className="size-6 sm:size-5" />
    </button>
  );
};

export default ListTypeCircleBar;
