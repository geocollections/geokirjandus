<template>
  <div>
    <div
      class=" spacer layer1"
      :style="{ height: $vuetify.breakpoint.lgAndUp ? '400px' : '400px' }"
    >
      <v-container class="landing pt-0 pa-0">
        <v-row
          no-gutters
          :style="{
            height: $vuetify.breakpoint.lgAndUp ? '400px' : '400px',
            'padding-top': $vuetify.breakpoint.smAndUp ? '48px' : '96px'
          }"
        >
          <v-col cols="12" class="header d-flex flex-column pt-sm-10">
            <v-card flat tile color="transparent">
              <v-card-title
                class="pb-0 text-h4 text-sm-h3 white--text text-center justify-center font-weight-medium "
                style="word-break: normal"
              >
                {{ $t("subtitle") }}
              </v-card-title>
              <v-card-actions class="text-center d-flex justify-center mt-6">
                <v-text-field
                  v-model="searchStr"
                  @keyup.native="search"
                  hide-details
                  :label="$t('common.search')"
                  solo
                  style="max-width: 300px"
                >
                </v-text-field>
                <v-btn
                  class="ml-2 pr-4"
                  height="48px"
                  :color="$vuetify.theme.themes.light.accent"
                  dark
                  large
                  @click="search"
                >
                  <v-icon small class="px-2" left>fas fa-search</v-icon>
                  <div class="font-family-exo-2">
                    {{ $t("common.search") }}
                  </div>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container class="my-5">
      <v-row justify="center" class="main">
        <v-col>
          <statistics class="roundedBorder" />
        </v-col>
      </v-row>
    </v-container>

    <v-container>
      <v-row>
        <v-col cols="12" md="6" lg="5" xl="4">
          <v-fade-transition>
            <div>
              <div class="text-center text-h4 mb-3">
                {{ $t("common.about") }}
              </div>
              <v-card v-if="intro" flat outlined>
                <div class="px-1 py-1 px-sm-2 py-sm-2">
                  <v-card-text
                    style="background-color: white"
                    class="py-3 roundedBorder"
                    v-translate="{
                      et: intro.content_et,
                      en: intro.content_en
                    }"
                  />
                </div>
              </v-card>
            </div>
          </v-fade-transition>
        </v-col>

        <v-col cols="12" md="6" lg="7" xl="8">
          <v-fade-transition>
            <div>
              <div class="text-center text-h4 mb-3">
                {{ $t("common.newest") }}
              </div>

              <v-card v-if="references" flat outlined>
                <v-expand-transition>
                  <div class="px-1 py-1 px-sm-2 py-sm-2">
                    <reference-list-view
                      class="pb-3 roundedBorder"
                      style=" background-color: white"
                      :is-loading="false"
                      :data="references"
                    ></reference-list-view>
                  </div>
                </v-expand-transition>
              </v-card>
            </div>
          </v-fade-transition>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { fetchReferences } from "@/utils/apiCalls";
import ReferenceListView from "@/components/reference/ReferenceListView";
import axios from "axios";
import { mapActions } from "vuex";
import Statistics from "@/components/Statistics";
export default {
  name: "Landing",
  components: {
    Statistics,
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
  metaInfo: {
    title: "Avaleht"
  },
  created() {
    this.getReferences();
    this.getIntroduction();
  },
  methods: {
    ...mapActions("search/reference", [
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
      this.resetSearch();
      this.updateSearch(this.searchStr);
      let query = {};

      if (this.searchStr && this.searchStr.length > 0) {
        query.query = this.searchStr;
      }

      this.$router.push({
        name: "searchReference",
        query: query
      });
    },
    getReferences() {
      return fetchReferences({
        search: { id: "search", value: this.searchStr },
        itemsPerPage: 10,
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
.spacer {
  aspect-ratio: 1920/570;
  width: 100%;
  background-repeat: no-repeat;
  background-position: bottom, center, top;
  background-size: cover, cover, cover;
}
.layer1 {
  background-image: url("../assets/layered-steps-haikei (5).svg"),
    linear-gradient(to right, #00000033, #00000033), url("../assets/books4.jpg");
}

.main {
  background-color: var(--v-primary-base);
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
