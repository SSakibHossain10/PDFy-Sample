import ListTypeNumericIcn from "@icons/list-type-numeric.svg";
import CanvasTextbox from "../../../../../classes/CanvasTextbox";

const ListTypeNumericBar = ({
  listType,
  handleChangeListType,
}: {
  listType: CanvasTextbox["listType"];
  handleChangeListType: (listType: CanvasTextbox["listType"]) => void;
}) => {
  return (
    <button
      className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
        listType === "numeric" ? "bg-forground/15 text-primary-200" : "hover:bg-forground/5 hover:text-primary-200"
      }`}
      onClick={() => handleChangeListType(listType === "numeric" ? "none" : "numeric")}
    >
      <ListTypeNumericIcn className="size-6 sm:size-5" />
    </button>
  );
};

export default ListTypeNumericBar;
