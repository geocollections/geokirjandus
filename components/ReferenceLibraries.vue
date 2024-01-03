<template>
  <div class="space-x-1">
    <UButton
      :to="localePath(`/library/${referenceLibrary.library.id}`)"
      size="2xs"
      color="blue"
      variant="outline"
      v-for="referenceLibrary in referenceLibraries?.results"
    >
      {{
        $translate({
          et: referenceLibrary.library.title,
          en: referenceLibrary.library.title_en,
        })
      }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ referenceLibrariesUrl: string }>();
const localePath = useLocalePath();

const { data: referenceLibraries } = await useNewApiFetch<{
  results: { library: { id: number; title: string; title_en: string } }[];
}>(props.referenceLibrariesUrl, {
  query: {
    expand: "library",
    fields: ["library.id", "library.title", "library.title_en"],
  },
});
</script>
