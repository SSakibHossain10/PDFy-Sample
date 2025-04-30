import DeleteIcn from "@icons/doutone/delete-fill.svg";
import { useFormStatus } from "react-dom";

const DeleteDocumentBtn = () => {
  const { pending } = useFormStatus();

  return (
    <button className="flex flex-col items-center gap-1 disabled:animate-pulse" disabled={pending} type="submit">
      <DeleteIcn className="size-6" />
      <span>{pending ? "Deleting" : "Delete"}</span>
    </button>
  );
};

export default DeleteDocumentBtn;
