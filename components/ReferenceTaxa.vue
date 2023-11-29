<template>
  <ol class="col-span-1 list-inside list-disc marker:text-gray-500">
    <li v-for="taxon in taxa?.results ?? []">
      <NuxtLink :to="`https://fossiilid.info/${taxon.id}`" target="_blank">
        {{ taxon.name }}
      </NuxtLink>
    </li>
  </ol>
</template>

<script setup lang="ts">
const props = defineProps<{ url: string; count: number }>();
const { data: taxa } = await useNewApiFetch(props.url, {
  query: {
    fields: ["name", "id"],
    limit: props.count,
    ordering: ["taxon"],
  },
});
</script>
