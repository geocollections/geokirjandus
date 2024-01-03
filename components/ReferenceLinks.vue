<template>
  <UButton
    v-if="doi"
    :variant="variant"
    :size="size"
    color="yellow"
    icon="i-simple-icons-doi"
    :to="`https://doi.org/${doi}`"
    target="_blank"
  >
    DOI
  </UButton>
  <UButton
    v-if="bookPdf"
    :variant="variant"
    :size="size"
    color="orange"
    icon="i-heroicons-book-open"
    target="_blank"
    :to="`https://files.geocollections.info/${bookPdf}`"
  >
    {{ t("bookPdf") }}
  </UButton>
  <UButton
    v-if="pdf"
    :variant="variant"
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
    :variant="variant"
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
    bookPdf?: string;
    size?: typeof appConfig.ui.button.size;
    variant?: typeof appConfig.ui.button.variant;
  }>(),
  { size: "xs", variant: "soft" },
);

const { t } = useI18n({ useScope: "local" });
</script>

<style scoped>
.link {
  display: inline-block;
  line-height: normal;
  text-decoration: none;
}
</style>

<i18n lang="yaml">
et:
  bookPdf: "Raamat PDF"
en:
  bookPdf: "Book PDF"
</i18n>
