<template>
  <div v-if="data.length > 0">
    <v-card-text class="py-0" v-for="(entity, index) in data" :key="entity.id">
      <v-divider v-if="index !== 0" />
      <reference-item class="my-2" :reference="entity"></reference-item>
    </v-card-text>
  </div>
</template>

<script>
import ReferenceItem from "@/components/reference/ReferenceItem";
export default {
  components: { ReferenceItem },
  props: {
    data: {
      type: Array
    }
  },
  name: "ReferenceListView"
};
</script>
