import { ReactNode } from "react";
import AuthorizedFooter from "./components/footer/AuthorizedFooter";
import AuthorizedHeader from "./components/header/AuthorizedHeader";
import "./styles/authorized_layout_styles.css";

const AuthorizedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <AuthorizedHeader />
      {children}
      <AuthorizedFooter />
    </>
  );
};

export default AuthorizedLayout;
