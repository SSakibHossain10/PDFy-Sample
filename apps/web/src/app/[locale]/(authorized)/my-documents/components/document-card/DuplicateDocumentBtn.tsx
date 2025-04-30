import DuplicateIcn from "@icons/doutone/duplicate.svg";
import { useFormStatus } from "react-dom";

const DuplicateDocumentBtn = () => {
  const { pending } = useFormStatus();

  return (
    <button className="flex flex-col items-center gap-1 disabled:animate-pulse" disabled={pending} type="submit">
      <DuplicateIcn className="size-6" />
      <span>{pending ? "Duplicating" : "Duplicate"}</span>
    </button>
  );
};

export default DuplicateDocumentBtn;
