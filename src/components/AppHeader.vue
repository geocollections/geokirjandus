<template>
  <v-app-bar
    clipped-left
    app
    flat
    class="appBar"
    src="https://geoloogia.info/img/books1.jpg"
  >
    <v-btn
      aria-label="show search"
      v-if="$vuetify.breakpoint.mdAndUp"
      @click="$emit('update:showSearch')"
      icon
      dark
    >
      <v-icon class="search">fas fa-search</v-icon>
    </v-btn>
    <v-toolbar-title>
      <a class="title" @click="home">
        {{ $t("title") }}
      </a>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <links v-if="$vuetify.breakpoint.smAndUp" />
    <lang-buttons v-if="$vuetify.breakpoint.smAndUp" :is-dark="false" />
    <!--  MOBILE MENU  -->
    <v-menu
      v-if="!$vuetify.breakpoint.smAndUp"
      transition="slide-y-transition"
      offset-y
      bottom
      right
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon dark v-bind="attrs" v-on="on">
          <v-icon>fas fa-bars</v-icon>
        </v-btn>
      </template>
      <v-list color="#F6EDDF">
        <div class="pb-2">
          <links :isDark="false" />
        </div>
        <div class="px-3">
          <lang-buttons />
        </div>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<script>
import LangButtons from "@/components/LangButtons";
import Links from "@/components/Links";
export default {
  name: "AppHeader",
  components: { Links, LangButtons },
  methods: {
    home() {
      this.$emit("home");
      this.$router
        .replace({ name: "landing", params: this.$route.params })
        .catch(() => {});
    }
  }
};
</script>

<style scoped lang="sass">
@import 'src/sass/variables.sass'

.appBar
  background-color: $primary-color !important
  border-color: $primary-color

.title
  color: whitesmoke !important
  cursor: pointer

.search
  color: whitesmoke !important
</style>
