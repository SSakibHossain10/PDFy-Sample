import ListTypeSquareIcn from "@icons/list-type-square.svg";
import CanvasTextbox from "../../../../../classes/CanvasTextbox";

const ListTypeSquareBar = ({
  listType,
  handleChangeListType,
}: {
  listType: CanvasTextbox["listType"];
  handleChangeListType: (listType: CanvasTextbox["listType"]) => void;
}) => {
  return (
    <button
      className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
        listType === "square" ? "bg-forground/15 text-primary-200" : "hover:bg-forground/5 hover:text-primary-200"
      }`}
      onClick={() => handleChangeListType(listType === "square" ? "none" : "square")}
    >
      <ListTypeSquareIcn className="size-6 sm:size-5" />
    </button>
  );
};

export default ListTypeSquareBar;
