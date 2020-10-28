<template>
  <div v-if="data.length > 0" class="d-none d-print-block">
    <v-card-text class="py-0" v-for="(entity, index) in data" :key="entity.id">
      <v-divider v-if="index !== 0" />
      <reference-citation
        class="py-3 px-3"
        :reference="entity"
      ></reference-citation>
    </v-card-text>
  </div>
</template>

<script>
import ReferenceCitation from "@/components/reference/ReferenceCitation";
export default {
  name: "ReferenceListPrintView",
  components: { ReferenceCitation },
  props: {
    data: {
      type: Array
    }
  }
};
</script>

<style scoped></style>
