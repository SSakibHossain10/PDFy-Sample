import { TGetElementCategoryItemsRespose } from "@/app/api/element/get-categories-elements/route";
import { IGetCategoryElementsResponse } from "@/app/api/element/get-elements-by-category-id/[categoryId]/route";
import { api_get_categories_elements, api_get_elements_by_category_id } from "@/constants/urls";
import { IElement } from "@/schemas/elementSchema";
import ElementCard from "./element-card/ElementCard";

const SearchedElements = async ({ categoryId, searchQuery }: { categoryId?: IElement["_id"]; searchQuery: string }) => {
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

  const searchedElements = categoryId
    ? (categoryElements as IGetCategoryElementsResponse).category_elements.filter((element) =>
        element.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : (categoriesElements as TGetElementCategoryItemsRespose[])
        .reduce((acc, curr) => [...acc, ...curr.category_elements] as IElement[], [] as IElement[])
        .filter((element) => element.name.toLowerCase().includes(searchQuery.toLowerCase()));

  console.log("searchedElements", searchedElements);

  return (
    <div
      className={`grow bg-primary-50/5 grid grid-cols-5 gap-2 p-2 ${searchedElements.length === 0 ? "content-center" : "content-start"} rounded`}
    >
      {searchedElements.map((element) => (
        //@ts-ignore
        <ElementCard key={element._id} element={element} display="independent" />
      ))}

      {searchedElements.length === 0 && (
        <h6 className="col-span-5 text-center">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          No <strong>{categoryElements?.name || ""}</strong> elements found for "<strong>{searchQuery}</strong>"
        </h6>
      )}
    </div>
  );
};

export default SearchedElements;
