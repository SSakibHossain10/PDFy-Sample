import { IGetCategoryElementsResponse } from "@/app/api/element/get-elements-by-category-id/[categoryId]/route";
import { api_get_elements_by_category_id } from "@/constants/urls";
import { IElement } from "@/schemas/elementSchema";
import CategoryElementsSlider from "./categories-elements/CategoryElementsSlider";
import ElementCard from "./element-card/ElementCard";

const CategoryElements = async ({ categoryId }: { categoryId: IElement["_id"] }) => {
  const categoryElements = (await fetch(`${api_get_elements_by_category_id}/${categoryId}`, {
    cache: "no-store",
  }).then((data) => data.json())) as IGetCategoryElementsResponse;

  console.log("categoryElements", categoryElements);

  return (
    <div className="grow w-full flex flex-col gap-4">
      {categoryElements.category_elements.map((categoryElements) =>
        categoryId === categoryElements._id ? (
          <div
            key={categoryElements._id}
            className="grow bg-primary-50/5 grid grid-cols-5 content-start gap-2 p-2 rounded"
          >
            {categoryElements.category_elements.map((element) => (
              <ElementCard key={element._id} element={element} display="independent" />
            ))}
          </div>
        ) : (
          <CategoryElementsSlider key={categoryElements._id} categoryElements={categoryElements} />
        )
      )}
    </div>
  );
};

export default CategoryElements;
