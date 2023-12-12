<template>
  <Head>
    <Meta name="description" :content="t('subtitle')" />
  </Head>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
const { locale, t } = useI18n();
useHead({
  htmlAttrs: { lang: locale },
  bodyAttrs: { class: "bg-stone-50 dark:bg-gray-900" },
});
</script>
