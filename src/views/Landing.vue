<template>
  <div class="fill-height d-flex flex-wrap align-content-space-between">
    <v-container fluid class="landing py-0">
      <v-row class="header d-flex flex-column pb-5">
        <span class="d-flex justify-end mt-4 mb-2 mr-4">
          <links />
          <lang-buttons />
        </span>

        <h1 class="white--text text-center">{{ $t("title") }}</h1>
        <span
          class="text-center d-md-flex flex-md-row align-self-center align-center col-12 col-md-4 mt-6"
        >
          <v-text-field
            v-model="searchStr"
            :autofocus="true"
            @keyup.native="search"
            hide-details
            :label="$t('common.search')"
            solo
          >
            <template v-slot:prepend-inner>
              <v-icon small class="px-2">fas fa-search</v-icon>
            </template>
          </v-text-field>
          <!--          <v-btn-->
          <!--            dark-->
          <!--            class="mr-3"-->
          <!--            color="#ECA15B"-->
          <!--            :to="{ name: 'searchReference' }"-->
          <!--            >{{ $t("common.viewReferences") }}</v-btn-->
          <!--          >-->
          <v-btn
            class="ma-3 align-center"
            color="#ECA15B"
            dark
            @click="search"
            >{{ $t("common.viewReferences") }}</v-btn
          >
        </span>
      </v-row>
      <v-row
        class="d-flex flex-column align-center justify-center"
        style="background-color: #F6EDDF"
      >
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title v-if="intro" style="background-color: #F6EDDF">
              <h6>{{ getIntroTitle }}</h6>
            </v-card-title>
            <v-card-text class="py-3" v-if="intro" v-html="getIntroText">
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title style="background-color: #F6EDDF">
              <h6>{{ $t("common.newest") }}</h6>
            </v-card-title>

            <v-expand-transition>
              <reference-list-view
                class="pb-3"
                v-if="references"
                :data="references"
              ></reference-list-view>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <app-footer />
  </div>
</template>

<script>
import LangButtons from "@/components/LangButtons";
import Links from "@/components/Links";
import { fetchReferences } from "@/utils/apiCalls";
import ReferenceListView from "@/components/reference/ReferenceListView";
import AppFooter from "@/components/AppFooter";
import axios from "axios";
import { mapActions } from "vuex";

export default {
  name: "Landing",
  components: { AppFooter, Links, LangButtons, ReferenceListView },
  data() {
    return {
      searchStr: "",
      references: null,
      intro: null
    };
  },
  created() {
    this.getReferences();
    this.getIntroduction();
  },
  computed: {
    getIntroText() {
      if (this.$i18n.locale === "ee") {
        return this.intro.content_et;
      }
      return this.intro.content_en;
    },
    getIntroTitle() {
      if (this.$i18n.locale === "ee") {
        return this.intro.title_et;
      }
      return this.intro.title_en;
    }
  },
  methods: {
    ...mapActions("search", ["updateSearch"]),
    getIntroduction() {
      axios.get("https://api.geocollections.info/page/75").then(res => {
        this.intro = res.data.results[0];
      });
    },
    search(event) {
      if (
        event.type !== "click" &&
        event.keyCode !== 13 &&
        event.key !== "Enter"
      )
        return;

      this.updateSearch(this.searchStr);
      this.$router.push({
        name: "searchReference"
      });
    },
    getReferences() {
      return fetchReferences({
        search: { id: "search", value: this.searchStr },
        paginateBy: 10,
        page: 1,
        sortBy: ["date_changed"],
        sortDesc: [true],
        advancedSearch: {
          isEstonianAuthor: {
            type: "checkbox",
            value: "1",
            fields: ["is_estonian_author"]
          },
          isEstonianReference: {
            type: "checkbox",
            value: "1",
            fields: ["is_estonian_reference"]
          }
        }
      }).then(res => {
        this.references = res.results;
      });
    }
  }
};
</script>

<style scoped>
.header {
  background-size: cover;
  background-image: url("https://geoloogia.info/img/books1.jpg");
}
</style>
