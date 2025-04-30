"use client";

const TemplateSearchInput = ({ searchQuery }: { searchQuery?: string }) => {
  return (
    <input
      id="template-search-input"
      name="searchQuery"
      list="template-search-suggestions"
      defaultValue={searchQuery}
      type="search"
      className="grow bg-primary-100/15 px-1 py-1.5 text-sm text-center rounded-full"
      placeholder="Search Templates"
      onInput={(e) => {
        if (e.nativeEvent instanceof InputEvent && e.currentTarget.value) return; //ignore input event on typing (search once selected from suggestions)
        e.currentTarget.form?.requestSubmit();
      }}
    />
  );
};

export default TemplateSearchInput;
