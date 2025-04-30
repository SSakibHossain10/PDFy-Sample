import { PDFY_LOGO } from "@/constants";
import Link from "next/link";
import { PiSignInDuotone } from "react-icons/pi";

const PublicHeader = () => {
  return (
    <header
      className="shrink-0 h-12 px-4 bg-primary-50/10 flex items-center gap-3 border-b border-primary-200/5"
      id="public-layout-header"
    >
      <Link href="/" className="grow flex items-center gap-1.5 active:text-primary-200">
        <img loading="lazy" src={PDFY_LOGO} alt="PDFy" width={28} height={28} />
        <h6>PDFy</h6>
      </Link>

      <Link
        href="/auth/signin"
        className="bg-primary-50/10 px-4 py-1.5 flex items-center gap-1 rounded-full"
        id="signin-button"
      >
        <PiSignInDuotone className="size-4" />
        <p>SignIn</p>
      </Link>
    </header>
  );
};

export default PublicHeader;
