<template>
  <UPopover :popper="{ placement: 'bottom-start' }" :ui="{ wrapper: 'w-fit' }">
    <UButton
      color="white"
      icon="i-heroicons-arrow-down-tray"
      @click="openCitationPopover"
    >
      {{ t("export") }}
    </UButton>
    <template #panel>
      <div class="w-96 p-2">
        <div class="pb-2 text-lg">{{ t("exportToFile") }}</div>
        <UForm class="space-y-2" :state="state">
          <UFormGroup :label="t('selectionSize')" :help="selectionHelp">
            <USelect
              v-model="state.selection"
              :options="selectionOptions"
              option-attribute="label"
            >
            </USelect>
          </UFormGroup>
          <UFormGroup :label="t('format')">
            <USelect
              v-model="state.format"
              :options="formatOptions"
              option-attribute="label"
            >
            </USelect>
          </UFormGroup>
          <UFormGroup
            v-if="state.format === 'cite'"
            :label="t('citationStyle')"
          >
            <USelect
              class="w-40"
              v-model="settings.citationStyle"
              :options="settings.citationStyleOptions"
              value-attribute="value"
              option-attribute="name"
            ></USelect>
          </UFormGroup>
          <UButton
            icon="i-heroicons-arrow-down-tray"
            size="sm"
            @click="exportItems"
          >
            {{ t("export") }}
          </UButton>
        </UForm>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
const { t } = useI18n({ useScope: "local" });
const referencesStore = useReferencesStore();
const { selection } = storeToRefs(referencesStore);
const openExport = ref(false);
const { $apiFetch, $solrFetch } = useNuxtApp();

const selectionOptions = computed(() => {
  return [
    {
      value: "page",
      label: t("page"),
    },
    {
      value: "all",
      label: t("all"),
    },
    {
      value: "selection",
      label: t("selection", { count: selection.value.length }),
      disabled: selection.value.length < 1,
    },
  ];
});

const formatOptions = computed(() => {
  return [
    { value: "ris", label: "RIS" },
    { value: "cite", label: t("citations") },
  ];
});

const state = ref({
  selection: selectionOptions.value[0].value,
  format: formatOptions.value[0].value,
});

const selectionHelp = computed(() => {
  if (state.value.selection === "all") {
    return t("maxExportHelp");
  }
  return;
});
async function getExportIds() {
  if (state.value.selection === "selection") {
    return selection.value;
  }
  if (state.value.selection === "page") {
    const res = await $solrFetch<SolrResponse<{ id: string }>>("/reference", {
      query: {
        q: referencesStore.solrQuery,
        fl: ["id"],
        rows: referencesStore.perPage,
        start: referencesStore.offset,
        sort: referencesStore.sort,
        json: {
          filter: [
            ...referencesStore.solrFilters,
            ...referencesStore.routeSolrFilters,
          ],
        },
      },
    });

    return res.response.docs.map((val) => val.id);
  }
  if (state.value.selection === "all") {
    const res = await $solrFetch<SolrResponse<{ id: string }>>("/reference", {
      query: {
        q: referencesStore.solrQuery,
        fl: ["id"],
        rows: 1000,
        sort: referencesStore.sort,
        json: {
          filter: [
            ...referencesStore.solrFilters,
            ...referencesStore.routeSolrFilters,
          ],
        },
      },
    });

    return res.response.docs.map((val) => val.id);
  }
  return [];
}

function getExportLimit() {
  if (state.value.selection === "selection") {
    return referencesStore.selection.length;
  }
  if (state.value.selection === "page") {
    return referencesStore.perPage;
  }
  if (state.value.selection === "all") {
    return 1000;
  }
}
const settings = useSettingsStore();

const formatQueryParams = computed(() => {
  if (state.value.format === "ris") {
    return {
      format: "ris",
    };
  }
  if (state.value.format === "cite") {
    return {
      format: "cite",
      citation_style: settings.citationStyle,
    };
  }
});
const formatFileType = computed(() => {
  if (state.value.format === "ris") {
    return "ris";
  }
  if (state.value.format === "cite") {
    return "txt";
  }
});

async function exportItems() {
  const ids = await getExportIds();
  const res = await $apiFetch<string>(
    `https://rwapi.geoloogia.info/api/v1/public/references/`,
    {
      query: {
        id__in: ids.join(","),
        limit: getExportLimit(),
        ...formatQueryParams.value,
      },
    },
  );

  const blob = new Blob([res], { type: "text/plain" });
  const urlForDownload = window.URL.createObjectURL(blob);
  const linkElement = document.createElement("a");

  linkElement.href = urlForDownload;
  linkElement.download = `references.${formatFileType.value}`;
  linkElement.click();

  URL.revokeObjectURL(urlForDownload); // free memory
}

async function openCitationPopover() {
  openExport.value = !openExport.value;
}
</script>

<i18n lang="yaml">
et:
  export: "Eksport"
  exportRis: "Ekspordi RIS"
  selection: "Valitud kirjed puuduvad | Valik ({count}) | Valik ({count})"
  page: "Kõik kirjed sellel leheküljel"
  all: "Kõik kirjed"
  maxExportHelp: "Esimesed 1000 kirjet salvestatakse faili"
  selectionSize: "Valiku suurus"
  exportToFile: "Ekspordi kirjed faili"
  format: "Formaat"
  citations: "Viited"
  citationStyle: "Viitamisstiil"
en:
  export: "Export"
  exportRis: "Export RIS"
  selection: "No items selected | Selection ({count}) | Selection ({count})"
  page: "All results on current page"
  all: "All results"
  maxExportHelp: "Only the first 1000 references will be saved in your file"
  selectionSize: "Selection"
  exportToFile: "Export references to file"
  format: "Format"
  citations: "Citations"
  citationStyle: "Citation style"
</i18n>
