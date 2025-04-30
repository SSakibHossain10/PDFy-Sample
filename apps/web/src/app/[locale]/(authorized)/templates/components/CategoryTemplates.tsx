import { IGetCategoryTemplatesResponse } from "@/app/api/template/get-templates-by-category-id/[categoryId]/route";
import { api_get_templates_by_category_id } from "@/constants/urls";
import { ITemplate } from "@/schemas/templateSchema";
import TemplateCard from "./template-card/TemplateCard";
import { TUseType } from "./template-card/TemplateModal";

const CategoryTemplates = async ({ categoryId, useType }: { categoryId: ITemplate["_id"]; useType: TUseType }) => {
  const categoryTemplates = (await fetch(`${api_get_templates_by_category_id}/${categoryId}`, {
    cache: "no-store",
  }).then((data) => data.json())) as IGetCategoryTemplatesResponse;

  console.log("categoryTemplates", categoryTemplates);

  return (
    <div className="grow bg-primary-50/5 grid grid-cols-3 @sm:grid-cols-4 @md:grid-cols-5 @lg:grid-cols-6 gap-2.5 p-2.5 @sm:p-4 @sm:gap-3 @md:gap-3.5 @lg:gap-4 content-start rounded w-full max-w-5xl mx-auto">
      {categoryTemplates.category_templates.map((template) => (
        <TemplateCard key={template._id} template={template} display="independent" useType={useType} />
      ))}
    </div>
  );
};

export default CategoryTemplates;
