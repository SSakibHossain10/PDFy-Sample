import { LoadingCategoriesTemplates, LoadingCategoryTemplates, LoadingSearhedTemplates } from "@/components/loadings";
import UserFirstName from "@/components/UserFirstName";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import { MdArrowBackIosNew } from "react-icons/md";
import CategoriesTemplates from "./components/categories-templates/CategoriesTemplates";
import CategoryTemplates from "./components/CategoryTemplates";
import TemplateSearchInput from "./components/search/TemplateSearchInput";
import TemplateSearchInputSuggestions from "./components/search/TemplateSearchInputSuggestions";
import SearchedTemplates from "./components/SearchedTemplates";
import TemplateCategoryName from "./components/TemplateCategoryName";
import "./styles/template_styles.css";

export type TTemplatepageSearchParams = Promise<{ categoryId?: string; searchQuery?: string }>;

const TemplatePage = async ({ searchParams }: { searchParams: TTemplatepageSearchParams }) => {
  const categoryId = (await searchParams).categoryId;
  const searchQuery = (await searchParams).searchQuery;

  return (
    <main className="grow flex flex-col gap-8 overflow-y-auto" id="template-page">
      {categoryId ? (
        <div className="flex items-center pt-3 w-full max-w-5xl mx-auto">
          <Link
            href={{
              pathname: "/templates",
              query: {
                searchQuery,
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
      ) : (
        <div className="shrink-0 bg-primary-50/10 h-40 flex flex-col gap-2 justify-center items-center rounded-b-lg w-full max-w-5xl mx-auto">
          <h4 className="text-center">
            Hi{" "}
            <Suspense fallback={<span className="-ml-1" />}>
              <UserFirstName />
            </Suspense>
            !
          </h4>
          <h5 className="text-primary-400 text-center">Welcome to templates</h5>
        </div>
      )}

      <Form action="" className="z-10 flex sticky top-2 w-full max-w-5xl mx-auto">
        <TemplateSearchInput searchQuery={searchQuery} />

        <Suspense fallback={null}>
          <TemplateSearchInputSuggestions categoryId={categoryId} />
        </Suspense>

        {categoryId && <input name="categoryId" value={categoryId} readOnly className="hidden" />}
      </Form>

      <div className="grow @container flex">
        {searchQuery ? (
          <Suspense fallback={<LoadingSearhedTemplates />}>
            <SearchedTemplates searchQuery={searchQuery} categoryId={categoryId} useType="new-document" />
          </Suspense>
        ) : categoryId ? (
          <Suspense fallback={<LoadingCategoryTemplates />}>
            <CategoryTemplates categoryId={categoryId} useType="new-document" />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingCategoriesTemplates />}>
            <CategoriesTemplates useType="new-document" useInPage="template" />
          </Suspense>
        )}
      </div>
    </main>
  );
};

export default TemplatePage;
