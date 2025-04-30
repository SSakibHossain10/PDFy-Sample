import { IGetTemplateCategoryItemsRespose } from "@/app/api/template/get-categories-templates/route";
import { IGetCategoryTemplatesResponse } from "@/app/api/template/get-templates-by-category-id/[categoryId]/route";
import { api_get_categories_templates, api_get_templates_by_category_id } from "@/constants/urls";
import { ITemplate } from "@/schemas/templateSchema";

const TemplateSearchInputSuggestions = async ({ categoryId }: { categoryId?: ITemplate["_id"] }) => {
  const categoryTemplates = categoryId
    ? ((await fetch(`${api_get_templates_by_category_id}/${categoryId}`, {
        cache: "no-store",
      }).then((data) => data.json())) as IGetCategoryTemplatesResponse)
    : null;

  const categoriesTemplates = categoryId
    ? null
    : ((await fetch(api_get_categories_templates, {
        cache: "no-store",
      }).then((data) => data.json())) as IGetTemplateCategoryItemsRespose[]);

  const templates = categoryId
    ? (categoryTemplates as IGetCategoryTemplatesResponse).category_templates
    : (categoriesTemplates as IGetTemplateCategoryItemsRespose[]).reduce(
        (acc, curr) => [...acc, ...curr.category_templates] as ITemplate[],
        [] as ITemplate[]
      );

  return (
    <datalist id="template-search-suggestions">
      {templates.map((template) => (
        <option key={template._id} value={template.name} />
      ))}
    </datalist>
  );
};

export default TemplateSearchInputSuggestions;
