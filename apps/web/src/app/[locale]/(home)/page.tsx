import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Documy",
};

export default function Home() {
  console.log("rendered Home");
  return (
    <main className="grow flex flex-col gap-6 justify-center items-center w-full max-w-5xl mx-auto">
      <h4>Welcome</h4>
      <Link href="/pdf-editor" prefetch className="bg-primary-50/10 px-6 py-1.5 rounded-full">
        Upload PDF
      </Link>
    </main>
  );
}
