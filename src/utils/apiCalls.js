import SearchService from "@/middleware/SearchService";

export const fetchReference = id => {
  return SearchService.getDetailView(id, "reference");
};

export const fetchReferences = data => {
  return SearchService.search(data, "reference");
};

export const fetchReferenceLibraries = data => {
  return SearchService.search(data, "library");
};

export const fetchLibrary = id => {
  return SearchService.getDetailView(id, "library");
};

export const fetchLibraries = data => {
  return SearchService.search(data, "library");
};

export const fetchLibraryReferences = (id, query) => {
  const librariesObj = {
    type: "text",
    id: "libraries",
    lookUpType: null,
    value: `${id}`,
    label: "reference.libraries",
    fields: ["libraries"],
    hidden: true
  };
  const data = {
    ...query,
    search: query.search,
    advancedSearch: {
      ...query.advancedSearch,
      libraries: librariesObj
    }
  };
  return SearchService.search(data, "reference");
};

export const fetchReferenceLocalities = data => {
  return SearchService.search(data, "locality");
};
