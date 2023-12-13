<template>
  <UButton
    v-if="doi"
    variant="soft"
    :size="size"
    color="yellow"
    icon="i-simple-icons-doi"
    :to="`https://doi.org/${doi}`"
    target="_blank"
  >
    DOI
  </UButton>
  <UButton
    v-if="pdf"
    variant="soft"
    :size="size"
    color="red"
    icon="i-heroicons-document"
    target="_blank"
    :to="`https://files.geocollections.info/${pdf}`"
  >
    PDF
  </UButton>
  <UButton
    v-if="url"
    variant="soft"
    :size="size"
    color="blue"
    icon="i-heroicons-arrow-top-right-on-square"
    target="_blank"
    :to="url"
  >
    URL
  </UButton>
</template>

<script setup lang="ts">
// @ts-expect-error
import appConfig from "#build/app.config";
withDefaults(
  defineProps<{
    doi?: string;
    pdf?: string;
    url?: string;
    size?: typeof appConfig.ui.button.size;
  }>(),
  { size: "xs" },
);
</script>

<style scoped>
.link {
  display: inline-block;
  line-height: normal;
  text-decoration: none;
}
</style>
