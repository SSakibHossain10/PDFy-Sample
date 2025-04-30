import { PDFY_LOGO } from "@/constants";

const loading = () => {
  return (
    <div
      className="grow flex items-center justify-center"
      style={{
        minHeight: "min(100%, 100dvh)",
        minWidth: "min(100%, 100dvw)",
      }}
    >
      <img decoding="async" alt="PDFy logo" src={PDFY_LOGO} height={100} width={100} className="animate-bounce" />
    </div>
  );
};

export default loading;
