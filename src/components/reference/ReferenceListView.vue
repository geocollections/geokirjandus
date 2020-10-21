<template>
  <div v-if="data.length > 0">
    <v-card-text class="py-0" v-for="(entity, index) in data" :key="entity.id">
      <v-divider v-if="index !== 0" />
      <reference-item class="my-2" :reference="entity" />
    </v-card-text>
  </div>
</template>

<script>
import ReferenceItem from "@/components/reference/ReferenceItem";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
export default {
  name: "ReferenceListView",
  components: { ReferenceItem },
  props: {
    data: {
      type: Array
    }
  }
};
</script>
<style scoped>
.scroller {
  height: 100%;
}

.user {
  height: 32%;
  padding: 0 12px;
  display: flex;
  align-items: center;
}
</style>
