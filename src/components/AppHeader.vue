<template>
  <v-app-bar
      clipped-left
      app
      flat color="primary">
    <v-toolbar-title>
      <router-link
        :style="{ color: 'black' }"
        :to="{ path: '/' }"
        style="cursor:pointer"
      >
        {{ $t("title") }}
      </router-link>
    </v-toolbar-title>
    <v-spacer></v-spacer>
    <v-menu v-if="$vuetify.breakpoint.smAndUp" transition="slide-y-transition" offset-y bottom right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn text dark v-bind="attrs" v-on="on">
          {{$t("common.links")}}
        </v-btn>
      </template>
      <v-list>
        <div v-for="(link, idx) in links" :key="idx">
          <v-list-item :href="link.url" target="_blank">
            <v-list-item-title>{{ $t(link.name) }}</v-list-item-title>
          </v-list-item>
        </div>
      </v-list>
    </v-menu>
    <lang-buttons v-if="$vuetify.breakpoint.smAndUp" :is-dark="false" />
    <v-menu v-if="!$vuetify.breakpoint.smAndUp" transition="slide-y-transition" offset-y bottom right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon dark v-bind="attrs" v-on="on">
          <v-icon>fas fa-bars</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-menu transition="slide-y-transition" offset-y bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on">
              {{$t("common.links")}}
            </v-btn>
          </template>
          <v-list>
            <div v-for="(link, idx) in links" :key="idx">
              <v-list-item :href="link.url" target="_blank">
                <v-list-item-title>{{ $t(link.name) }}</v-list-item-title>
              </v-list-item>
            </div>
          </v-list>
        </v-menu>
        <div class="px-3">
          <lang-buttons/>
        </div>
      </v-list>
    </v-menu>

  </v-app-bar>
</template>

<script>
import LangButtons from "@/components/LangButtons";
export default {
  name: "AppHeader",
  data() {
    return {
      links: [
        { name: "link.geocollections", url: "https://geocollections.info" },
        { name: "link.fossiilid", url: "https://fossiilid.info" },
        { name: "link.kivid", url: "https://kivid.info" },
        { name: "link.sarvAPI", url: "https://api.geocollections.info" },
        { name: "link.sarvDOI", url: "https://doi.geocollections.info" },
        {
          name: "link.sarvEdit",
          url: "https://edit2.geocollections.info"
        },
        { name: "link.egt", url: "https://fond.egt.ee/fond" },
        { name: "link.natarc", url: "https://natarc.ut.ee" }
      ]
    };
  },
  components: { LangButtons }
};
</script>

<style scoped></style>
