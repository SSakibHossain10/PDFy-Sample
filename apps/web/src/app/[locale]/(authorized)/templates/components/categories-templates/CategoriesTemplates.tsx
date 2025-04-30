import { IGetTemplateCategoryItemsRespose } from "@/app/api/template/get-categories-templates/route";
import { api_get_categories_templates } from "@/constants/urls";
import { TUseType } from "../template-card/TemplateModal";
import CategoryTemplatesSlider, { TuseInPage } from "./CategoryTemplatesSlider";

const CategoriesTemplates = async ({ useType, useInPage }: { useType: TUseType; useInPage: TuseInPage }) => {
  const categoriesTemplates = (await fetch(api_get_categories_templates, {
    cache: "no-store",
  }).then((data) => data.json())) as IGetTemplateCategoryItemsRespose[];

  return (
    <div className="flex flex-col gap-4 pb-4 w-full max-w-5xl mx-auto">
      {categoriesTemplates.map((categoryTemplates) => (
        <CategoryTemplatesSlider
          key={categoryTemplates._id}
          categoryTemplates={categoryTemplates}
          useType={useType}
          useInPage={useInPage}
        />
      ))}
    </div>
  );
};

export default CategoriesTemplates;
