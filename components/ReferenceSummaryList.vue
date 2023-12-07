<template>
  <i18n-t keypath="results" tag="div" class="mb-2 text-xl" :plural="count">
    <template #count>
      <span class="font-bold">{{ count }}</span>
    </template>
  </i18n-t>
  <div v-if="count" class="space-y-2">
    <div class="flex items-center space-x-2">
      <ExportPopover v-if="selectStore.selected.length > 0" />
      <span
        class="text-sm text-green-600"
        v-if="selectStore.selected.length > 0"
      >
        {{ t("selected", { count: selectStore.selected.length }) }}
      </span>
    </div>
    <div class="flex flex-col items-end space-y-2 lg:flex-row">
      <div class="flex items-center">
        <USelectMenu
          class="w-40"
          v-model="referencesStore.sort"
          :options="referencesStore.sortOptions"
          value-attribute="value"
          option-attribute="name"
          icon="i-heroicons-arrows-up-down"
        >
          <template #label>
            {{ referencesStore.currentSort.name }}
          </template>
        </USelectMenu>
      </div>
      <div class="ml-auto flex items-center space-x-2">
        <USelectMenu
          v-model="referencesStore.perPage"
          :options="referencesStore.perPageOptions"
        />
        <UPagination
          v-model="referencesStore.page"
          :page-count="referencesStore.perPage"
          :total="count"
          :max="5"
          show-first
          show-last
        />
      </div>
    </div>
    <template v-for="(reference, index) in references">
      <UDivider v-if="index !== 0" />
      <ReferenceSummary
        :reference="reference"
        :selected="isSelected(reference.id)"
        :position="index + (referencesStore.page - 1) * referencesStore.perPage"
        @update:selected="handleSelectUpdate(reference.id)"
      />
    </template>

    <UPagination
      v-model="referencesStore.page"
      :ui="{ base: 'ml-auto' }"
      :page-count="referencesStore.perPage"
      :total="count"
      :max="5"
      show-first
      show-last
    />
  </div>
  <UAlert
    v-else
    color="yellow"
    variant="subtle"
    icon="i-heroicons-exclamation-triangle"
    title=""
    :description="t('noResults')"
  />
</template>

<script setup lang="ts">
defineProps<{ references: ReferenceDoc[]; count: number }>();
const emit = defineEmits<{ update: [] }>();
const { t } = useI18n({ useScope: "local" });
const referencesStore = useReferencesStore();
const selectStore = useReferenceSelectStore();

export type ReferenceDoc = {
  id: string;
  reference: string;
  title?: string;
  author?: string;
  journal_name?: string;
  book?: string;
  abstract?: string;
  doi_url?: string;
  attachment__filename?: string;
  parent_reference__attachment__filename?: string;
  filename?: string;
  url?: string;
  parent_reference__url?: string;
  year_numeric?: number;
  volume?: string;
  pages?: string;
};

watch(
  [
    () => referencesStore.sort,
    () => referencesStore.perPage,
    () => referencesStore.page,
  ],
  ([_newSort, _newPerPage, newPage], [_oldSort, _oldPerPage, oldPage]) => {
    if (newPage === oldPage) {
      referencesStore.page = 1;
    }
    emit("update");
  },
);
function handleSelectUpdate(updatedId: string) {
  const index = selectStore.selected.findIndex((id) => id === updatedId);
  if (index === -1) selectStore.selected.push(updatedId);
  else selectStore.selected.splice(index, 1);
}

function isSelected(id: string) {
  return selectStore.selected.includes(id);
}
</script>

<i18n lang="yaml">
et:
  results: "Tulemused puuduvad | {count} tulemus | {count} tulemust"
  noResults: "Otsingu parameetritele vastavaid tulemusi ei leitud. Muuda päringut ja filtreid."
en:
  results: "No results | {count} result | {count} results"
  noResults: "Search resulted in zero matching results. Change the search query and filters."
</i18n>
