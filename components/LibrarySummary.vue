<template>
  <div class="space-y-2 py-2">
    <div>
      <NuxtLinkLocale
        :to="`/library/${library.id}`"
        class="visited:text-purple-600 hover:underline dark:visited:text-purple-400"
      >
        {{ library.title }}
      </NuxtLinkLocale>
      <div class="text-sm">{{ library.author }}</div>
      <div class="text-sm">{{ info }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ library: any; position: number }>();
const { t } = useI18n({ useScope: "local" });

const info = computed(() => {
  const infoList = [];
  if (props.library.year) {
    infoList.push(`${t("year")}: ${props.library.year}`);
  }
  if (props.library.count_references) {
    infoList.push(
      `${t("references", {
        plural: props.library.count_references,
        count: props.library.count_references,
      })}`,
    );
  }
  return infoList.join(" | ");
});
</script>

<i18n lang="yaml">
et:
  year: "Aasta"
  references: "Sisaldab {count} kirjet"
en:
  year: "Year"
  references: "Contains {count} reference | Contains {count} references"
</i18n>
