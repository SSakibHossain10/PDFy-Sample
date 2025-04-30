import { IGetCategoryTemplatesResponse } from "@/app/api/template/get-templates-by-category-id/[categoryId]/route";
import { api_get_templates_by_category_id } from "@/constants/urls";
import { ITemplate } from "@/schemas/templateSchema";

const TemplateCategoryName = async ({ categoryId }: { categoryId: ITemplate["_id"] }) => {
  const categoryTemplates = (await fetch(`${api_get_templates_by_category_id}/${categoryId}`, {
    cache: "no-store",
  }).then((data) => data.json())) as IGetCategoryTemplatesResponse;

  return <span className="font-semibold text-lg">{categoryTemplates.name} </span>;
};

export default TemplateCategoryName;
