import { TGetElementCategoryItemsRespose } from "@/app/api/element/get-categories-elements/route";
import { IGetCategoryElementsResponse } from "@/app/api/element/get-elements-by-category-id/[categoryId]/route";
import { api_get_categories_elements, api_get_elements_by_category_id } from "@/constants/urls";
import { IElement } from "@/schemas/elementSchema";

const ElementSearchInputSuggestions = async ({ categoryId }: { categoryId?: IElement["_id"] }) => {
  const categoryElements = categoryId
    ? ((await fetch(`${api_get_elements_by_category_id}/${categoryId}`, {
        cache: "no-store",
      }).then((data) => data.json())) as IGetCategoryElementsResponse)
    : null;

  const categoriesElements = categoryId
    ? null
    : ((await fetch(api_get_categories_elements, {
        cache: "no-store",
      }).then((data) => data.json())) as TGetElementCategoryItemsRespose[]);

  const elements = categoryId
    ? (categoryElements as IGetCategoryElementsResponse).category_elements
    : (categoriesElements as TGetElementCategoryItemsRespose[]).reduce(
        (acc, curr) => [...acc, ...curr.category_elements] as IElement[],
        [] as IElement[]
      );

  return (
    <datalist id="element-search-suggestions">
      {elements.map((element) => (
        <option key={element._id} value={element.name} />
      ))}
    </datalist>
  );
};

export default ElementSearchInputSuggestions;
