<template>
  <div class="space-y-1 py-2">
    <div>
      <NuxtLinkLocale
        :to="`/reference/${reference.id}`"
        class="visited:text-purple-600 hover:underline dark:visited:text-purple-400"
        @click="handleLinkClick"
      >
        <div class="text-sm text-black dark:text-white">
          {{ reference.author }}
        </div>
        {{ reference.title ? reference.title : reference.reference }}
        <div class="text-sm text-black dark:text-white">
          {{ reference.journal_name }}
        </div>
        <div class="text-sm text-black dark:text-white">
          {{ reference.book }}
        </div>
      </NuxtLinkLocale>
    </div>
    <div class="flex items-center space-x-1">
      <ReferenceLinks :doi="reference.doi_url" :pdf="pdf" :url="url" />
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ reference: any }>();

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
