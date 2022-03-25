<template>
  <div>
    <div v-show="isLoading">
      <v-progress-linear indeterminate color="#135ebf" class="pa-0" />
    </div>
    <div v-if="data.length > 0" class="py-2">
      <v-card-text
        class="py-0"
        v-for="(entity, index) in data"
        :key="entity.id"
      >
        <v-divider v-if="index !== 0" />
        <reference-citation class="py-3 px-3" :reference="entity" />
      </v-card-text>
    </div>
  </div>
</template>

<script>
import ReferenceCitation from "@/components/reference/ReferenceCitation";
export default {
  name: "ReferenceListView",
  components: { ReferenceCitation },
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
