<template>
  <NuxtLayout>
    <div class="space-y-5 pt-10 text-center">
      <div>
        <div class="text-primary">Error 404</div>
        <h1 class="text-3xl">{{ t("error404") }}</h1>
      </div>
      <UButton
        trailing-icon="i-heroicons-arrow-right"
        size="lg"
        @click="handleError"
      >
        {{ t("backToLanding") }}
      </UButton>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
defineProps({
  error: Object,
});
const { t, locale } = useI18n({ useScope: "local" });

useHead({
  htmlAttrs: { lang: locale },
  bodyAttrs: { class: "bg-stone-50 dark:bg-gray-900" },
});
const localePath = useLocalePath();
function handleError() {
  clearError({ redirect: localePath("/") });
}
</script>

<i18n lang="yaml">
et:
  error404: "Lehekülge ei leitud"
  backToLanding: "Tagasi avalehele"
en:
  error404: "Page not found"
  backToLanding: "Back to landing"
</i18n>
