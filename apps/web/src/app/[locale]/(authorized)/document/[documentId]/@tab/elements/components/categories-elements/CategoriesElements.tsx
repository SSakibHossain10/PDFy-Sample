import { TGetElementCategoryItemsRespose } from "@/app/api/element/get-categories-elements/route";
import { api_get_categories_elements } from "@/constants/urls";
import CategoryElementsSlider from "./CategoryElementsSlider";

const CategoriesElements = async () => {
  const categoriesElements = (await fetch(api_get_categories_elements, {
    cache: "no-store",
  }).then((data) => data.json())) as TGetElementCategoryItemsRespose[];

  return (
    <div className="w-full flex flex-col gap-4">
      {categoriesElements.map((categoryElements) => (
        <CategoryElementsSlider key={categoryElements._id} categoryElements={categoryElements} />
      ))}
    </div>
  );
};

export default CategoriesElements;
