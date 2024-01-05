<template>
  <i18n-t
    keypath="title"
    :tag="tag"
    class="font-serif font-semibold text-carrot-orange-500 dark:text-carrot-orange-400"
    style="word-break: normal"
  >
    <template #literature>
      <span class="font-normal text-black dark:text-white">{{
        t("literature")
      }}</span>
    </template>
  </i18n-t>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ tag?: string }>(), { tag: "span" });
const { t } = useI18n({ useScope: "local" });
</script>

<i18n lang="yaml">
et:
  title: "GEO{literature}"
  literature: "kirjandus"
en:
  title: "GEO{literature}"
  literature: "literature"
</i18n>
