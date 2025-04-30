import { IGetTemplateCategoryItemsRespose } from "@/app/api/template/get-categories-templates/route";
import { IGetCategoryTemplatesResponse } from "@/app/api/template/get-templates-by-category-id/[categoryId]/route";
import { api_get_categories_templates, api_get_templates_by_category_id } from "@/constants/urls";
import { ITemplate } from "@/schemas/templateSchema";
import TemplateCard from "./template-card/TemplateCard";
import { TUseType } from "./template-card/TemplateModal";

const SearchedTemplates = async ({
  categoryId,
  searchQuery,
  useType,
}: {
  categoryId?: ITemplate["_id"];
  searchQuery: string;
  useType: TUseType;
}) => {
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

  const searchedTemplates = categoryId
    ? (categoryTemplates as IGetCategoryTemplatesResponse).category_templates.filter((template) =>
        template.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : (categoriesTemplates as IGetTemplateCategoryItemsRespose[])
        .reduce((acc, curr) => [...acc, ...curr.category_templates] as ITemplate[], [] as ITemplate[])
        .filter((template) => template.name.toLowerCase().includes(searchQuery.toLowerCase()));

  console.log("searchedTemplates", searchedTemplates);

  return (
    <div
      className={`grow bg-primary-50/5 grid grid-cols-3 @sm:grid-cols-4 @md:grid-cols-5 @lg:grid-cols-6 gap-2.5 p-2.5 @sm:p-4 @sm:gap-3 @md:gap-3.5 @lg:gap-4 ${searchedTemplates.length === 0 ? "content-center" : "content-start"} rounded w-full max-w-5xl mx-auto`}
    >
      {searchedTemplates.map((template) => (
        //@ts-ignore
        <TemplateCard key={template._id} template={template} display="independent" useType={useType} />
      ))}

      {searchedTemplates.length === 0 && (
        <h6 className="col-span-3 @sm:col-span-4 @md:col-span-5 @lg:col-span-6 text-center">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          No <strong>{categoryTemplates?.name || ""}</strong> templates found for "<strong>{searchQuery}</strong>"
        </h6>
      )}
    </div>
  );
};

export default SearchedTemplates;
