import TextAlignJustifyIcn from "@icons/text-align-justify.svg";
import CanvasTextbox from "../../../../../classes/CanvasTextbox";

const TextAlignJustifyBar = ({
  textAlign,
  handleChangeTextAlign,
}: {
  textAlign: CanvasTextbox["textAlign"];
  handleChangeTextAlign: (textAlign: CanvasTextbox["textAlign"]) => void;
}) => {
  return (
    <button
      className={`grow flex flex-col items-center gap-1 p-1.25 rounded-lg ${
        textAlign === "justify" ? "bg-forground/15 text-primary-200" : "hover:bg-forground/5 hover:text-primary-200"
      }`}
      onClick={() => handleChangeTextAlign("justify")}
    >
      <TextAlignJustifyIcn className="size-6 sm:size-5" />
    </button>
  );
};

export default TextAlignJustifyBar;
