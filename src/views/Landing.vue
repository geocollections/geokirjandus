<template>
  <div class="fill-height d-flex flex-wrap align-content-space-between">
    <v-container fluid class="landing py-0">
      <v-row
        :style="
          `background-image: url(&quot;${require('@/assets/books1.jpg')}&quot;)`
        "
        class="header d-flex flex-column pb-5 "
      >
        <span class="d-flex justify-end mt-4 mb-2 mr-4">
          <links />
          <lang-buttons />
        </span>

        <h1 class="white--text text-center">{{ $t("title") }}</h1>
        <span
          class="text-center align-self-center col-12 col-sm-6 col-md-4 mt-6"
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
            color="primary"
            dark
            @click="search"
            >{{ $t("common.viewReferences") }}</v-btn
          >
        </span>
      </v-row>
      <v-row class="d-flex flex-column align-center justify-center main">
        <v-col cols="12" sm="11" lg="10">
          <v-card class="cardTitle">
            <!--            <v-card-title class="cardTitle">-->
            <!--              <h6>{{ $t("common.statistics") }}</h6>-->
            <!--            </v-card-title>-->
            <div class="px-3 py-3">
              <statistics
                style="border-radius: 12px; background-color: white"
              />
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row class="d-flex justify-center main">
        <v-col cols="12" sm="11" md="5" lg="4">
          <v-card class="cardTitle">
            <v-card-title v-if="intro" class="cardTitle">
              <h6>{{ getIntroTitle }}</h6>
            </v-card-title>
            <div class="px-3 pb-3">
              <v-card-text
                style="border-radius: 12px; background-color: white"
                class="py-3"
                v-if="intro"
                v-html="getIntroText"
              />
            </div>
          </v-card>
        </v-col>

        <v-col cols="12" sm="11" md="6">
          <v-card class="cardTitle">
            <v-card-title class="cardTitle">
              <h6>{{ $t("common.newest") }}</h6>
            </v-card-title>

            <v-expand-transition>
              <div class="px-3 pb-3">
                <reference-list-view
                  class="pb-3"
                  style="border-radius: 12px; background-color: white"
                  v-if="references"
                  :data="references"
                ></reference-list-view>
              </div>
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
import Statistics from "@/components/Statistics";
export default {
  name: "Landing",
  components: {
    Statistics,
    AppFooter,
    Links,
    LangButtons,
    ReferenceListView
  },
  data() {
    return {
      searchStr: "",
      references: null,
      intro: null,
      statisticsData: null
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
    ...mapActions("search", [
      "resetSearch",
      "updateSearch",
      "updateAdvancedSearch"
    ]),
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
.main {
  background-color: #f6eddf;
}
.cardTitle {
  background-color: #eedbbf;
}
.header {
  background-size: cover;
  /*background-image: url("https://geoloogia.info/img/books1.jpg");*/
}
</style>
