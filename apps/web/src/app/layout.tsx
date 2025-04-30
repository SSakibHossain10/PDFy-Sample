// import AppTopClinetSetup from "@/components/global/AppTopClinetSetup";
import { getStaticParams } from "@/locales/server";
import { Metadata } from "next";
import "./app.css";

export const metadata: Metadata = {
  title: "PDFy",
};

export function generateStaticParams() {
  return getStaticParams();
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
