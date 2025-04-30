import { ReactNode } from "react";
import PublicFooter from "../(public)/components/PublicFooter";
import PublicHeader from "../(public)/components/PublicHeader";
const PublicLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <PublicHeader />
      {children}
      <PublicFooter />
    </>
  );
};

export default PublicLayout;
