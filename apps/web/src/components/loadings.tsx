import { A4_ASPET_RATIO } from "@/constants/layout";

export const LoadingRecentDocuments = () => (
  <div className="bg-primary-50/5 flex flex-col rounded">
    <div className="flex justify-between items-center gap-2.5 p-2.5">
      <h6>Recent documents</h6>

      <span className="w-18 h-5 rounded-full bg-primary-100/20 animate-pulse"></span>
    </div>

    <div className="flex gap-2 px-2.5 pb-2.5 sm:gap-3 md:gap-3.5 lg:gap-4 sm:px-4.5 sm:pb-4.5 relative overflow-hidden">
      {Array.from(
        {
          length: 7,
        },
        (_, i) => i + 1
      ).map((key) => (
        <div
          key={key}
          className="shrink-0 w-[31%] sm:w-[22.5%] md:w-[18%] lg:w-[15%] h-full relative bg-primary-100/20 animate-pulse"
        >
          <span className="absolute top-2 right-2 w-7 h-6 bg-primary-900/50 rounded-md" />
          <small className="absolute bottom-2 left-2 size-5.5 bg-primary-100/50 border border-primary-700 rounded-full" />

          <div className="w-full" style={{ aspectRatio: A4_ASPET_RATIO }} />
        </div>
      ))}
    </div>
  </div>
);

export const LoadingCategoriesTemplates = () => (
  <div className="flex flex-col gap-4 pb-4 w-full max-w-5xl mx-auto">
    {Array.from(
      {
        length: 5,
      },
      (_, i) => i + 1
    ).map((key) => (
      <div key={key} className="bg-primary-50/5 flex flex-col rounded">
        <div className="flex justify-between items-center gap-2.5 p-2.5">
          <h6 className="w-20 h-5.5 rounded bg-primary-100/20 animate-pulse" />
          <span className="w-18 h-5 rounded-full bg-primary-100/20 animate-pulse" />
        </div>

        <div className="flex gap-2 px-2.5 @sm:gap-3 @md:gap-3.5 @lg:gap-4 @sm:px-4 pb-2.5 overflow-hidden">
          {Array.from(
            {
              length: 10,
            },
            (_, i) => i + 1
          ).map((key) => (
            <div
              key={key}
              className="shrink-0 w-[31%] @sm:w-[22.5%] @md:w-[18%] @lg:w-[15%] h-fit relative bg-primary-100/20 animate-pulse"
            >
              <small className="absolute bottom-2 left-2 size-5.5 bg-primary-100/50 border border-primary-700 rounded-full" />
              <div className="w-full" style={{ aspectRatio: A4_ASPET_RATIO }} />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);
export const LoadingCategoryTemplates = () => (
  <div className="grow bg-primary-50/5 grid grid-cols-3 @sm:grid-cols-4 @md:grid-cols-5 @lg:grid-cols-6 gap-2.5 p-2.5 @sm:gap-3 @md:gap-3.5 @lg:gap-4 @sm:p-4 content-start rounded w-full max-w-5xl mx-auto">
    {Array.from(
      {
        length: 12,
      },
      (_, i) => i + 1
    ).map((key) => (
      <div key={key} className="shrink-0 w-full h-fit relative bg-primary-100/20 animate-pulse">
        <small className="absolute bottom-2 left-2 size-5.5 bg-primary-100/50 border border-primary-700 rounded-full" />
        <div className="w-full" style={{ aspectRatio: A4_ASPET_RATIO }} />
      </div>
    ))}
  </div>
);
export const LoadingSearhedTemplates = () => (
  <div className="grow bg-primary-50/5 grid grid-cols-3 @sm:grid-cols-4 @md:grid-cols-5 @lg:grid-cols-6 gap-2.5 p-2.5 @sm:gap-3 @md:gap-3.5 @lg:gap-4 @sm:p-4 content-start rounded w-full max-w-5xl mx-auto">
    {Array.from(
      {
        length: 12,
      },
      (_, i) => i + 1
    ).map((key) => (
      <div key={key} className="shrink-0 w-full h-fit relative bg-primary-100/20 animate-pulse">
        <small className="absolute bottom-2 left-2 size-5.5 bg-primary-100/50 border border-primary-700 rounded-full" />
        <div className="w-full" style={{ aspectRatio: A4_ASPET_RATIO }} />
      </div>
    ))}
  </div>
);

export const LoadingCategoriesElements = () => (
  <div className="w-full flex flex-col gap-4 pb-4">
    {Array.from(
      {
        length: 5,
      },
      (_, i) => i + 1
    ).map((key) => (
      <div key={key} className="bg-primary-50/5 flex flex-col rounded">
        <div className="flex justify-between items-center gap-2.5 p-2.5">
          <h6 className="w-20 h-5.5 rounded bg-primary-100/20 animate-pulse" />
          <span className="w-18 h-5 rounded-full bg-primary-100/20 animate-pulse" />
        </div>

        <div className="flex gap-1.5 px-2.5 pb-2.5 max-w-dvw overflow-hidden">
          {Array.from(
            {
              length: 10,
            },
            (_, i) => i + 1
          ).map((key) => (
            <button key={key} className="shrink-0 w-[18%] sm:w-[22.5%] aspect-square bg-primary-100/20 animate-pulse" />
          ))}
        </div>
      </div>
    ))}
  </div>
);
export const LoadingCategoryElements = () => (
  <div className="grow bg-primary-50/5 grid grid-cols-5 gap-2 p-2 content-start rounded">
    {Array.from(
      {
        length: 50,
      },
      (_, i) => i + 1
    ).map((key) => (
      <button key={key} className="shrink-0 w-full aspect-square bg-primary-100/20 animate-pulse" />
    ))}
  </div>
);
export const LoadingSearhedElements = () => (
  <div className="grow bg-primary-50/5 grid grid-cols-5 gap-2 p-2 content-start rounded">
    {Array.from(
      {
        length: 50,
      },
      (_, i) => i + 1
    ).map((key) => (
      <button key={key} className="shrink-0 w-full aspect-square bg-primary-100/20 animate-pulse" />
    ))}
  </div>
);
