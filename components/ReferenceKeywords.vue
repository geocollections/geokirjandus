<template>
  <div class="space-x-1">
    <UButton
      size="2xs"
      variant="outline"
      :to="getKeywordSearchRoute(keyword.name)"
      v-for="keyword in keywords?.results"
    >
      {{ keyword.name }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ keywordsUrl: string }>();

const { data: keywords } = await useNewApiFetch(props.keywordsUrl);

function getKeywordSearchRoute(keyword: string) {
  return { path: "/reference", query: { keywords: keyword } };
}
</script>
