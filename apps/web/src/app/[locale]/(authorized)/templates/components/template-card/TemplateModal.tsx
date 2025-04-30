"use client";

import { documentManager } from "@/app/[locale]/(authorized)/document/[documentId]/documentManager";
import { IGetCategoryTemplatesResponse } from "@/app/api/template/get-templates-by-category-id/[categoryId]/route";
import SlideLeftBtn from "@/components/SlideLeftBtn";
import SlideRightBtn from "@/components/SlideRightBtn";
import { api_get_template_by_id } from "@/constants/urls";
import { IPopover } from "@/hooks/usePopover";
import { ITemplate } from "@/schemas/templateSchema";
import addDocument from "@/server-actions/add_document";
import CloseIcn from "@icons/doutone/close-circle.svg";
import { useState } from "react";
import { LiaSpinnerSolid } from "react-icons/lia";

export type TUseType = "in-document" | "new-document";

const TemplateModal = ({
  myPopover,
  template,
  useType = "new-document",
}: {
  myPopover: IPopover<HTMLDialogElement>;
  template: IGetCategoryTemplatesResponse["category_templates"][0];
  useType: TUseType;
}) => {
  const [loading, setLoading] = useState(false);

  const handleUsetemplate = async () => {
    setLoading(true);

    fetch(`${api_get_template_by_id}/${template._id}`)
      .then((data) => data.json())
      .then((templateData: ITemplate) => {
        console.log("tempa", templateData, templateData.pages);

        if (useType === "new-document") {
          addDocument({
            name: templateData.name,
            thumbnail: templateData.pages[0].thumbnail, //@ts-ignore
            fonts: templateData.fonts.map((font) => ({ font_id: font._id, type: "GOOGLE" })),
            pages: templateData.pages,
          }).then(() => {
            setLoading(false);
          });
        } else {
          documentManager.addTemplate(templateData).then(() => {
            setLoading(false);
            myPopover.popoverRef.current.hidePopover();
          });
        }
      });
  };

  return (
    <dialog
      popover="auto"
      id={myPopover.id}
      className="popover-animation-opacity m-auto inset-0 relative overflow-hidden shadow-xl rounded-2xl backdrop:bg-white/10"
      style={{ maxWidth: "calc(min(100dvw, 600px) - 5px)", maxHeight: "calc(100dvh - 5px)" }}
      ref={myPopover.popoverRef}
    >
      <button
        className="p-1.5 absolute right-0.5 top-0.5"
        popoverTarget={myPopover.popoverTarget}
        popoverTargetAction="hide"
      >
        <CloseIcn className="size-8 active:text-primary-500" />
      </button>
      <div className="bg-gr-multi-dark flex flex-col items-stretch rounded-2xl overflow-auto max-h-dvh">
        <h5 className="px-6 text-center m-5">{template.name}</h5>

        <div className="flex gap-2 mx-auto px-5 overflow-x-auto scrollbar-hidden snap-x snap-mandatory scroll-smooth">
          <SlideLeftBtn className="-ml-2 -translate-x-5" />

          {template.pages.map(({ thumbnail, height, width }) => (
            <img
              key={thumbnail}
              loading="lazy"
              src={thumbnail}
              alt={`${template.name} thumbnail`}
              className="snap-center w-auto h-70"
              style={{ aspectRatio: `${width}/${height}` }}
            />
          ))}

          <SlideRightBtn className="-ml-2 -translate-x-2" />
        </div>
        <button
          className="grow bg-primary-50/20 px-3 py-1.5 m-5 text-sm flex gap-2 items-center justify-center text-center rounded-full"
          onClick={handleUsetemplate}
          disabled={loading}
        >
          {loading && <LiaSpinnerSolid className="size-4 animate-spin" />}
          {loading ? "Using" : "Use"} this template
        </button>
      </div>
    </dialog>
  );
};

export default TemplateModal;
