"use client";

const ElementSearchInput = ({ searchQuery }: { searchQuery?: string }) => {
  return (
    <input
      name="searchQuery"
      list="element-search-suggestions"
      defaultValue={searchQuery}
      type="search"
      className="grow bg-primary-100/15 px-1 py-1.5 text-sm text-center rounded-full"
      placeholder="Search Elements"
      onInput={(e) => {
        if (e.nativeEvent instanceof InputEvent && e.currentTarget.value) return; //ignore input event on typing (search once selected from suggestions)
        e.currentTarget.form?.requestSubmit();
      }}
    />
  );
};

export default ElementSearchInput;
