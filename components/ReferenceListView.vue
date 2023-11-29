<template>
  <div class="py-2">
    <div class="py-0" v-for="(entity, index) in data" :key="entity.id">
      <UDivider v-if="index !== 0" />
      <ReferenceCitation class="py-3 px-3" :reference="entity" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  data: {
    type: Array,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>
