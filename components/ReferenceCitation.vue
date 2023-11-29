<template>
  <div v-if="onlyText" v-html="reference.source" />
  <div class="space-x-1" v-else>
    <NuxtLinkLocale :to="`/reference/${reference.id}`">
      <span v-html="reference.source" />
    </NuxtLinkLocale>
    <ReferenceLinks :item="reference" x-small />
  </div>
</template>

<script setup lang="ts">
defineProps({
  reference: {
    type: Object,
    required: true,
  },
  onlyText: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.referenceLink {
  color: black;
  text-decoration: none;
}

.referenceLink:hover {
  text-decoration: underline;
}
</style>
