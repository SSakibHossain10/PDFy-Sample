import { getI18n } from "@/locales/server";
import DrawingIcn from "@public/icons/drawing.svg";
import ElementsIcn from "@public/icons/elements.svg";
import FormIcn from "@public/icons/form.svg";
import SignatureIcn from "@public/icons/signature.svg";
import TemplateIcn from "@public/icons/template.svg";
import Link from "next/link";
import { use } from "react";
import { CiText } from "react-icons/ci";
import { MdOutlinePermMedia } from "react-icons/md";
import { TdocumentLayoutParams } from "../../layout";
import { PDFEditorToolCategoriesEnum } from "../../types/tool";

const ToolMenuNavbar = ({ params }: { params: TdocumentLayoutParams }) => {
  const { locale, documentId } = use(params);

  const t = use(getI18n());

  return (
    <aside
      className="shrink-0 h-[var(--layout-bottom-bar)] sm:h-full w-full sm:w-14.5 py-0.5 sm:px-0.5 bg-primary-50/10 flex sm:flex-col sx:border-t sm:border-r border-primary-200/5 overflow-x-auto scrollbar-hidden"
      id="edtor-tool-menu-navbar"
    >
      <Link
        replace
        prefetch
        href={{
          pathname: `/${locale}/document/${documentId}/${PDFEditorToolCategoriesEnum.Templates}`,
        }}
        className="w-fit sm:w-full sx:h-full mx-auto px-2 sm:px-0.5 sm:py-3 sx:py-1.75 flex justify-between flex-col items-center sm:gap-1 rounded-xl sm:rounded-2xl"
        id="template-slot-nav-button"
      >
        <TemplateIcn className="size-5.25 sm:size-6.5 p-0.25" />
        <span className="font-semibold text-[10px]">{t("Templates")}</span>
      </Link>

      <Link
        replace
        prefetch
        href={{
          pathname: `/${locale}/document/${documentId}/${PDFEditorToolCategoriesEnum.Elements}`,
        }}
        className="w-fit sm:w-full sx:h-full mx-auto px-2 sm:px-0.5 sm:py-3 sx:py-1.75 flex justify-between flex-col items-center sm:gap-1 rounded-xl sm:rounded-2xl"
        id="element-slot-nav-button"
      >
        <ElementsIcn className="size-5.25 sm:size-6.5 p-0.75" />

        <span className="font-semibold text-[10px]">{t("Elements")}</span>
      </Link>

      <Link
        replace
        prefetch
        href={{
          pathname: `/${locale}/document/${documentId}/${PDFEditorToolCategoriesEnum.Text}`,
        }}
        className="w-fit sm:w-full sx:h-full mx-auto px-2 sm:px-0.5 sm:py-3 sx:py-1.75 flex justify-between flex-col items-center sm:gap-1 rounded-xl sm:rounded-2xl"
        id="text-slot-nav-button"
      >
        <CiText className="size-5.25 sm:size-6.5 p-0.5" strokeWidth={0.4} />
        <span className="font-semibold text-[10px]">{t("Text")}</span>
      </Link>

      <Link
        replace
        prefetch
        href={{
          pathname: `/${locale}/document/${documentId}/${PDFEditorToolCategoriesEnum.Media}`,
        }}
        className="w-fit sm:w-full sx:h-full mx-auto px-2 sm:px-0.5 sm:py-3 sx:py-1.75 flex justify-between flex-col items-center sm:gap-1 rounded-xl sm:rounded-2xl"
        id="media-slot-nav-button"
      >
        <MdOutlinePermMedia className="size-5.25 sm:size-6.5 p-0.75" />
        <span className="font-semibold text-[10px]">{t("Media")}</span>
      </Link>

      <Link
        replace
        prefetch
        href={{
          pathname: `/${locale}/document/${documentId}/${PDFEditorToolCategoriesEnum.Form}`,
        }}
        className="w-fit sm:w-full sx:h-full mx-auto px-2 sm:px-0.5 sm:py-3 sx:py-1.75 flex justify-between flex-col items-center sm:gap-1 rounded-xl sm:rounded-2xl"
        id="form-slot-nav-button"
      >
        <FormIcn className="size-5.25 sm:size-6.5 p-0.75" />
        <span className="font-semibold text-[10px]">{t("Form")}</span>
      </Link>

      <Link
        replace
        prefetch
        href={{
          pathname: `/${locale}/document/${documentId}/${PDFEditorToolCategoriesEnum.Drawing}`,
        }}
        className="w-fit sm:w-full sx:h-full mx-auto px-2 sm:px-0.5 sm:py-3 sx:py-1.75 flex justify-between flex-col items-center sm:gap-1 rounded-xl sm:rounded-2xl"
        id="drawing-slot-nav-button"
      >
        <DrawingIcn className="size-5.25 sm:size-6.5 p-0.5" />
        <span className="font-semibold text-[10px]">{t("Drawing")}</span>
      </Link>

      <Link
        replace
        prefetch
        href={{
          pathname: `/${locale}/document/${documentId}/${PDFEditorToolCategoriesEnum.Signature}`,
        }}
        className="w-fit sm:w-full sx:h-full mx-auto px-2 sm:px-0.5 sm:py-3 sx:py-1.75 flex justify-between flex-col items-center sm:gap-1 rounded-xl sm:rounded-2xl"
        id="signature-slot-nav-button"
      >
        <SignatureIcn className="size-5.25 sm:size-6.5 p-0.5" />
        <span className="font-semibold text-[10px]">{t("Signature")}</span>
      </Link>
    </aside>
  );
};

export default ToolMenuNavbar;
