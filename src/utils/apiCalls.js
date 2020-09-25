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
}

export const fetchLibraryReferences = id => {
  const data = {
    search: {
      value: `libraries:*|${id}|*`
    }
  };
  return SearchService.search(data, "reference");
};
