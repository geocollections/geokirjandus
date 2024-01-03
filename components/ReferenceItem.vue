<template>
  <div class="space-y-1 py-2">
    <div>
      <NuxtLinkLocale
        :to="`/reference/${reference.id}`"
        class="text-black visited:text-purple-600 hover:underline dark:text-white dark:visited:text-purple-400"
        @click="handleLinkClick"
      >
        <span class="font-semibold">
          {{ reference.author }}
        </span>
        <span v-if="reference.year">&nbsp;{{ reference.year }}.</span>
        {{ reference.title ? reference.title : reference.reference }}.
        <span v-if="reference.book" class="italic">
          {{ reference.book }}.
        </span>
        <span v-if="reference.publisher">{{ reference.publisher }}</span>
        <span v-if="reference.publisher_place">{{
          reference.publisher_place
        }}</span>
        <span v-if="reference.journal_name" class="italic">
          {{ reference.journal_name }}.
        </span>

        <span v-if="reference.volume"> {{ reference.volume }}, </span>
        <span v-if="reference.number"> {{ reference.number }}, </span>
        <span v-if="reference.pages && reference.journal_name">
          {{ reference.pages }}.
        </span>
        <span v-else-if="reference.pages"> pp. {{ reference.pages }}. </span>
        <span v-if="reference.doi"> {{ reference.doi }}. </span>
      </NuxtLinkLocale>
    </div>
    <div class="flex items-center space-x-1">
      <ReferenceLinks
        :doi="reference.doi_url"
        :pdf="pdf"
        :url="url"
        :book-pdf="bookPdf"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ reference: any }>();

const pdf = computed(() => {
  return (
    props.reference.attachment__filename ??
    props.reference.filename ??
    undefined
  );
});
const bookPdf = computed(() => {
  return props.reference.parent_reference__attachment__filename ?? undefined;
});
const url = computed(() => {
  return props.reference.url ?? props.reference.parent_reference__url ?? null;
});

const referencesStore = useReferencesStore();

function handleLinkClick() {
  referencesStore.searchPosition = -1;
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
