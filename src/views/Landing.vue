
<template>
  <div class="main fill-height d-flex flex-wrap align-content-space-between">
    <v-container fluid class="landing py-0">
      <v-row
        :style="
          `
          background-image: linear-gradient(to top, rgba(229, 129, 36, 0.4), rgba(0, 0, 0, 0.40)),url('${require('@/assets/books4.jpg')}');
          `
        "
        class="header"
      >
        <v-col class="elevation-4 header d-flex flex-column pt-0 pb-5">
          <span class="d-flex mt-4 mb-2 mr-4">
            <emaapou-button class="mr-auto" />
            <links />
            <lang-buttons />
          </span>

          <h1 class="mt-2 white--text text-center title">
            {{ $t("title") }}
          </h1>
          <span
            class="text-center align-self-center col-12 col-sm-6 col-md-3 mt-6"
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
            <v-btn
              class="mt-3 align-center"
              color="#1C9BDE"
              dark
              large
              @click="search"
              >{{ $t("common.viewReferences") }}</v-btn
            >
          </span>
        </v-col>
      </v-row>
      <v-row class="d-flex flex-column align-center justify-center main">
        <v-col cols="12" sm="11" lg="10">
          <statistics class="roundedBorder" />
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center main">
        <v-col cols="12" sm="11" md="5" lg="4">
          <v-fade-transition>
            <v-card v-if="intro" class="cardTitle roundedBorder">
              <v-card-title class="cardTitle">
                <h6 v-translate="{ et: intro.title_et, en: intro.title_en }" />
              </v-card-title>
              <div class="px-1 pb-1 px-sm-2 pb-sm-2">
                <v-card-text
                  style="background-color: white"
                  class="py-3 roundedBorder"
                  v-translate="{ et: intro.content_et, en: intro.content_en }"
                />
              </div>
            </v-card>
          </v-fade-transition>
        </v-col>

        <v-col cols="12" sm="11" md="6">
          <v-fade-transition>
            <v-card v-if="references" class="cardTitle roundedBorder">
              <v-card-title class="cardTitle">
                <h6>{{ $t("common.newest") }}</h6>
              </v-card-title>

              <v-expand-transition>
                <div class="px-1 pb-1 px-sm-2 pb-sm-2">
                  <reference-list-view
                    class="pb-3 roundedBorder"
                    style=" background-color: white"
                    :data="references"
                  ></reference-list-view>
                </div>
              </v-expand-transition>
            </v-card>
          </v-fade-transition>
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
import Statistics from "@/components/Statistics";
import EmaapouButton from "../components/EmaapouButton.vue";
export default {
  name: "Landing",
  components: {
    Statistics,
    AppFooter,
    Links,
    LangButtons,
    ReferenceListView,
    EmaapouButton,
  },
  data() {
    return {
      searchStr: "",
      references: null,
      intro: null,
      statisticsData: null,
    };
  },
  metaInfo: {
    title: "Avaleht",
  },
  created() {
    this.getReferences();
    this.getIntroduction();
  },
  methods: {
    ...mapActions("search", [
      "resetSearch",
      "updateSearch",
      "updateAdvancedSearch",
    ]),
    getIntroduction() {
      axios.get("https://api.geocollections.info/page/75").then((res) => {
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
      this.resetSearch();
      this.updateSearch(this.searchStr);
      this.$router.push({
        name: "searchReference",
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
            fields: ["is_estonian_author"],
          },
          isEstonianReference: {
            type: "checkbox",
            value: "1",
            fields: ["is_estonian_reference"],
          },
        },
      }).then((res) => {
        this.references = res.results;
      });
    },
  },
};
</script>

<style scoped>
.main {
  background-color: #f6eddf;
}
.cardTitle {
  background-color: #f3d3a5;
}

.roundedBorder {
  border-radius: 12px;
}

.header {
  background-size: cover;
  -webkit-background-size: cover;
  /*background-image: url("https://geoloogia.info/img/books1.jpg");*/
}

.title {
  font-size: 2.25rem !important;
  text-shadow: 2px 2px 10px black;
}
</style>
