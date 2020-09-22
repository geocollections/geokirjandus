import SearchService from "@/middleware/SearchService";

export const fetchReference = async id => {
  return SearchService.getDetailView(id);
};


export const fetchReferences = async data => {
  return SearchService.search(data);
};

export const fetchLibrary = async id => {
  return SearchService.getLibrary(id);
}

export const fetchLibraryReferences = async id => {
  return SearchService.getLibraryReferences(id);
}