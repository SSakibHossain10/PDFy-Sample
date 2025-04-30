import ListTypeDiscIcn from "@icons/list-type-disc.svg";
import CanvasTextbox from "../../../../../classes/CanvasTextbox";

const ListTypeDiscBar = ({
  listType,
  handleChangeListType,
}: {
  listType: CanvasTextbox["listType"];
  handleChangeListType: (listType: CanvasTextbox["listType"]) => void;
}) => {
  return (
    <button
      className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
        listType === "disc" ? "bg-forground/15 text-primary-200" : "hover:bg-forground/5 hover:text-primary-200"
      }`}
      onClick={() => handleChangeListType(listType === "disc" ? "none" : "disc")}
    >
      <ListTypeDiscIcn className="size-6 sm:size-5" />
    </button>
  );
};

export default ListTypeDiscBar;
