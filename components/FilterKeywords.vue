<template>
  <UCheckbox
    v-for="option in modelValue.values()"
    :key="`selected-${option}`"
    class="label-w-full"
    :ui="{ label: 'flex' }"
    :model-value="true"
    checked
    @click="removeSelected(option)"
  >
    <template #label>
      {{ option }}
    </template>
  </UCheckbox>
  <UDivider v-if="modelValue.length > 0" />
  <UInput
    v-model="query"
    :placeholder="t('search')"
    :ui="{ icon: { trailing: { pointer: '' } } }"
  >
    <template #trailing>
      <UButton
        v-show="query !== ''"
        color="gray"
        variant="link"
        icon="i-heroicons-x-mark-20-solid"
        :aria-label="t('clearKeywordSearch')"
        :padded="false"
        @click="query = ''"
      />
    </template>
  </UInput>
  <template v-if="options.length > 0">
    <UCheckbox
      v-for="option in options"
      :key="`options-${option.value}`"
      :ui="{ label: 'flex', inner: 'w-full' }"
      :label="option.name"
      @click="addOption(option)"
    >
      <template #label>
        {{ option.name }}
        <UBadge size="xs" class="ml-auto block h-min">{{
          option.count
        }}</UBadge>
      </template>
    </UCheckbox>
  </template>
  <template v-else>
    <div class="text-center text-gray-500">
      {{ t("noMoreOptions") }}
    </div>
  </template>
  <div class="flex items-center justify-around">
    <UButton
      variant="link"
      icon="i-heroicons-chevron-double-left"
      :aria-label="t('previousPage')"
      :disabled="pagination.page <= 1"
      @click="prevPage"
    />
    <span>{{ pagination.page }}</span>
    <UButton
      variant="link"
      icon="i-heroicons-chevron-double-right"
      :aria-label="t('nextPage')"
      :disabled="!hasNextPage"
      @click="nextPage"
    />
  </div>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";

const { t } = useI18n({ useScope: "local" });

const emit = defineEmits<{
  "update:model-value": [value: string[]];
}>();
const props = defineProps<{
  q: string;
  filters: string[];
  modelValue: string[];
}>();

const query = ref("");
const pagination = ref({
  page: 1,
  paginateBy: 10,
});

type Option = {
  name: string;
  value: string;
  count: number;
};

const options = computed(() => {
  return (optionsFacet.value?.facet_counts.facet_pivot.keywords.map(
    (bucket) => {
      return {
        name: bucket.value,
        value: bucket.value,
        count: bucket.count,
      };
    },
  ) ?? []) as Option[];
});

const hasNextPage = computed(() => {
  return !(options.value.length < pagination.value.paginateBy);
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
    "facet.excludeTerms": props.modelValue.join(","),
    "facet.offset": (pagination.value.page - 1) * pagination.value.paginateBy,
    "facet.limit": pagination.value.paginateBy,
    "facet.overrequest.count": true,
    json: {
      filter: props.filters,
    },
  })),
  watch: false,
});

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
  () => props.modelValue,
  () => {
    refreshOptions();
  },
  { deep: true },
);

function addOption(option: Option) {
  emit("update:model-value", [...props.modelValue, option.value]);
}

function removeSelected(option: string) {
  emit(
    "update:model-value",
    props.modelValue.filter((val) => val !== option),
  );
}

function nextPage() {
  pagination.value.page += 1;
  refreshOptions();
}

function prevPage() {
  pagination.value.page -= 1;
  refreshOptions();
}

defineExpose({
  refreshOptions,
});
</script>

<style scoped lang="scss">
.label-w-full :deep(.text-sm) {
  @apply w-full;
}
</style>

<i18n lang="yaml">
et:
  search: "Otsi"
  noMoreOptions: "Valikud puuduvad"
  nextPage: "Järgmised märksõnad"
  previousPage: "Eelmised märksõnad"
  clearKeywordSearch: "Puhasta märksõna otsinguväli"
en:
  search: "Search"
  noMoreOptions: "No options available"
  nextPage: "Next keywords"
  previousPage: "Previous keywords"
  clearKeywordSearch: "Clear keyword search input"
</i18n>
