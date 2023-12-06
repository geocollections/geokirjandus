export const useSearchPosition = () => {
  const localePath = useLocalePath();

  // position of the selected reference in search results
  const searchPosition = ref(-1);

  const enteredFrom = ref(localePath("/references"));
  // indicates if navigated to detail view from search
  const fromSearch = computed(() => searchPosition.value >= 0);

  return { searchPosition, fromSearch, enteredFrom };
};
