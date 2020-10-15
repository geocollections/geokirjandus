import SearchService from "@/middleware/SearchService";

export const fetchReference = id => {
  return SearchService.getDetailView(id, "reference");
};

export const fetchReferences = data => {
  const parameters = {
    queryObject: data.search,
    filterQueryObject: data.advancedSearch
  };

  return SearchService.search(parameters, "reference");
};

export const fetchReferenceLibraries = data => {
  const parameters = {
    queryObject: data.search,
    filterQueryObject: data.advancedSearch
  };

  return SearchService.search(parameters, "library");
};

export const fetchLibrary = id => {
  return SearchService.getDetailView(id, "library");
};

export const fetchLibraries = data => {
  const parameters = {
    queryObject: data.search,
    filterQueryObject: data.advancedSearch
  };

  return SearchService.search(parameters, "library");
};

export const fetchLibraryReferences = id => {
  const parameters = {
    sortBy: ["author"],
    sortDesc: [false],
    queryObject: {
      value: `libraries:*|${id}|*`
    }
  };
  return SearchService.search(parameters, "reference");
};

export const fetchReferenceLocalities = data => {
  const parameters = {
    queryObject: data.search,
    filterQueryObject: data.advancedSearch
  };

  return SearchService.search(parameters, "locality");
};
