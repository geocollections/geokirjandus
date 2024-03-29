<template>
  <UPopover :ui="{ wrapper: 'w-fit' }">
    <UButton
      color="black"
      :size="size"
      :variant="variant"
      icon="i-heroicons-document-text"
      @click="openCitationPopover"
    >
      {{ t("cite") }}
    </UButton>
    <template #panel>
      <div class="w-96 space-y-2 p-4">
        <USelect
          class="w-40"
          v-model="settings.citationStyle"
          :options="settings.citationStyleOptions"
          value-attribute="value"
          option-attribute="name"
        ></USelect>
        <div
          class="flex items-start rounded border p-2 dark:border-gray-700 dark:bg-gray-800"
        >
          <div v-html="citation?.html"></div>
        </div>
        <div class="flex space-x-2">
          <UButton
            v-if="isSupported"
            variant="ghost"
            color="gray"
            size="sm"
            icon="i-heroicons-clipboard"
            @click="copy([createClipboardItems(citation!)])"
          >
            <span v-if="copied">
              {{ t("copied") }}
            </span>
            <span v-else>
              {{ t("copy") }}
            </span>
          </UButton>
          <span v-else>Clipboard API not supported by browser</span>
          <UButton color="gray" variant="ghost" size="sm" @click="exportRis">
            {{ t("exportRis") }}
          </UButton>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { useSettingsStore } from "~/stores/settingsStore";
// @ts-expect-error
import appConfig from "#build/app.config";
const props = withDefaults(
  defineProps<{
    id: number | string;
    size?: typeof appConfig.ui.button.size;
    variant?: typeof appConfig.ui.button.variant;
  }>(),
  { size: "xs", variant: "soft" },
);

const { t } = useI18n({ useScope: "local" });

type FormattedReferenceJsonResponse = {
  text: string;
  html: string;
};
const citation = ref<FormattedReferenceJsonResponse>();
const openCite = ref(false);
const { copy, copied, isSupported } = useClipboardItems();
const { $apiFetch } = useNuxtApp();

const settings = useSettingsStore();

watch(
  () => settings.citationStyle,
  () => {
    if (!openCite.value) return;
    fetchCitation();
  },
);

function createClipboardItems(reference: FormattedReferenceJsonResponse) {
  return new ClipboardItem({
    "text/plain": new Blob([reference.text], { type: "text/plain" }),
    "text/html": new Blob([reference.html], { type: "text/html" }),
  });
}

async function fetchCitation() {
  const res = await $apiFetch<FormattedReferenceJsonResponse>(
    `/references/${props.id}/`,
    {
      query: {
        format: "reference",
        style: settings.citationStyle,
        reference_format: "json",
      },
    },
  );
  citation.value = res;
}
async function exportRis() {
  const res = await $apiFetch<string>(`/references/${props.id}/`, {
    query: {
      format: "ris",
    },
  });

  const blob = new Blob([res], { type: "text/plain" });
  const urlForDownload = window.URL.createObjectURL(blob);
  const linkElement = document.createElement("a");

  linkElement.href = urlForDownload;
  linkElement.download = `reference_${props.id}.ris`;
  linkElement.click();

  URL.revokeObjectURL(urlForDownload); // free memory
}

async function openCitationPopover() {
  if (!citation.value) {
    await fetchCitation();
  }
  openCite.value = !openCite.value;
}
</script>

<i18n lang="yaml">
et:
  cite: "Viita"
  copy: "Kopeeri"
  copied: "Kopeeritud!"
  exportRis: "Ekspordi RIS"
en:
  cite: "Cite"
  copy: "Copy"
  copied: "Copied!"
  exportRis: "Export RIS"
</i18n>
