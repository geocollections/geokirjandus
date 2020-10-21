<template>
  <DynamicScroller
    v-if="data.length > 0"
    style="height: 68vh"
    class="scroller"
    :min-item-size="100"
    :items="data"
    key-field="id"
    v-slot="{ item, index, active }"
  >
    <DynamicScrollerItem
      :item="item"
      :active="active"
      :size-dependencies="[item.title]"
      :index="index"
      class="v-card__text py-0"
    >
      <v-divider v-if="index !== 0" />
      <reference-item class="my-2" :reference="item" />
    </DynamicScrollerItem>
  </DynamicScroller>
</template>

<script>
import ReferenceItem from "@/components/reference/ReferenceItem";
import { DynamicScroller, DynamicScrollerItem } from "vue-virtual-scroller";
import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
export default {
  name: "ReferenceListView",
  components: { ReferenceItem, DynamicScroller, DynamicScrollerItem },
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
