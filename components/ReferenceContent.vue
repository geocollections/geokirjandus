<template>
  <table>
    <tbody>
      <tr
        class="border-t first:border-none dark:border-t-gray-700"
        v-for="content in orderedContent"
      >
        <td
          class="whitespace-nowrap pr-2 text-end align-top italic text-gray-600 dark:text-gray-400"
        >
          {{ content.pages }}
        </td>
        <td class="px-2 align-top">
          <NuxtLinkLocale :to="`/reference/${content.id}`">
            {{ content.title }}
          </NuxtLinkLocale>
        </td>
        <td class="pl-2 align-top">
          {{ content.author }}
        </td>
        <td class="py-1 pl-2 align-top">
          <UButton
            v-if="content.pdf"
            variant="soft"
            size="xs"
            color="red"
            icon="i-heroicons-document"
            target="_blank"
            :to="`https://files.geocollections.info/${content.pdf}`"
          >
            PDF
          </UButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const props = defineProps<{ contentsUrl: string; count: number }>();

const { data: contents } = await useNewApiFetch<{
  results: {
    id: number;
    title: string | null;
    pages: string | null;
    author: string | null;
    pdf: string | null;
  }[];
  count: number;
}>(props.contentsUrl, {
  query: {
    fields: ["id", "title", "pages", "author", "pdf"],
    limit: props.count,
  },
});
const orderedContent = computed(() => {
  return (contents.value?.results ?? []).sort((a, b) => {
    if (a.pages === null && b.pages === null) return 0;
    if (a.pages === null) return -1;
    if (b.pages === null) return 1;
    const aStart = a.pages.includes("-")
      ? parseInt(a.pages.split("-")[0].trim())
      : parseInt(a.pages);
    const bStart = b.pages.includes("-")
      ? parseInt(b.pages.split("-")[0].trim())
      : parseInt(b.pages);
    return aStart - bStart;
  });
});
</script>
