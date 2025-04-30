import revalidate_tags from "@/constants/revalidate_tags";
import { api_font_all } from "@/constants/urls";
import { TFont } from "@/schemas/fontSchema";
import Link from "next/link";
import { IDocumentPageParams } from "../../page";
import SignaturePanel from "./components/SignaturePanel";

const SignatureSlot = async ({ params }: { params: IDocumentPageParams }) => {
  const signatureFonts = await fetch(api_font_all, {
    cache: "force-cache",
    next: { tags: [revalidate_tags.get_font_all] },
  })
    .then((data) => data.json() as unknown as TFont[])
    .then((data) => data.filter((font) => font.tags.includes("signature")));

  const documentId = (await params).documentId;

  return (
    <div
      className="w-full h-full bg-gr-multi-dark py-5 sx:pt-2 sm:pt-12 flex flex-col sx:rounded-t-xl sm:rounded-r-xl relative"
      id="signature-slot"
    >
      <div className="sm:hidden pb-3 flex justify-center">
        <span className="h-1 w-10 rounded-full bg-primary-200/50" />
      </div>
      <SignaturePanel signatureFonts={signatureFonts} />
      <div className="shrink-0 bg-primary-50/5 h-7 grid grid-cols-3 text-sm sx:rounded-t-xl sm:rounded-b-xl absolute sx:bottom-0 sm:top-0 w-full">
        <button className="text-center bg-primary-50/10 rounded-full">Type</button>
        <Link href={`/document/${documentId}/drawing`} className="flex justify-center items-center">
          Draw
        </Link>
        <Link href={`/document/${documentId}/media`} className="flex justify-center items-center">
          Upload
        </Link>
      </div>
    </div>
  );
};

export default SignatureSlot;
