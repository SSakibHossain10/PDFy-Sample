import { TGetElementCategoryItemsRespose } from "@/app/api/element/get-categories-elements/route";
import SlideLeftBtn from "@/components/SlideLeftBtn";
import SlideRightBtn from "@/components/SlideRightBtn";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import ElementCard from "../element-card/ElementCard";

const CategoryElementsSlider = ({ categoryElements }: { categoryElements: TGetElementCategoryItemsRespose }) => {
  return (
    <div className="bg-primary-50/5 flex flex-col rounded">
      <div className="flex justify-between items-center gap-2.5">
        <h6 className="p-2.5">{categoryElements.name}</h6>
        <Link
          href={{
            query: {
              categoryId: categoryElements._id,
            },
          }}
          className="text-xs flex items-center px-2.5 py-1.5 rounded-full hover:bg-forground/10 active:text-primary-500"
        >
          View All ({categoryElements.category_elements.length}) <MdOutlineKeyboardArrowRight className="size-4" />
        </Link>
      </div>

      <div className="flex gap-1.5 px-2.5 pb-2.5 overflow-x-auto max-w-dvw scrollbar-hidden snap-x snap-mandatory scroll-smooth">
        <SlideLeftBtn className="h-[calc(100%+10px)] -translate-x-2.5 starting:-translate-x-9" />

        {categoryElements.category_elements.map((element) => (
          <ElementCard key={element._id} element={element} display="inside-category" />
        ))}

        <SlideRightBtn className="h-[calc(100%+10px)] -translate-x-4.5 starting:translate-x-2.5" />
      </div>
    </div>
  );
};

export default CategoryElementsSlider;
