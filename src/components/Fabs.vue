<template>
  <div class="fabs">
    <v-layout
      column
      v-show="!showSearch"
      class="fabContainer ma-3 d-md-none"
      style="z-index: 1500"
    >
      <ScrollToTop class="d-print-none" />
      <v-fab-transition>
        <v-btn
          class="mt-2 d-print-none d-md-none"
          color="blue"
          fab
          dark
          @click="$emit('update:showSearch')"
        >
          <v-icon large small>fas fa-search</v-icon>
        </v-btn>
      </v-fab-transition>
    </v-layout>
    <v-layout
      column
      class="fabContainer ma-3 d-none d-md-block"
      style="z-index: 1500"
    >
      <ScrollToTop class="d-print-none" />
    </v-layout>
  </div>
</template>

<script>
import ScrollToTop from "@/components/ScrollToTop";
export default {
  name: "Fabs",
  components: { ScrollToTop },
  props: {
    showSearch: {
      type: Boolean,
      required: true
    }
  }
};
</script>

<style scoped>

.fabContainer {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
