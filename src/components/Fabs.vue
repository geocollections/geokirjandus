<template>
  <div class="fabs">
    <v-layout column class="fabContainer ma-3 d-none d-md-block">
      <scroll-to-top class="d-print-none" />
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
  z-index: 1500;
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
