"use client";

import { IGetCategoryTemplatesResponse } from "@/app/api/template/get-templates-by-category-id/[categoryId]/route";
import usePopover from "@/hooks/usePopover";
import TemplateModal, { TUseType } from "./TemplateModal";

const TemplateCard = ({
  template,
  display,
  useType,
}: {
  template: IGetCategoryTemplatesResponse["category_templates"][0];
  display: "inside-category" | "independent";
  useType: TUseType;
}) => {
  const templateModalPopover = usePopover<HTMLDialogElement>();

  return (
    <>
      <button
        className={`snap-center flex-none ${display === "independent" ? "w-full" : "w-[31%] @sm:w-[22.5%] @md:w-[18%] @lg:w-[15%]"} h-fit relative`}
        popoverTarget={templateModalPopover.popoverTarget}
      >
        <small className="absolute bottom-2 left-2 px-2 py-1 font-black bg-primary-100/50 text-primary-700 border border-primary-700 rounded-full">
          {template.pages.length}
        </small>
        <img
          loading="lazy"
          src={template.pages[0].thumbnail}
          width={template.pages[0].width}
          height={template.pages[0].height}
          key={template._id}
          alt={`${template.name} thumbnail`}
        />
      </button>

      <TemplateModal myPopover={templateModalPopover} template={template} useType={useType} />
    </>
  );
};

export default TemplateCard;
