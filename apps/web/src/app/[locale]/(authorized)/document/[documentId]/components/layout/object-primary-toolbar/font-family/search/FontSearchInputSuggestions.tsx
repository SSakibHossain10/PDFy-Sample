import revalidate_tags from "@/constants/revalidate_tags";
import { api_font_all, api_get_document_fonts_by_document_id } from "@/constants/urls";
import { TDocumentFont } from "@/schemas/documentSchema";
import { TFont } from "@/schemas/fontSchema";

const FontSearchInputSuggestions = async ({ documentId }: { documentId?: TFont["_id"] }) => {
  const [globalFonts, documentFonts] = await Promise.all([
    fetch(api_font_all, {
      cache: "force-cache",
      next: { tags: [revalidate_tags.get_font_all] },
    }).then((data) => data.json()) as unknown as TFont[],
    fetch(`${api_get_document_fonts_by_document_id}/${documentId}`, {
      cache: "force-cache",
      next: { tags: [`${revalidate_tags.get_document_fonts_}${documentId}`] },
    }).then((data) => data.json()) as unknown as TDocumentFont[],
  ]);

  return (
    <datalist id="font-search-suggestions">
      {[...globalFonts, ...documentFonts].map((font) => (
        <option key={font._id} value={font.name} />
      ))}
    </datalist>
  );
};

export default FontSearchInputSuggestions;
