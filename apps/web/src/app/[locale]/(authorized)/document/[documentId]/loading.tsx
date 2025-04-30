import { A4_ASPET_RATIO } from "@/constants/layout";

const LoadingDocumentPage = () => (
  <section className="grow h-full flex items-center">
    <div
      className="bg-primary-100/20 w-149 m-auto animate-pulse"
      style={{
        aspectRatio: A4_ASPET_RATIO,
      }}
    />
  </section>
);

export default LoadingDocumentPage;
