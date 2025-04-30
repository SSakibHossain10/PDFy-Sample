import CategoriesTemplates from "@/app/[locale]/(authorized)/templates/components/categories-templates/CategoriesTemplates";
import CategoryTemplates from "@/app/[locale]/(authorized)/templates/components/CategoryTemplates";
import TemplateSearchInput from "@/app/[locale]/(authorized)/templates/components/search/TemplateSearchInput";
import TemplateSearchInputSuggestions from "@/app/[locale]/(authorized)/templates/components/search/TemplateSearchInputSuggestions";
import SearchedTemplates from "@/app/[locale]/(authorized)/templates/components/SearchedTemplates";
import TemplateCategoryName from "@/app/[locale]/(authorized)/templates/components/TemplateCategoryName";
import { TTemplatepageSearchParams } from "@/app/[locale]/(authorized)/templates/page";
import "@/app/[locale]/(authorized)/templates/styles/template_styles.css";
import { LoadingCategoriesTemplates, LoadingCategoryTemplates, LoadingSearhedTemplates } from "@/components/loadings";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { MdArrowBackIosNew } from "react-icons/md";

const TemplateSlot = async ({ searchParams }: { searchParams: TTemplatepageSearchParams }) => {
  const categoryId = (await searchParams).categoryId;
  const searchQuery = (await searchParams).searchQuery;

  return (
    <div
      className="w-full h-full bg-gr-multi-dark pb-0 flex flex-col gap-3 sm:pt-1 sx:rounded-t-xl sm:rounded-r-xl overflow-auto"
      id="template-slot"
    >
      <div className="sm:hidden pt-1.5 -mb-4 flex justify-center">
        <span className="h-1 w-10 rounded-full bg-primary-200/50" />
      </div>

      <div>
        {categoryId ? (
          <div className="flex items-center pt-2.5 -mb-0.5 px-1">
            <Link
              replace
              href={{
                query: {
                  searchQuery: searchQuery || "",
                  categoryId: undefined,
                },
              }}
              className="flex px-2 active:text-primary-700"
            >
              <MdArrowBackIosNew />
            </Link>

            <h5 className="grow text-center">
              <Suspense fallback="">
                <TemplateCategoryName categoryId={categoryId} />
              </Suspense>
              Templates
            </h5>
          </div>
        ) : null}
      </div>

      <Form action="" className="z-10 flex sticky top-2 px-5">
        <TemplateSearchInput searchQuery={searchQuery} />

        <Suspense fallback={null}>
          <TemplateSearchInputSuggestions categoryId={categoryId} />
        </Suspense>

        {categoryId && <input name="categoryId" value={categoryId} readOnly className="hidden" />}
      </Form>

      <div className="grow @container flex min-h-30 overflow-y-auto">
        {searchQuery ? (
          <Suspense fallback={<LoadingSearhedTemplates />}>
            <SearchedTemplates searchQuery={searchQuery} categoryId={categoryId} useType="in-document" />
          </Suspense>
        ) : categoryId ? (
          <Suspense fallback={<LoadingCategoryTemplates />}>
            <CategoryTemplates categoryId={categoryId} useType="in-document" />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingCategoriesTemplates />}>
            <CategoriesTemplates useType="in-document" useInPage="document" />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default TemplateSlot;
