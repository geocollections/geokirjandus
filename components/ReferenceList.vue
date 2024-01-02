<template>
  <i18n-t keypath="results" tag="div" class="mb-2 text-xl" :plural="count">
    <template #count>
      <span class="font-bold">{{ count }}</span>
    </template>
  </i18n-t>
  <div v-if="count" class="space-y-2">
    <div>
      <div class="flex items-center space-x-2">
        <RadioGroup
          class="flex rounded-md shadow-sm"
          v-model="settingsStore.view"
        >
          <RadioGroupOption v-slot="{ checked }" value="summary">
            <span
              class="flex h-8 rounded-l-md border border-r-0 border-gray-300 px-2.5 py-1.5 text-sm hover:cursor-pointer dark:border-gray-700"
              :class="
                checked
                  ? 'bg-primary dark:bg-primary-400 hover:bg-primary-600 dark:hover:bg-primary-500 text-white dark:text-black'
                  : 'bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50'
              "
            >
              <UIcon class="h-5 w-5 flex-shrink-0" name="i-heroicons-bars-4" />
            </span>
          </RadioGroupOption>
          <RadioGroupOption v-slot="{ checked }" value="compact">
            <span
              class="flex h-8 rounded-r-md border border-gray-300 px-2.5 py-1.5 text-sm hover:cursor-pointer dark:border-gray-700"
              :class="
                checked
                  ? 'bg-primary dark:bg-primary-400 hover:bg-primary-600 dark:hover:bg-primary-500 text-white dark:text-black'
                  : 'bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/50'
              "
            >
              <UIcon
                name="i-heroicons-list-bullet"
                class="h-5 w-5 flex-shrink-0"
              />
            </span>
          </RadioGroupOption>
        </RadioGroup>
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
        <div class="flex items-center space-x-2">
          <USelectMenu
            class="w-40"
            v-model="referencesStore.sort"
            :options="referencesStore.sortSelectOptions"
            value-attribute="id"
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
            :options="referencesStore.perPageMenuOptions"
            value-attribute="value"
            option-attribute="label"
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
    </div>
    <div>
      <template
        v-for="(reference, index) in references"
        :key="`summary-${reference.id}`"
      >
        <UDivider v-if="index !== 0" />
        <ReferenceSummary
          v-if="settingsStore.view === 'summary'"
          :reference="reference"
          :position="
            index + (referencesStore.page - 1) * referencesStore.perPage
          "
        />
        <ReferenceCompact
          v-if="settingsStore.view === 'compact'"
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
import { RadioGroup, RadioGroupOption } from "@headlessui/vue";
import type { ReferenceDoc } from "~/pages/reference/index.vue";
defineProps<{ references: ReferenceDoc[]; count: number }>();
const emit = defineEmits<{ update: [] }>();
const { t } = useI18n({ useScope: "local" });
const referencesStore = useReferencesStore();
const settingsStore = useSettingsStore();

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
