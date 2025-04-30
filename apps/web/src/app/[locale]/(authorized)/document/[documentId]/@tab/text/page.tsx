"use client";

import useDeviceSize from "@/hooks/useDeviceSize";
import { useI18n } from "@/locales/client";
import { useRouter } from "next/navigation";
import { FaArrowRight } from "react-icons/fa6";
import { RxText } from "react-icons/rx";
import DocumentManager from "../../classes/DocumentManager";
import { documentManager } from "../../documentManager";
import { IDocumentPageParams } from "../../page";

const TextSlot = ({ params }: { params: IDocumentPageParams }) => {
  const t = useI18n();
  const router = useRouter();
  const { sx } = useDeviceSize();

  console.log("rendered TextSlot");

  const handleAddText = async (...args: Parameters<DocumentManager["addText"]>) => {
    documentManager.addText(...args);
    if (sx) router.replace(`/document/${(await params).documentId}/edit`);
  };

  return (
    <div
      className="w-full h-full bg-gr-multi-dark flex flex-col gap-4 p-4 sx:pt-2 sx:rounded-t-xl sm:rounded-r-xl overflow-auto"
      id="text-slot"
    >
      <div className="sm:hidden -mb-1 flex justify-center">
        <span className="h-1 w-10 rounded-full bg-primary-200/50" />
      </div>

      <button
        className="bg-primary-200/10 px-3 py-2 gap-1.5 rounded-lg flex items-center hover:bg-primary-200/20 active:text-primary-500"
        onClick={() => handleAddText("Add a heading", { fontSize: 50, fontWeight: "700" })}
      >
        <RxText className="size-5 stroke-[0.5px]" />
        <h2 className="text-xl">{t("Add a heading")}</h2>
        <span className="grow" />
        <FaArrowRight className="size-3.5 sx:-rotate-90" />
      </button>

      <button
        className="bg-primary-200/10 px-3 py-2 gap-1.5 rounded-lg flex items-center hover:bg-primary-200/20 active:text-primary-500"
        onClick={() => handleAddText("Add a subheading", { fontSize: 32, fontWeight: "700" })}
      >
        <RxText className="size-5 stroke-[0.5px]" />
        <h4 className="text-lg">{t("Add a subheading")}</h4>
        <span className="grow" />
        <FaArrowRight className="size-3.5 sx:-rotate-90" />
      </button>

      <button
        className="bg-primary-200/10 px-3 py-2 gap-1.5 rounded-lg flex items-center hover:bg-primary-200/20 active:text-primary-500"
        onClick={() => handleAddText("Add a body text", { fontSize: 24, fontWeight: 500 })}
      >
        <RxText className="size-5 stroke-[0.5px]" />
        <h6>{t("Add a body text")}</h6>
        <span className="grow" />
        <FaArrowRight className="size-3.5 sx:-rotate-90" />
      </button>

      <button
        className="bg-primary-200/10 px-3 py-2 gap-1.5 rounded-lg flex items-center hover:bg-primary-200/20 active:text-primary-500"
        onClick={() => handleAddText("Add a paragraph", { fontSize: 18 })}
      >
        <RxText className="size-5 stroke-[0.5px]" />
        <p>{t("Add a paragraph")}</p>
        <span className="grow" />
        <FaArrowRight className="size-3.5 sx:-rotate-90" />
      </button>
    </div>
  );
};

export default TextSlot;
