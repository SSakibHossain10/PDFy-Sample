import { IGetTemplateCategoryItemsRespose } from "@/app/api/template/get-categories-templates/route";
import SlideLeftBtn from "@/components/SlideLeftBtn";
import SlideRightBtn from "@/components/SlideRightBtn";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import TemplateCard from "../template-card/TemplateCard";
import { TUseType } from "../template-card/TemplateModal";

export type TuseInPage = "template" | "document" | "dashboard";

const CategoryTemplatesSlider = ({
  categoryTemplates,
  useType,
  useInPage,
}: {
  categoryTemplates: IGetTemplateCategoryItemsRespose;
  useType: TUseType;
  useInPage: TuseInPage;
}) => {
  return (
    <div className="bg-primary-50/5 flex flex-col rounded">
      <div className="flex justify-between items-center gap-2.5">
        <h6 className="p-2.5">{categoryTemplates.name}</h6>
        <Link
          href={{
            pathname: useInPage === "dashboard" ? "/templates" : undefined,
            query: {
              categoryId: categoryTemplates._id,
            },
          }}
          className="text-xs flex items-center px-2.5 py-1.5 rounded-full hover:bg-forground/10 active:text-primary-500"
        >
          View All ({categoryTemplates.category_templates.length}) <MdOutlineKeyboardArrowRight className="size-4" />
        </Link>
      </div>

      <div className="flex gap-2 px-2.5 @sm:gap-3 @md:gap-3.5 @lg:gap-4 @sm:px-4 pb-2.5 overflow-x-auto scrollbar-hidden snap-x snap-mandatory scroll-smooth">
        <SlideLeftBtn className="-translate-x-2.5 starting:-translate-x-9 @sm:-translate-x-4.5 @sm:starting:-translate-x-12" />

        {categoryTemplates.category_templates.map((template) => (
          <TemplateCard key={template._id} template={template} display="inside-category" useType={useType} />
        ))}

        <SlideRightBtn className="-translate-x-4.5 starting:translate-x-2.5 @sm:-translate-x-2.5 @sm:starting:translate-x-4.5" />
      </div>
    </div>
  );
};

export default CategoryTemplatesSlider;
