<template>
  <div>
    <div v-show="isLoading">
      <v-progress-linear
        indeterminate
        :color="$vuetify.theme.themes.light.accent"
        class="pa-0"
      />
    </div>
    <div v-if="data.length > 0">
      <v-card-text
        class="py-0"
        v-for="(entity, index) in data"
        :key="entity.id"
      >
        <v-divider v-if="index !== 0" />
        <library-citation class="py-3 px-3" :library="entity" short />
      </v-card-text>
    </div>
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
    },
    isLoading: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped></style>
