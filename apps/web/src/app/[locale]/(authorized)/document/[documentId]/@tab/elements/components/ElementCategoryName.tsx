import { IGetCategoryElementsResponse } from "@/app/api/element/get-elements-by-category-id/[categoryId]/route";
import { api_get_elements_by_category_id } from "@/constants/urls";
import { IElement } from "@/schemas/elementSchema";
import Link from "next/link";
import { MdArrowBackIosNew } from "react-icons/md";

const ElementCategoryName = async ({
  categoryId,
  searchQuery,
}: {
  categoryId: IElement["_id"];
  searchQuery?: string;
}) => {
  const categoryElements = (await fetch(`${api_get_elements_by_category_id}/${categoryId}`, {
    cache: "no-store",
  }).then((data) => data.json())) as IGetCategoryElementsResponse;

  console.log("categoryElements", categoryElements);

  return (
    <div className="flex items-center pt-2.5 -mb-0.5 px-1">
      <Link
        replace
        href={{
          query: {
            searchQuery: searchQuery || "",
            categoryId: categoryElements.parent_category || undefined,
          },
        }}
        className="flex px-2 active:text-primary-700"
      >
        <MdArrowBackIosNew />
      </Link>

      <h5 className="grow pr-8 font-semibold text-center">{categoryElements.name}</h5>
    </div>
  );
};

export default ElementCategoryName;
