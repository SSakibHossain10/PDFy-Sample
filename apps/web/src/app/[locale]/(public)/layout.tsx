import { ReactNode } from "react";
import PublicFooter from "./components/PublicFooter";
import PublicHeader from "./components/PublicHeader";

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
