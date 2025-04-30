import TextAlignCenterIcn from "@icons/text-align-center.svg";
import CanvasTextbox from "../../../../../classes/CanvasTextbox";

const TextAlignCenterBar = ({
  textAlign,
  handleChangeTextAlign,
}: {
  textAlign: CanvasTextbox["textAlign"];
  handleChangeTextAlign: (textAlign: CanvasTextbox["textAlign"]) => void;
}) => {
  return (
    <button
      className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
        textAlign === "center" ? "bg-forground/15 text-primary-200" : "hover:bg-forground/5 hover:text-primary-200"
      }`}
      onClick={() => handleChangeTextAlign("center")}
    >
      <TextAlignCenterIcn className="size-6 sm:size-5" />
    </button>
  );
};

export default TextAlignCenterBar;
