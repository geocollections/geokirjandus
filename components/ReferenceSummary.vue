<template>
  <div class="space-y-2 py-2">
    <div>
      <NuxtLinkLocale
        :to="`/reference/${reference.id}`"
        class="text-xl hover:underline"
        @click="handleDetailNavigation"
      >
        {{ reference.title ? reference.title : reference.reference }}
      </NuxtLinkLocale>
      <div>{{ reference.author }}</div>
      <div>{{ reference.journal_name }}</div>
      <div>{{ reference.book }}</div>
      <div>
        {{ info }}
      </div>
    </div>
    <div class="flex items-center space-x-1">
      <UButton
        v-if="reference.abstract"
        color="black"
        variant="ghost"
        :trailing-icon="
          showAbstract ? 'i-heroicons-chevron-up' : 'i-heroicons-chevron-down'
        "
        @click="showAbstract = !showAbstract"
      >
        Abstract
      </UButton>
      <UButton
        v-if="reference.doi_url"
        variant="soft"
        color="yellow"
        icon="i-simple-icons-doi"
        :to="reference.doi_url"
      >
        DOI
      </UButton>
      <UButton
        v-if="pdf"
        variant="soft"
        color="red"
        icon="i-heroicons-document"
      >
        PDF
      </UButton>
      <UButton
        v-if="url"
        variant="soft"
        color="blue"
        icon="i-heroicons-arrow-top-right-on-square"
      >
        URL
      </UButton>
      <CitePopover :id="reference.id" />
    </div>
    <div v-if="showAbstract">
      <div
        class="rounded bg-gray-100 p-4 text-justify"
        v-html="reference.abstract"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ reference: any; position: number }>();
const { t } = useI18n({ useScope: "local" });
const { $translate } = useNuxtApp();

const showAbstract = ref(false);

const pdf = computed(() => {
  return (
    props.reference.attachment__filename ??
    props.reference.parent_reference__attachment__filename ??
    props.reference.filename ??
    null
  );
});
const url = computed(() => {
  return props.reference.url ?? props.reference.parent_reference__url ?? null;
});

const info = computed(() => {
  const infoList = [`${t("year")}: ${props.reference.year}`];
  if (props.reference.volume) {
    infoList.push(`${t("volume")}: ${props.reference.volume}`);
  }
  if (props.reference.pages) {
    infoList.push(`${t("pages")}: ${props.reference.pages}`);
  }
  if (props.reference.type) {
    infoList.push(
      `${$translate({
        et: props.reference.reference_type,
        en: props.reference.reference_type_en,
      })}`,
    );
  }
  return infoList.join(" | ");
});

const searchStore = useSearchStore();
function handleDetailNavigation() {
  if (props.position < 0) return;
  searchStore.selectedPosition = props.position;
}
</script>

<i18n lang="yaml">
et:
  year: "Aasta"
  volume: "Köide"
  pages: "Leheküljed"
  abstract: "Abstrakt"
en:
  year: "Year"
  volume: "Volume"
  pages: "Pages"
  abstract: "Abstract"
</i18n>
