<template>
  <MultiSelectPaginated
    v-model="selected"
    v-model:query="query"
    v-model:pagination="pagination"
    :options="options"
    :selected-counts="selectedCounts"
  />
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

const emit = defineEmits<{
  "update:model-value": [value: Set<string>];
  change: [];
}>();
const props = defineProps<{
  q: string;
  filters: string[];
  modelValue: Set<string>;
}>();

const selected = ref(new Set());
const query = ref("");
const pagination = ref({
  page: 1,
  paginateBy: 10,
});

const selectedCounts = computed(() => {
  if (!countsFacetRes.value) return null;
  const entries =
    Object.entries(countsFacetRes.value?.facet_counts.facet_queries).map(
      ([key, value]) => {
        return [key.split(":")[1], value];
      }
    ) ?? [];
  return Object.fromEntries(entries);
});

const options = computed(() => {
  return optionsFacet.value?.facet_counts.facet_pivot.keywords.map((bucket) => {
    return {
      name: bucket.value,
      value: bucket.value,
      count: bucket.count,
    };
  });
});

type SolrResponse<T = any> = {
  facets: any;
  response: {
    numFound: number;
    start: number;
    docs: T[];
  };
};

const { data: optionsFacet, refresh: refreshOptions } =
  await useSolrFetch<SolrResponse>("/reference", {
    query: computed(() => ({
      q: props.q,
      rows: 0,
      facet: "true",
      "facet.contains": query.value,
      "facet.contains.ignoreCase": true,
      "facet.pivot": "keywords",
      "facet.excludeTerms": Array.from(props.modelValue).join(","),
      "facet.offset": (pagination.value.page - 1) * pagination.value.paginateBy,
      "facet.limit": pagination.value.paginateBy,
      "facet.overrequest.count": true,
      json: {
        filter: props.filters,
      },
    })),
    watch: false,
  });
const countFacets = computed(() => {
  return Array.from(props.modelValue).map((val) => `keywords:${val}`);
});
const { data: countsFacetRes, refresh: refreshCounts } =
  await useSolrFetch<SolrResponse>("/reference", {
    query: computed(() => ({
      q: props.q,
      rows: 0,
      facet: "true",
      "facet.query": countFacets.value,
      json: {
        filter: props.filters,
      },
    })),
    watch: false,
    immediate: false,
  });

await hydrateSelected();

watch(
  query,
  debounce(() => {
    pagination.value.page = 1;
    refreshOptions();
  }, 200)
);

watch(pagination, () => {
  refreshOptions();
});
watch(
  selected,
  (newSelected) => {
    pagination.value.page = 1;
    emit(
      "update:model-value",
      new Set(Array.from(newSelected).map((option) => option.value))
    );
    emit("change");
  },
  { deep: true }
);

watch([() => props.q, () => props.filters], async () => {
  await refreshCounts();
  refreshOptions();
});

async function hydrateSelected() {
  await refreshCounts();
  selected.value = new Set(
    Array.from(props.modelValue).map((val) => {
      return {
        name: val,
        value: val,
        count: selectedCounts.value[val],
      };
    })
  );
}
</script>

<style scoped lang="scss">
.label-w-full :deep(.text-sm) {
  @apply w-full;
}
</style>