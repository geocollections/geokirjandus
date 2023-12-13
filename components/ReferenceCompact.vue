<template>
  <div class="flex items-start space-x-2 py-1 lg:space-x-4">
    <ClientOnly>
      <UCheckbox
        class="mt-0.5 hidden lg:block"
        :model-value="selected"
        color="blue"
        @input="handleSelection"
      />
    </ClientOnly>
    <div class="w-full space-x-1">
      <NuxtLinkLocale
        :to="`/reference/${reference.id}`"
        class="space-x-1 visited:text-purple-600 hover:underline dark:visited:text-purple-400"
        @click.native="handleDetailNavigation"
      >
        <span class="text-sm italic text-black dark:text-white">{{
          reference.author
        }}</span>
        <span class="text-sm italic text-black dark:text-white"
          >({{ reference.year_numeric }})</span
        >
        {{ reference.title ? reference.title : reference.reference }}
      </NuxtLinkLocale>
      <span class="inline-flex w-min items-center space-x-1">
        <CitePopover :id="reference.id" size="2xs" />
        <ReferenceLinks
          :doi="reference.doi_url"
          :pdf="pdf"
          :url="url"
          size="2xs"
        />
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ReferenceDoc } from "~/pages/reference/index.vue";

const emit = defineEmits<{ "update:selected": [] }>();
const props = defineProps<{
  reference: ReferenceDoc;
  position?: number;
}>();

const route = useRoute();
const referencesStore = useReferencesStore();

const pdf = computed(() => {
  return (
    props.reference.attachment__filename ??
    props.reference.parent_reference__attachment__filename ??
    props.reference.filename ??
    undefined
  );
});
const url = computed(() => {
  return (
    props.reference.url ?? props.reference.parent_reference__url ?? undefined
  );
});

function handleDetailNavigation() {
  if (!props.position || props.position < 0) return;
  referencesStore.searchPosition = props.position;
  referencesStore.enteredFrom = route.path;
}

const selected = computed(() => {
  return referencesStore.selection.includes(props.reference.id);
});

function handleSelection() {
  const index = referencesStore.selection.findIndex(
    (id) => id === props.reference.id,
  );
  if (index === -1) referencesStore.selection.push(props.reference.id);
  else
    referencesStore.selection = referencesStore.selection.toSpliced(index, 1);
}
</script>
