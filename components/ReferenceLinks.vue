<template>
  <UButton
    v-if="doi"
    variant="soft"
    color="yellow"
    icon="i-simple-icons-doi"
    :to="`https://doi.org/${doi}`"
    target="_blank"
  >
    DOI
  </UButton>
  <UButton
    v-if="pdf"
    variant="soft"
    color="red"
    icon="i-heroicons-document"
    target="_blank"
    :to="`https://files.geocollections.info/${pdf}`"
  >
    PDF
  </UButton>
  <UButton
    v-if="url"
    variant="soft"
    color="blue"
    icon="i-heroicons-arrow-top-right-on-square"
    target="_blank"
    :to="url"
  >
    URL
  </UButton>
</template>

<script setup lang="ts">
defineProps<{ doi?: string; pdf?: string; url?: string }>();
</script>

<style scoped>
.link {
  display: inline-block;
  line-height: normal;
  text-decoration: none;
}
</style>
