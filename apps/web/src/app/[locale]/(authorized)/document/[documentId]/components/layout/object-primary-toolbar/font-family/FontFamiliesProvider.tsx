import revalidate_tags from "@/constants/revalidate_tags";
import { api_font_all, api_get_document_fonts_by_document_id } from "@/constants/urls";
import { IDocument, TDocumentFont } from "@/schemas/documentSchema";
import { TFont } from "@/schemas/fontSchema";
import Form from "next/form";
import { Suspense } from "react";
import FontFamilyCardsWrapper from "./FontCardsWrapper";
import FontSearchInput from "./search/FontSearchInput";
import FontSearchInputSuggestions from "./search/FontSearchInputSuggestions";

export type TTemplatepageSearchParams = Promise<{ categoryId?: string; searchQuery?: string }>;

const FontFamiliesProvider = async ({ documentId }: { documentId: IDocument["_id"] }) => {
  const [globalFonts, documentFonts] = await Promise.all([
    fetch(api_font_all, {
      cache: "force-cache",
      next: { tags: [revalidate_tags.get_font_all] },
    })
      .then((data) => data.json())
      .then((data: TFont[]) => data.filter((font) => !font.tags.includes("signature"))) as unknown as TFont[],
    fetch(`${api_get_document_fonts_by_document_id}/${documentId}`, {
      cache: "force-cache",
      next: { tags: [`${revalidate_tags.get_document_fonts_}${documentId}`] },
    }).then((data) => data.json()) as unknown as TDocumentFont[],
  ]);

  return (
    <>
      <Form action="" className="z-10 flex sticky top-2.5 px-5">
        <FontSearchInput />

        <Suspense fallback={null}>
          <FontSearchInputSuggestions documentId={documentId} />
        </Suspense>
      </Form>

      <FontFamilyCardsWrapper //@ts-expect-error
        globalFonts={globalFonts.filter((gFont) => !documentFonts.find((f) => f.font_id === gFont._id))}
        documentFonts={documentFonts}
      />
    </>
  );
};

export default FontFamiliesProvider;
