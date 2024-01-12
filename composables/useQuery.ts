export const useQuery = () => {
  const query = ref("");

  const solrQuery = computed(() => {
    return query.value.length < 1 ? "*" : query.value;
  });

  function $reset() {
    query.value = "";
  }
  return { query, solrQuery, $reset };
};
