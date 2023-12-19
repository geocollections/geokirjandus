<template>
  <MultiSelectPaginated
    :model-value="selected"
    v-model:query="query"
    v-model:pagination="pagination"
    :options="options ?? []"
    :selected-counts="selectedCounts"
    @add="handleAdd"
    @remove="handleRemove"
  />
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

const emit = defineEmits<{
  "update:model-value": [value: Set<string>];
  change: [];
  add: [value: any];
  remove: [value: any];
}>();
const props = defineProps<{
  q: string;
  filters: string[];
  modelValue: Set<string>;
}>();
type SelectedItem = {
  count: number;
  name: string;
  value: string;
};
const selected = ref(new Set<SelectedItem>());
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
      },
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

const { data: optionsFacet, refresh: refreshOptions } = await useSolrFetch<
  SolrResponse & {
    facet_counts: {
      facet_pivot: { keywords: { value: string; count: number }[] };
    };
  }
>("/reference", {
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
const { data: countsFacetRes, refresh: refreshCounts } = await useSolrFetch<
  SolrResponse & { facet_counts: { facet_queries: { [K: string]: number } } }
>("/reference", {
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
  }, 200),
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
      new Set(Array.from(newSelected).map((option) => option.value)),
    );
    emit("change");
  },
  { deep: true },
);

// NOTE: In case filters are reset, clear the selected value
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue.size < 1) selected.value.clear();
  },
  { deep: true },
);

async function hydrateSelected() {
  await refreshCounts();
  selected.value = new Set(
    Array.from(props.modelValue).map((val) => {
      return {
        name: val,
        value: val,
        count: selectedCounts.value[val],
      };
    }),
  );
}
function handleAdd(obj: SelectedItem) {
  pagination.value.page = 1;
  emit("add", obj.value);
  emit("change");
}
function handleRemove(obj: SelectedItem) {
  pagination.value.page = 1;
  emit("remove", obj.value);
  emit("change");
}
defineExpose({
  refreshCounts,
  refreshOptions,
});
</script>

<style scoped lang="scss">
.label-w-full :deep(.text-sm) {
  @apply w-full;
}
</style>
