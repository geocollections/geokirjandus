<template>
  <v-fab-transition>
    <v-btn
      v-scroll="onScroll"
      v-show="showFab"
      fab
      color="#fd8719"
      dark
      @click="toTop"
    >
      <v-icon large small>fas fa-chevron-up</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  name: "ScrollToTop",
  data: () => ({
    showFab: false
  }),
  methods: {
    onScroll(event) {
      if (typeof window === "undefined") return;
      const top = window.pageYOffset || event.target.scrollTop || 0;

      this.showFab = top > 400;
    },

    toTop() {
      this.$vuetify.goTo(0);
    }
  }
};
</script>

<style scoped></style>
