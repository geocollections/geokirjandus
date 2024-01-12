<template>
  <div class="container px-2">
    <div class="grid grid-cols-12 gap-x-4">
      <div
        class="hidden space-y-2 overflow-y-auto py-4 lg:sticky lg:top-[57px] lg:col-span-3 lg:block lg:max-h-[calc(100vh-57px)] lg:px-4 lg:py-8"
      >
        <slot name="filters" />
      </div>
      <div class="col-span-full py-4 lg:col-span-9 lg:py-8">
        <slot />
      </div>
    </div>
    <UButton
      class="fixed bottom-2 left-1/2 z-10 mx-auto -translate-x-1/2 rounded-full lg:hidden"
      size="lg"
      icon="i-heroicons-adjustments-horizontal"
      @click="openFilters = !openFilters"
    >
      <span>
        {{ t("filters") }}
      </span>
      <span v-if="filterCount > 0"> ({{ filterCount }}) </span>
    </UButton>
    <USlideover v-model="openFilters" side="left">
      <div class="space-y-2 overflow-y-auto p-2">
        <UButton
          variant="ghost"
          color="gray"
          trailing-icon="i-heroicons-x-mark"
          @click="openFilters = !openFilters"
        >
          {{ t("close") }}
        </UButton>
        <slot name="mobile-filters" />
      </div>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
defineProps<{ filterCount: number }>();

const { t } = useI18n();

const openFilters = ref(false);
</script>

<i18n lang="yaml">
et:
  filters: "Filtrid"
  close: "Sulge"
en:
  filters: "Filters"
  close: "Close"
</i18n>
