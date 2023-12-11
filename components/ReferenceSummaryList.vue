<template>
  <i18n-t keypath="results" tag="div" class="mb-2 text-xl" :plural="count">
    <template #count>
      <span class="font-bold">{{ count }}</span>
    </template>
  </i18n-t>
  <div v-if="count" class="space-y-2">
    <div class="flex items-center space-x-2">
      <ExportPopover />
      <ClientOnly>
        <template v-if="referencesStore.selection.length > 0">
          <span class="text-sm text-green-600">
            {{ t("selected", { count: referencesStore.selection.length }) }}
          </span>
          <UButton
            trailing-icon="i-heroicons-x-mark"
            color="white"
            type="ghost"
            @click="handleClearSelection"
            >{{ t("clear") }}</UButton
          >
        </template>
      </ClientOnly>
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
    <div>
      <template
        v-for="(reference, index) in references"
        :key="`summary-${reference.id}`"
      >
        <UDivider v-if="index !== 0" />
        <ReferenceSummary
          :reference="reference"
          :position="
            index + (referencesStore.page - 1) * referencesStore.perPage
          "
        />
      </template>
    </div>

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

function handleClearSelection() {
  referencesStore.selection = [];
}
</script>

<i18n lang="yaml">
et:
  results: "Tulemused puuduvad | {count} tulemus | {count} tulemust"
  noResults: "Otsingu parameetritele vastavaid tulemusi ei leitud. Muuda päringut ja filtreid."
  selected: "{count} kirje valitud | {count} kirjet valitud"
  clear: "Puhasta"
en:
  results: "No results | {count} result | {count} results"
  noResults: "Search resulted in zero matching results. Change the search query and filters."
  selected: "{count} item selected | {count} items selected"
  clear: "Clear"
</i18n>
