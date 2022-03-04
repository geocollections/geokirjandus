<template>
  <v-container>
    <v-row justify="center">
      <v-col class="px-2 px-sm-3">
        <v-fade-transition :hide-on-leave="true">
          <v-card
            class="ml-auto mr-auto card roundedBorder referenceTitle px-1 pb-1 px-sm-2 pb-sm-2"
            v-if="reference"
          >
            <v-card-title
              class="pt-1 pb-1 px-0 d-flex text-center referenceTitle"
            >
              <v-col cols="auto" class="py-0 px-0">
                <v-btn large icon @click="handleBack()" aria-label="back">
                  <v-icon>fas fa-arrow-left</v-icon>
                </v-btn>
              </v-col>
              <div class="col titleText">
                {{ `${reference.reference}: ${reference.title}` }}
              </div>
              <v-col cols="auto" class="py-0 px-0 d-flex align-self-start">
                <v-btn @click="exit" class="exitButton" icon>
                  <v-icon>fas fa-times</v-icon>
                </v-btn>
              </v-col>
            </v-card-title>
            <div class="body">
              <v-card-actions class=" pt-3">
                <reference-links :item="reference" />
                <v-spacer />
                <v-chip
                  link
                  outlined
                  color="blue-grey darken-3"
                  class="d-print-none mr-1 my-1 link"
                  :href="
                    `https://edit.geocollections.info/reference/${reference.id}`
                  "
                  target="_blank"
                  rel="noopener"
                >
                  <v-icon small class="pr-1">fas fa-edit</v-icon>
                  <b>{{ $t("common.edit") }}</b>
                </v-chip>
              </v-card-actions>
              <v-card-text>
                <div class="d-flex align-center pb-3">
                  <h3 class=" mr-1">
                    <b>{{ $t("common.citation") }}</b>
                  </h3>
                  <citation-select id="citationSelect" class="col-sm-3 py-0" />
                </div>
                <base-citation-detail
                  :citation="citation($getCslDetail(reference))"
                />
              </v-card-text>
              <v-card-text class=" row ma-0">
                <div class="col-12 col-md pa-0">
                  <h3 class="pb-3">
                    <b>{{ $t("common.generalInfo") }}</b>
                  </h3>
                  <v-simple-table>
                    <template v-slot:default>
                      <tbody>
                        <tr v-if="reference.author">
                          <th>{{ $t("reference.author") }}</th>
                          <td>{{ reference.author }}</td>
                        </tr>
                        <tr v-if="reference.author_original">
                          <th>{{ $t("reference.authorOriginal") }}</th>
                          <td>{{ reference.author_original }}</td>
                        </tr>
                        <tr v-if="reference.year">
                          <th>{{ $t("reference.year") }}</th>
                          <td>{{ reference.year }}</td>
                        </tr>
                        <tr v-if="reference.title">
                          <th>{{ $t("reference.title") }}</th>
                          <td>{{ reference.title }}</td>
                        </tr>
                        <tr v-if="reference.title_translated">
                          <th>{{ $t("reference.titleTranslated") }}</th>
                          <td>{{ reference.title_translated }}</td>
                        </tr>
                        <tr v-if="reference.title_original">
                          <th>{{ $t("reference.titleOriginal") }}</th>
                          <td>{{ reference.title_original }}</td>
                        </tr>
                        <tr v-if="reference.book">
                          <th>{{ $t("reference.book") }}</th>
                          <td>{{ reference.book }}</td>
                        </tr>
                        <tr v-if="reference.book_translated">
                          <th>{{ $t("reference.bookTranslated") }}</th>
                          <td>{{ reference.book_translated }}</td>
                        </tr>
                        <tr v-if="reference.book_original">
                          <th>{{ $t("reference.bookOriginal") }}</th>
                          <td>{{ reference.book_original }}</td>
                        </tr>
                        <tr v-if="reference.book_editor">
                          <th>{{ $t("reference.bookEditor") }}</th>
                          <td>{{ reference.book_editor }}</td>
                        </tr>
                        <tr v-if="reference.publisher">
                          <th>{{ $t("reference.publisher") }}</th>
                          <td>{{ reference.publisher }}</td>
                        </tr>
                        <tr v-if="reference.publisher_place">
                          <th>{{ $t("reference.publisherPlace") }}</th>
                          <td>{{ reference.publisher_place }}</td>
                        </tr>
                        <tr v-if="journal && journal.journal_name">
                          <th>{{ $t("reference.journalName") }}</th>
                          <td>{{ journal.journal_name }}</td>
                        </tr>
                        <tr v-if="journal && journal.journal_short">
                          <th>{{ $t("reference.journalNameShort") }}</th>
                          <td>{{ journal.journal_short }}</td>
                        </tr>
                        <tr v-if="reference.parent_reference">
                          <th>{{ $t("reference.parentReference") }}</th>
                          <td>
                            <router-link
                              :to="{ path: `${reference.parent_reference.id}` }"
                            >
                              {{ reference.parent_reference.title }}
                            </router-link>
                          </td>
                        </tr>
                        <tr v-if="reference.volume">
                          <th>{{ $t("reference.volume") }}</th>
                          <td>{{ reference.volume }}</td>
                        </tr>
                        <tr v-if="reference.number">
                          <th>{{ $t("reference.number") }}</th>
                          <td>{{ reference.number }}</td>
                        </tr>
                        <tr v-if="reference.pages">
                          <th>{{ $t("reference.pages") }}</th>
                          <td>{{ reference.pages }}</td>
                        </tr>
                        <tr v-if="type">
                          <th>{{ $t("reference.type") }}</th>
                          <td
                            v-translate="{
                              et: reference.type.value,
                              en: reference.type.value_en
                            }"
                          />
                        </tr>
                        <tr v-if="reference.figures">
                          <th>{{ $t("reference.figures") }}</th>
                          <td>{{ reference.figures }}</td>
                        </tr>
                        <tr v-if="reference.language">
                          <th>{{ $t("reference.language") }}</th>
                          <td
                            v-translate="{
                              et: reference.language.value,
                              en: reference.language.value_en
                            }"
                          />
                        </tr>
                        <tr>
                          <th>{{ $t("reference.isOa") }}</th>
                          <td>
                            {{
                              reference.is_oa
                                ? $t("common.yes")
                                : $t("common.no")
                            }}
                          </td>
                        </tr>
                        <tr v-if="reference.doi">
                          <th>{{ $t("reference.doi") }}</th>
                          <td>
                            <a :href="reference.doi_url" target="_blank">{{
                              reference.doi
                            }}</a>
                          </td>
                        </tr>
                        <tr v-if="reference.url">
                          <th>{{ $t("reference.url") }}</th>
                          <td>
                            <a
                              :href="reference.url"
                              target="_blank"
                              style="word-break: break-all"
                              >{{ reference.url }}</a
                            >
                          </td>
                        </tr>
                        <tr v-if="reference.licence">
                          <th>{{ $t("reference.licence") }}</th>
                          <td>
                            <a
                              :href="reference.licence_url"
                              v-translate="{
                                et: reference.licence.licence,
                                en: reference.licence.licence_en
                              }"
                              target="_blank"
                            />
                          </td>
                        </tr>
                        <tr v-if="reference.is_estonian_reference">
                          <th>{{ $t("reference.isEstonianReference") }}</th>
                          <td>
                            {{ $t("common.yes") }}
                          </td>
                        </tr>

                        <tr v-if="reference.is_estonian_author">
                          <th>{{ $t("reference.isEstonianAuthor") }}</th>
                          <td>
                            {{ $t("common.yes") }}
                          </td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </div>
                <div
                  class="col-12 col-md-6 pa-0 px-md-4 pt-4 pt-md-0"
                  v-if="reference.abstract || localities.length > 0"
                >
                  <div class="pb-3" v-if="reference.abstract">
                    <h3 class="pb-3">
                      <b>{{ $t("reference.abstract") }}</b>
                    </h3>

                    <read-more
                      v-if="localities.length > 0"
                      :html-str="reference.abstract"
                    />
                    <div v-else v-html="reference.abstract" />
                  </div>
                  <div v-if="localityMarkers.length > 0">
                    <span class="d-flex">
                      <h3 class="pb-3">
                        <b>{{ $t("common.map") }}</b>
                      </h3>
                      <v-tooltip top>
                        <template v-slot:activator="{ on, attrs }">
                          <v-icon
                            class="px-1 align-self-start"
                            color="primary"
                            dark
                            x-small
                            v-bind="attrs"
                            v-on="on"
                            >fas fa-info</v-icon
                          >
                        </template>
                        <span>{{ $t("tooltip.map") }}</span>
                      </v-tooltip>
                    </span>
                    <leaflet-map :markers="localityMarkers" />
                  </div>
                </div>
              </v-card-text>
              <v-card-text v-if="reference.remarks">
                <h3 class="pb-3">
                  <b>{{ $t("reference.remarks") }}</b>
                </h3>
                <div v-html="reference.remarks"></div>
              </v-card-text>
              <v-card-text v-if="keywords">
                <h3 class="pb-3">
                  <b>{{ $t("reference.keywords") }}</b>
                </h3>

                <span v-for="(keyword, index) in keywords" :key="index">
                  <v-chip
                    outlined
                    color="#fd8719"
                    text-color="black"
                    class="mr-1 mb-1"
                    @click="handleKeyword(keyword.keyword.keyword)"
                  >
                    {{ keyword.keyword.keyword }}
                  </v-chip>
                </span>
              </v-card-text>
              <v-card-text v-if="childReferences.length > 0">
                <h3 class="pb-3">
                  <b>{{ $t("reference.contains") }}</b>
                </h3>
                <v-simple-table dense>
                  <tbody>
                    <tr
                      v-for="childReference in childReferences"
                      :key="childReference.id"
                    >
                      <td>
                        <router-link
                          :to="{
                            name: 'reference',
                            params: { id: childReference.id }
                          }"
                        >
                          {{ childReference.author }}
                        </router-link>
                      </td>
                      <td>{{ childReference.title }}</td>
                      <td>{{ childReference.pages }}</td>
                    </tr>
                  </tbody>
                </v-simple-table>
              </v-card-text>
              <v-card-text class="row ma-0">
                <div v-if="localities.length > 0" class="col-12 col-md-6 pa-0">
                  <h3 class="pb-3">
                    <b>{{ $t("reference.localities") }}</b>
                  </h3>

                  <ul>
                    <li
                      v-for="locality in localities"
                      :key="locality.locality.id"
                    >
                      <a
                        :href="localityURL(locality.locality.id)"
                        target="_blank"
                        v-translate="{
                          et: locality.locality.locality,
                          en: locality.locality.locality_en
                        }"
                      />
                    </li>
                  </ul>
                </div>
                <div
                  v-if="taxa.length > 0"
                  class="col-12 col-md-6 pa-0 pt-4 pt-md-0"
                >
                  <h3 class="pb-3">{{ $t("reference.describedTaxa") }}</h3>
                  <ul>
                    <li v-for="taxon in taxa" :key="taxon.id">
                      <a :href="taxonURL(taxon.id)" target="_blank">{{
                        taxon.taxon
                      }}</a>
                    </li>
                  </ul>
                </div>
              </v-card-text>
              <v-card-text v-if="libraries.length > 0">
                <h3 class="pb-3">
                  <b>{{ $t("reference.libraries") }}</b>
                </h3>
                <span
                  class="py-3"
                  v-for="(library, index) in libraries"
                  :key="index"
                >
                  <v-chip
                    outlined
                    color="#fd8719"
                    text-color="black"
                    class="mr-1 mb-1"
                    v-translate="{
                      et: library.library.title,
                      en: library.library.title_en
                    }"
                    @click="
                      $router.push({
                        name: `library`,
                        params: { id: library.id }
                      })
                    "
                  />
                </span>
              </v-card-text>
              <v-card-text>
                <h3 class="pb-3">
                  <b>{{ $t("common.misc") }}</b>
                </h3>
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr>
                        <th>{{ $t("reference.id") }}</th>
                        <td>{{ reference.id }}</td>
                      </tr>
                      <tr v-if="reference.user_added">
                        <th>{{ $t("reference.dateAdded") }}</th>
                        <td>
                          {{ formatDate(reference.date_added) }}
                        </td>
                      </tr>
                      <tr v-if="reference.user_changed">
                        <th>{{ $t("reference.dateChanged") }}</th>
                        <td>
                          {{ formatDate(reference.date_changed) }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </div>
          </v-card>
          <v-card v-else-if="error">
            <v-card-actions class="referenceTitle">
              <v-col cols="auto" class="py-0 px-0">
                <v-btn large icon @click="handleBack()" aria-label="back">
                  <v-icon>fas fa-arrow-left</v-icon>
                </v-btn>
              </v-col>
              <div class="col titleText">
                {{ $t("error.referenceId", { text: id }) }}
              </div>
            </v-card-actions>
          </v-card>
        </v-fade-transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import {
  fetchReference,
  fetchReferenceLibraries,
  fetchReferenceLocalities,
  fetchReferences
} from "@/utils/apiCalls";
import dateMixin from "@/mixins/dateMixin";
import LeafletMap from "@/components/LeafletMap";
import ReferenceLinks from "@/components/reference/ReferenceLinks";
import CitationSelect from "@/components/CitationSelect";
import { mapState, mapActions } from "vuex";
import debounce from "lodash/debounce";
import urlMixin from "@/mixins/urlMixin";
import queryMixin from "@/mixins/queryMixin";
import citationMixin from "@/mixins/citationMixin";

import axios from "axios";

import ReadMore from "@/components/ReadMore";
import BaseCitationDetail from "@/components/base/BaseCitationDetail.vue";
export default {
  name: "Reference",
  components: {
    ReadMore,
    ReferenceLinks,
    LeafletMap,
    CitationSelect,
    BaseCitationDetail
  },
  mixins: [dateMixin, urlMixin, queryMixin, citationMixin],
  props: {
    id: {
      type: String
    }
  },
  data() {
    return {
      reference: null,
      libraries: [],
      localities: [],
      error: false,
      childReferences: [],
      localityMarkers: [],
      keywords: [],
      taxa: []
    };
  },
  metaInfo() {
    return {
      title: this.reference?.title,
      meta: [
        {
          property: "og:title",
          vmid: "og:title",
          content: `${this.reference?.reference}: ${this.reference?.title}`
        },
        {
          property: "keywords",
          content: this.reference?.keywords
        }
      ]
    };
  },
  computed: {
    ...mapState("search", ["search", "advancedSearch", "paginateBy", "page"]),
    journal() {
      return this.reference?.journal;
    },
    type() {
      return this.reference?.type;
    }
  },
  watch: {
    referenceParameters: {
      // Handle search parameter change
      handler: debounce(function() {
        this.$router.push({ name: "searchReference" }).catch(() => {});
      }, 300),
      deep: true
    }
  },
  created() {
    this.getReference(this.$route.params.id);
  },
  beforeRouteUpdate(to, from, next) {
    this.getReference(to.params.id);
    this.childReferences = [];
    this.localities = [];
    next();
  },
  methods: {
    ...mapActions("search", ["updateAdvancedSearch"]),
    exit() {
      this.$router.replace({ name: "searchReference" }).catch(() => {});
    },
    handleBack() {
      this.$router.back();
    },
    handleKeyword(keyword) {
      this.updateAdvancedSearch({
        value: keyword,
        id: "keywords"
      });
      this.getReferences();
      this.getLibraries();
      this.handleBack();
    },
    localityURL(id) {
      return `https://geoloogia.info/locality/${id}`;
    },
    taxonURL(id) {
      return `https://fossiilid.info/${id}`;
    },
    async getReferenceLibraries() {
      const localityReferenceResponse = await axios.get(
        `https://api.geoloogia.info/library_reference/?reference=${this.reference.id}&nest=1`
      );
      return localityReferenceResponse.data;
    },
    async getReferenceLocalities() {
      const localityReferenceResponse = await axios.get(
        `https://api.geoloogia.info/locality_reference/?reference=${this.reference.id}&nest=1`
      );
      return localityReferenceResponse.data;
    },
    async getChildReferences() {
      const childReferenceResponse = await axios.get(
        `https://api.geoloogia.info/reference/?parent_reference=${this.reference.id}&limit=1000`
      );

      return childReferenceResponse.data;
    },
    async getKeywords() {
      const keywordResponse = await axios.get(
        `https://api.geoloogia.info/reference_keyword/?reference=${this.reference.id}&nest=1&limit=1000`
      );

      return keywordResponse.data;
    },
    async getTaxa() {
      const taxonResponse = await axios.get(
        `https://api.geoloogia.info/taxon/?reference=${this.reference.id}&limit=1000`
      );

      return taxonResponse.data;
    },
    getReference(id) {
      fetchReference(id).then(res => {
        if (res === undefined) {
          this.error = true;
          return;
        }

        this.reference = res;

        this.getReferenceLocalities().then(res => {
          this.localities = res.results.filter(localityReference => {
            return !!(
              localityReference.locality?.latitude &&
              localityReference.locality?.longitude
            );
          });

          this.localityMarkers = this.localities.map(localityReference => {
            const localityTitle =
              this.$i18n.locale === "ee"
                ? localityReference.locality?.locality
                : localityReference.locality?.locality_en;

            return {
              popup: `<a href="https://geoloogia.info/locality/${localityReference.locality?.id}" target="_blank">${localityTitle}</a>`,
              title: localityTitle,
              coordinates: [
                localityReference.locality?.latitude,
                localityReference.locality?.longitude
              ]
            };
          });
        });

        this.getReferenceLibraries().then(res => {
          this.libraries = res.results;
        });

        this.getChildReferences().then(res => {
          // NOTE: Has to be sorted client-side because the pages field is a string.
          this.childReferences = res.results.sort((a, b) => {
            if (a.pages === null && b.pages === null) return 0;
            if (a.pages === null) return -1;
            if (b.pages === null) return 1;
            const aStart = a.pages.includes("-")
              ? parseInt(a.pages.split("-")[0].trim())
              : parseInt(a.pages);
            const bStart = b.pages.includes("-")
              ? parseInt(b.pages.split("-")[0].trim())
              : parseInt(b.pages);
            return aStart - bStart;
          });
        });

        this.getKeywords().then(res => {
          this.keywords = res.results;
        });
        this.getTaxa().then(res => {
          this.taxa = res.results;
        });
      });
    }
  }
};
</script>

<style scoped>
@media (min-width: 1904px) {
  .card {
    max-width: 1400px !important;
  }
}

.referenceTitle {
  background-color: #f3d3a5;
}

.titleText {
  word-break: normal;
}

.roundedBorder {
  border-radius: 12px;
}

.body {
  border-radius: 12px;
  background-color: white;
}

.exitButton:hover {
  color: #f44336;
}
</style>
