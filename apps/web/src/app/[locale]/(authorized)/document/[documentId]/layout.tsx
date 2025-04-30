import { I18nProviderClient } from "@/locales/client";
import { IDocument } from "@/schemas/documentSchema";
import { CSSProperties, ReactNode, Suspense, use } from "react";
import FontFamiliesProvider from "./components/layout/object-primary-toolbar/font-family/FontFamiliesProvider";
import ObjectPrimaryToolbar from "./components/layout/object-primary-toolbar/ObjectPrimaryToolbar";
import ToolMenuNavbar from "./components/layout/ToolMenuNavbar";
import TopToolBar from "./components/layout/top-toolbar/TopToolBar";
import LoadingDocumentPage from "./loading";
import "./styles/document_styles.css";

export type TdocumentLayoutParams = Promise<{ locale: string; documentId: IDocument["_id"]; searchQuery: string }>;

const DocumentPageLayout = ({
  children,
  tab,
  params,
}: {
  params: TdocumentLayoutParams;
  children: ReactNode;
  tab: ReactNode;
}) => {
  const { locale, documentId } = use(params);
  console.log("rendered DocumentPageLayout");

  return (
    <I18nProviderClient locale={locale}>
      <main
        className="grow max-h-dvh flex flex-col overflow-hidden"
        id="editor-page-layout"
        style={{ anchorName: "--layout" } as CSSProperties}
      >
        <TopToolBar />

        <section className="grow flex flex-col-reverse sm:flex-row overflow-hidden layout-middle-section">
          <ToolMenuNavbar params={params} />
          {/* tab */}
          <Suspense fallback={null}>{tab}</Suspense>
          {/* object primary toolbar */}
          <ObjectPrimaryToolbar
            FontFamiliesProvider={
              <Suspense fallback="Loading fonts...">
                <FontFamiliesProvider documentId={documentId} />
              </Suspense>
            }
          />
          {/* page */}
          <Suspense fallback={<LoadingDocumentPage />}>{children}</Suspense>
        </section>
      </main>
    </I18nProviderClient>
  );
};

export default DocumentPageLayout;
