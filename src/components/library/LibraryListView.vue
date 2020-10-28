<template>
  <div v-if="data.length > 0">
    <v-card-text class="py-0" v-for="(entity, index) in data" :key="entity.id">
      <v-divider v-if="index !== 0" />
      <library-citation class="py-3 px-3" :library="entity" short />
    </v-card-text>
  </div>
</template>

<script>
import LibraryCitation from "@/components/library/LibraryCitation";
export default {
  name: "LibraryListView",
  components: { LibraryCitation },
  props: {
    data: {
      type: Array
    }
  }
};
</script>

<style scoped></style>
