<template>
  <div class="flex items-start space-x-2 py-2 lg:space-x-4">
    <UCheckbox
      class="hidden lg:block"
      :model-value="selected"
      color="blue"
      @input="emit('update:selected')"
    />
    <div class="space-y-2">
      <div>
        <NuxtLinkLocale
          :to="`/reference/${reference.id}`"
          class="text-lg visited:text-purple-600 hover:underline"
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
          {{ t("abstract") }}
        </UButton>
        <CitePopover :id="reference.id" />
        <ReferenceLinks :doi="reference.doi_url" :pdf="pdf" :url="url" />
      </div>
      <div v-if="showAbstract">
        <div
          class="rounded bg-gray-100 p-4 text-justify"
          v-html="reference.abstract"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits<{ "update:selected" }>();
const props = defineProps<{
  reference: any;
  selected: boolean;
  position?: number;
}>();
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
  const infoList = [];

  if (props.reference.year_numeric) {
    infoList.push(`${t("year")}: ${props.reference.year_numeric}`);
  }
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
  if (!props.position || props.position < 0) return;
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
