<template>
  <UPopover :ui="{ wrapper: 'w-fit' }">
    <UButton
      color="white"
      icon="i-heroicons-arrow-down-tray"
      @click="openCitationPopover"
    >
      {{ t("export") }}
    </UButton>
    <template #panel>
      <div class="w-96 space-y-2 p-4">
        <UButton color="gray" variant="ghost" size="sm" @click="exportRis">
          {{ t("exportRis") }}
        </UButton>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
const { t } = useI18n({ useScope: "local" });
const referencesStore = useReferencesStore();
const { selection } = storeToRefs(referencesStore);
const openExport = ref(false);

async function exportRis() {
  const res = await $fetch(
    `https://rwapi.geoloogia.info/api/v1/public/references/`,
    {
      query: {
        format: "ris",
        id__in: selection.join(","),
      },
    },
  );

  const blob = new Blob([res], { type: "text/plain" });
  const urlForDownload = window.URL.createObjectURL(blob);
  const linkElement = document.createElement("a");

  linkElement.href = urlForDownload;
  linkElement.download = `references.ris`;
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
en:
  export: "Export"
  exportRis: "Export RIS"
</i18n>
