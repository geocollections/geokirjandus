import SearchService from "@/middleware/SearchService";

export const fetchReference = async id => {
  return SearchService.getDetailView(id);
};


export const fetchReferences = async data => {
  return SearchService.search(data);
};
