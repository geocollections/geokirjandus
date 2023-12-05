export const useSearchPosition = () => {
  // position of the selected reference in search results
  const searchPosition = ref(-1);

  // indicates if navigated to detail view from search
  const fromSearch = computed(() => searchPosition.value >= 0);

  return { searchPosition, fromSearch };
};
