<template>
  <UForm :state="{ localQuery }" @submit="handleSubmit">
    <i18n-t
      v-if="numFound"
      keypath="found"
      tag="div"
      class="mb-2 text-xl"
      :plural="numFound ?? 0"
    >
      <template #count>
        <span class="font-bold">{{ numFound ?? 0 }}</span>
      </template>
    </i18n-t>
    <UButtonGroup size="lg" :ui="{ wrapper: { horizontal: 'w-full' } }">
      <UInput
        v-model="localQuery"
        :placeholder="t('searchAllFields')"
        :ui="{ wrapper: 'w-full' }"
      />
      <UButton icon="i-heroicons-magnifying-glass" type="submit"> </UButton>
    </UButtonGroup>
  </UForm>
  <div class="space-y-1">
    <div class="flex">
      <div class="text-xl font-medium">{{ t("filters") }}</div>
      <UButton
        v-if="activeFiltersCount > 0"
        class="ml-auto"
        icon="i-heroicons-trash"
        variant="ghost"
        @click="handleReset"
      >
        {{ t("reset") }}
      </UButton>
    </div>
    <UFormGroup :label="t('author')">
      <UInput v-model="filters.author" @change="handleFilterChange" />
    </UFormGroup>
    <UFormGroup :label="t('year')" :ui="{ container: 'flex gap-x-1' }">
      <UInput
        :model-value="filters.year[0]"
        @input="filters.year[0] = parseNumber($event.target.value)"
        type="number"
        :placeholder="t('start')"
        @change="handleFilterChange"
      />
      <UInput
        :model-value="filters.year[1]"
        @input="filters.year[1] = parseNumber($event.target.value)"
        type="number"
        :placeholder="t('end')"
        @change="handleFilterChange"
      />
    </UFormGroup>
    <UFormGroup :label="t('title')">
      <UInput v-model="filters.title" @change="handleFilterChange" />
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
defineProps<{ numFound?: number }>();
const emit = defineEmits<{ update: []; reset: [] }>();

const { t } = useI18n({ useScope: "local" });
const route = useRoute();
const librariesStore = useLibrariesStore();
const { filters, query, activeFiltersCount } = storeToRefs(librariesStore);
librariesStore.setStateFromQueryParams(route);

const localQuery = ref("");
localQuery.value = query.value;

function handleFilterChange() {
  emit("update");
}
function handleSubmit() {
  query.value = localQuery.value;
  emit("update");
}
function handleReset() {
  emit("reset");
}
</script>

<style scoped lang="scss">
.label-w-full :deep(.text-sm) {
  @apply w-full;
}
</style>

<i18n lang="yaml">
et:
  search: "Otsi"
  filters: "Filtrid"
  year: "Aasta"
  author: "Koostaja(d)"
  title: "Pealkiri"
  searchAllFields: "Otsi kõigilt väljadelt"
  found: "Tulemused puuduvad | {count} tulemus leitud | {count} tulemust leitud"
  start: "Algus"
  end: "Lõpp"
en:
  search: "Search"
  filters: "Filters"
  year: "Year"
  author: "Compiler(s)"
  title: "Title"
  searchAllFields: "Search all fields"
  found: "No results found | Found {count} result | Found {count} results"
  start: "Start"
  end: "End"
</i18n>
