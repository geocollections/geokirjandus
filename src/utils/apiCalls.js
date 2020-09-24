import SearchService from "@/middleware/SearchService";

export const fetchReference = async id => {
  return SearchService.getDetailView(id, "reference");
};


export const fetchReferences = async data => {
  return SearchService.search(data, "reference");
};

export const fetchReferenceLibraries = async data => {
  return SearchService.search(data, "library");
}

export const fetchLibrary = async id => {
  return SearchService.getDetailView(id, "library");
}

export const fetchLibraryReferences = async id => {
  return SearchService.getLibraryReferences(id);
}