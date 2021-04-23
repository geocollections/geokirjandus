<template>
  <v-tabs
    :vertical="$vuetify.breakpoint.xsOnly"
    grow
    background-color="#F6EDDF"
    color="grey darken-3"
    slider-size="0"
    ref="tabs"
  >
    <v-tab
      active-class="active"
      :ripple="false"
      link
      :to="{ name: 'searchReference' }"
      >{{ referenceTabTitle }}</v-tab
    >
    <v-tab
      active-class="activeLibrary"
      :ripple="false"
      link
      :to="{ name: 'searchLibrary' }"
      >{{ libraryTabTitle }}</v-tab
    >
  </v-tabs>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Tabs",
  computed: {
    ...mapState({
      referenceCount: (state) => state.references.count,
      libraryCount: (state) => state.library.count,
    }),
    referenceTabTitle() {
      return `${this.$t("tabs.references")} (${this.referenceCount})`;
    },
    libraryTabTitle() {
      return `${this.$t("tabs.libraries")} (${this.libraryCount})`;
    },
  },
  watch: {
    referenceTabTitle: {
      handler() {
        this.$refs.tabs.callSlider();
      },
    },
    libraryTabTitle: {
      handler() {
        this.$refs.tabs.callSlider();
      },
    },
  },
};
</script>

<style scoped>
.active {
  background-color: #ecc285;
  border-radius: 12px 12px 0 0;
  font-size: 15px;
  color: black;
}
.activeLibrary {
  background-color: #95a8b1;
  border-radius: 12px 12px 0 0;
  font-size: 15px;
  color: black;
}

.v-tab:hover::before {
  border-radius: 12px 12px 0 0;
}
.v-tab:focus::before {
  border-radius: 12px 12px 0 0;
}

@media (max-width: 600px) {
  .active {
    background-color: #ecc285;
    border-radius: 12px 12px 0 0;
  }

  .activeLibrary {
    background-color: #95a8b1;
    border-radius: 0 12px 0 0;
  }

  .active:hover::before {
    border-radius: 12px 12px 0 0;
  }
  .active:focus::before {
    border-radius: 12px 12px 0 0;
  }

  .activeLibrary:hover::before {
    border-radius: 0 12px 0 0;
  }
  .activeLibrary:focus::before {
    border-radius: 0 12px 0 0;
  }
}
</style>
