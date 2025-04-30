"use client";

import { useSearchParams } from "next/navigation";

const FontSearchInput = () => {
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get("searchQuery") as string;

  return (
    <input
      id="font-search-input"
      name="searchQuery"
      list="font-search-suggestions"
      defaultValue={searchQuery}
      type="search"
      className="grow bg-primary-100/15 px-1 py-1.5 text-sm text-center rounded-full"
      placeholder="Search Fonts"
      onInput={(e) => {
        if (e.nativeEvent instanceof InputEvent && e.currentTarget.value) return; //ignore input event on typing (search once selected from suggestions)
        e.currentTarget.form?.requestSubmit();
      }}
    />
  );
};

export default FontSearchInput;
