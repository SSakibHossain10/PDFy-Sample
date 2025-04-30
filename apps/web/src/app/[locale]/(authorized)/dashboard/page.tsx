import { LoadingCategoriesTemplates, LoadingRecentDocuments, LoadingSearhedTemplates } from "@/components/loadings";
import UserFirstName from "@/components/UserFirstName";
import Form from "next/form";
import Link from "next/link";
import { Suspense } from "react";
import CategoriesTemplates from "../templates/components/categories-templates/CategoriesTemplates";
import TemplateSearchInput from "../templates/components/search/TemplateSearchInput";
import TemplateSearchInputSuggestions from "../templates/components/search/TemplateSearchInputSuggestions";
import SearchedTemplates from "../templates/components/SearchedTemplates";
import { TTemplatepageSearchParams } from "../templates/page";
import "../templates/styles/template_styles.css";
import RecentDocumentsCard from "./components/RecentDocumentsCard";

const DashboardPage = async ({ searchParams }: { searchParams: TTemplatepageSearchParams }) => {
  const categoryId = (await searchParams).categoryId;
  const searchQuery = (await searchParams).searchQuery;

  return (
    <main className="grow flex flex-col overflow-y-auto" id="dashboard-page">
      <div className="shrink-0 bg-primary-50/10 h-40 flex flex-col gap-2 justify-center items-center rounded-b-lg mb-8 w-full max-w-5xl mx-auto">
        <h4 className="text-center">
          Welcome{" "}
          <Suspense fallback={<span className="-ml-1" />}>
            <UserFirstName />
          </Suspense>
          !
        </h4>
        <h5 className="text-primary-400 text-center">What are you going to pdfy today?</h5>
      </div>

      <canvas id="pdf-editor-canvas" className="h-0" />

      <div className="flex flex-col mb-8 w-full max-w-5xl mx-auto">
        <Suspense fallback={<LoadingRecentDocuments />}>
          <RecentDocumentsCard />
        </Suspense>
      </div>

      <Link href="/templates" className="mb-3 text-lg text-center underline w-fit mx-auto">
        Templates
      </Link>

      <div className="grow @container flex flex-col gap-8 w-full max-w-5xl mx-auto">
        <Form action="" className="z-10 flex sticky top-2">
          <TemplateSearchInput searchQuery={searchQuery} />

          <Suspense fallback={null}>
            <TemplateSearchInputSuggestions categoryId={categoryId} />
          </Suspense>

          {categoryId && <input name="categoryId" value={categoryId} readOnly className="hidden" />}
        </Form>

        {searchQuery ? (
          <Suspense fallback={<LoadingSearhedTemplates />}>
            <SearchedTemplates searchQuery={searchQuery} categoryId={categoryId} useType="new-document" />
          </Suspense>
        ) : (
          <Suspense fallback={<LoadingCategoriesTemplates />}>
            <CategoriesTemplates useType="new-document" useInPage="dashboard" />
          </Suspense>
        )}
      </div>
    </main>
  );
};

export default DashboardPage;
