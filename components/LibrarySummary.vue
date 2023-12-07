<template>
  <div class="space-y-2 py-2">
    <div>
      <NuxtLinkLocale
        :to="`/library/${library.id}`"
        class="text-xl hover:underline"
        @click.native="handleDetailNavigation"
      >
        {{ library.title }}
      </NuxtLinkLocale>
      <div>{{ library.author }}</div>
      <div>{{ info }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ library: any; position: number }>();
const { t } = useI18n({ useScope: "local" });

const route = useRoute();
const librariesStore = useLibrariesStore();
const referencesStore = useReferencesStore();

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

function handleDetailNavigation() {
  if (props.position < 0) return;
  librariesStore.searchPosition = props.position;
  referencesStore.enteredFrom = route.path;
}
</script>

<i18n lang="yaml">
et:
  year: "Aasta"
  references: "Sisaldab {count} kirjet"
en:
  year: "Year"
  references: "Contains {count} reference | Contains {count} references"
</i18n>
