<template>
  <table>
    <tbody>
      <tr class="border-t first:border-none" v-for="content in orderedContent">
        <td class="whitespace-nowrap pr-2 text-end italic text-gray-600">
          {{ content.pages }}
        </td>
        <td class="px-2">
          <NuxtLinkLocale :to="`/reference/${content.id}`">
            {{ content.title }}
          </NuxtLinkLocale>
        </td>
        <td class="pl-2">
          {{ content.author }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
const props = defineProps<{ contentsUrl: string; count: number }>();

const { data: contents } = await useNewApiFetch(props.contentsUrl, {
  query: {
    fields: ["id", "title", "pages", "author"],
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
