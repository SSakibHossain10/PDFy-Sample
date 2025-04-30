import { LoadingCategoriesElements, LoadingCategoryElements, LoadingSearhedElements } from "@/components/loadings";
import Form from "next/form";
import { Suspense } from "react";
import CategoriesElements from "./components/categories-elements/CategoriesElements";
import CategoryElements from "./components/CategoryElements";
import ElementCategoryName from "./components/ElementCategoryName";
import ElementSearchInput from "./components/search/ElementSearchInput";
import ElementSearchInputSuggestions from "./components/search/ElementSearchInputSuggestions";
import SearchedElements from "./components/SearchedElements";

export type TElementpageSearchParams = Promise<{ categoryId?: string; searchQuery?: string }>;

const ElementSlot = async ({ searchParams }: { searchParams: TElementpageSearchParams }) => {
  const categoryId = (await searchParams).categoryId;
  const searchQuery = (await searchParams).searchQuery;

  return (
    <div
      className="w-full h-full bg-gr-multi-dark pb-0 flex flex-col gap-3 sm:pt-1 sx:rounded-t-xl sm:rounded-r-xl"
      id="element-slot"
    >
      <div className="sm:hidden pt-1.5 -mb-4 flex justify-center">
        <span className="h-1 w-10 rounded-full bg-primary-200/50" />
      </div>

      {categoryId ? (
        <Suspense fallback={<span className="h-9" />}>
          <ElementCategoryName categoryId={categoryId} searchQuery={searchQuery} />
        </Suspense>
      ) : (
        <span />
      )}

      <Form action="" className="z-10 flex sticky top-2 px-5">
        <ElementSearchInput searchQuery={searchQuery} />

        <Suspense fallback={null}>
          <ElementSearchInputSuggestions categoryId={categoryId} />
        </Suspense>

        {categoryId && <input name="categoryId" value={categoryId} readOnly className="hidden" />}
      </Form>

      <div className="grow flex min-h-30 overflow-y-auto">
        {searchQuery ? (
          <Suspense fallback={<LoadingSearhedElements />}>
            <SearchedElements searchQuery={searchQuery} categoryId={categoryId} />
          </Suspense>
        ) : categoryId ? (
          <Suspense fallback={<LoadingCategoryElements />}>
            <CategoryElements categoryId={categoryId} />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingCategoriesElements />}>
            <CategoriesElements />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default ElementSlot;
