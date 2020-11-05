<template>
  <v-container>
    <v-card v-if="reference">
      <v-card-title
        style="background-color: #EEDBBF"
        class="pt-1 pb-1 d-flex text-center"
      >
        <v-col cols="auto" class="py-0 px-0">
          <v-btn large icon @click="handleBack()" aria-label="back">
            <v-icon>fas fa-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <div class="col" style="word-break: normal">
          {{ `${reference.reference}: ${reference.title}` }}
        </div>
      </v-card-title>
      <v-card-actions class=" pt-3">
        <reference-links :item="reference" />
      </v-card-actions>
      <v-card-text>
        <div class="d-flex pb-3">
          <h3 class="align-self-center">
            <b>{{ $t("common.citation") }}</b>
          </h3>
          <!--
            TODO: Find a better way to copy citation. Right now there is a copy of the csl json in this component and the citation is built again. Should build citation only once
            TODO: Citation text style is not copied right now (bold, italic)
          -->
          <copy-button
            :text="citation(getCslJson, null, null, 'string')"
            :message="$t('messages.copyCitation')"
          />
        </div>
        <v-card flat outlined>
          <div class="pa-4">
            <reference-citation
              ref="textToCopy"
              :reference="reference"
              :only-text="true"
            />
          </div>
        </v-card>
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
                <tr v-if="reference.journal__journal_name">
                  <th>{{ $t("reference.journalName") }}</th>
                  <td>{{ reference.journal__journal_name }}</td>
                </tr>
                <tr v-if="reference.parent_reference">
                  <th>{{ $t("reference.parentReference") }}</th>
                  <td>
                    <router-link
                      :to="{ path: `${reference.parent_reference}` }"
                    >
                      {{ reference.parent_reference__reference }}
                    </router-link>
                  </td>
                </tr>
                <tr v-if="reference.volume">
                  <th>{{ $t("reference.volume") }}</th>
                  <td>{{ reference.volume }}</td>
                </tr>
                <tr v-if="reference.pages">
                  <th>{{ $t("reference.pages") }}</th>
                  <td>{{ reference.pages }}</td>
                </tr>
                <tr v-if="reference.type">
                  <th>{{ $t("reference.type") }}</th>
                  <td>{{ getReferenceType }}</td>
                </tr>
                <tr v-if="reference.figures">
                  <th>{{ $t("reference.figures") }}</th>
                  <td>{{ reference.figures }}</td>
                </tr>
                <tr v-if="reference.language">
                  <th>{{ $t("reference.language") }}</th>
                  <td>
                    {{ getReferenceLanguage }}
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
          v-if="localities.length > 0"
        >
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
          <leaflet-map :markers="localities" />
        </div>
      </v-card-text>
      <v-card-text v-if="reference.abstract">
        <h3 class="pb-3">
          <b>{{ $t("reference.abstract") }}</b>
        </h3>
        <div v-html="reference.abstract"></div>
      </v-card-text>
      <v-card-text v-if="reference.remarks">
        <h3 class="pb-3">
          <b>{{ $t("reference.remarks") }}</b>
        </h3>
        <div v-html="reference.remarks"></div>
      </v-card-text>
      <v-card-text v-if="reference.keywords">
        <h3 class="pb-3">
          <b>{{ $t("reference.keywords") }}</b>
        </h3>

        <span v-for="(keyword, index) in parseKeywords" :key="index">
          <!--  FIXME: Does not work with keywords that contain spaces  -->
          <v-chip
            outlined
            color="#F0B67F"
            text-color="black"
            class="mr-1 mb-1"
            @click="handleKeyword(keyword)"
          >
            {{ keyword }}
          </v-chip>
        </span>
      </v-card-text>
      <v-card-text v-if="childReferences">
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
      <v-card-text
        v-if="reference.localities || reference.taxa"
        class="row ma-0"
      >
        <div v-if="reference.localities" class="col-12 col-md-6 pa-0">
          <h3 class="pb-3">
            <b>{{ $t("reference.localities") }}</b>
          </h3>

          <ul>
            <li v-for="locality in parseLocalities" :key="locality.id">
              <a :href="localityURL(locality.id)" target="_blank">
                {{ $i18n.locale === "ee" ? locality.name : locality.nameEng }}
              </a>
            </li>
          </ul>
        </div>
        <div v-if="reference.taxa" class="col-12 col-md-6 pa-0 pt-4 pt-md-0">
          <h3 class="pb-3">{{ $t("reference.describedTaxa") }}</h3>
          <ul>
            <li v-for="taxon in parseTaxa" :key="taxon.id">
              <a :href="taxonURL(taxon.id)" target="_blank">{{ taxon.name }}</a>
            </li>
          </ul>
        </div>
      </v-card-text>
      <v-card-text v-if="libraries.length > 0">
        <h3 class="pb-3">
          <b>{{ $t("reference.libraries") }}</b>
        </h3>
        <span class="py-3" v-for="(library, index) in libraries" :key="index">
          <v-chip
            outlined
            color="#F0B67F"
            text-color="black"
            class="mr-1 mb-1"
            @click="
              $router.push({ name: `library`, params: { id: library.id } })
            "
          >
            {{ library.title }}
          </v-chip>
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
                <th>{{ $t("reference.userAdded") }}</th>
                <td>
                  {{ reference.user_added }} ({{
                    formatDate(reference.date_added)
                  }})
                </td>
              </tr>
              <tr v-if="reference.user_changed">
                <th>{{ $t("reference.userChanged") }}</th>
                <td>
                  {{ reference.user_changed }} ({{
                    formatDate(reference.date_changed)
                  }})
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card-text>
    </v-card>
    <v-card v-if="error">
      <v-card-actions style="background-color: #F6EDDF">
        <v-col cols="auto" class="py-0 px-2">
          <v-btn large icon @click="$router.go(-1)">
            <v-icon>fas fa-backspace</v-icon>
          </v-btn>
        </v-col>
      </v-card-actions>
      <v-card-title style="background-color: #F6EDDF" class="pt-0">
        {{ $t("error.referenceId", { text: id }) }}
      </v-card-title>
    </v-card>
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
import ReferenceCitation from "@/components/reference/ReferenceCitation";
import LeafletMap from "@/components/LeafletMap";
import ReferenceLinks from "@/components/reference/ReferenceLinks";
import { mapState, mapActions } from "vuex";
import debounce from "lodash/debounce";
import urlMixin from "@/mixins/urlMixin";
import queryMixin from "@/mixins/queryMixin";
import CopyButton from "@/components/CopyButton";
import citationMixin from "@/mixins/citationMixin";

export default {
  name: "Reference",
  components: { CopyButton, ReferenceLinks, LeafletMap, ReferenceCitation },
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
      prevRoute: null,
      childReferences: null
    };
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!from.name) vm.prevRoute = { name: "searchReference" };
      else vm.prevRoute = from;
      vm.getReference(vm.id);
    });
  },
  beforeRouteUpdate(to, from, next) {
    this.getReference(to.params.id);
    this.childReferences = [];
    this.localities = [];
    this.prevRoute = { name: from.name, params: from.params };
    next();
  },
  watch: {
    referenceParameters: {
      handler: debounce(function() {
        if (this.prevRoute.name === "landing")
          this.$router.replace({ name: "searchReference" });
        else this.$router.push(this.prevRoute).catch(() => {});
      }, 300),
      deep: true
    }
  },
  mixins: [dateMixin, urlMixin, queryMixin, citationMixin],
  computed: {
    ...mapState("search", ["search", "advancedSearch", "paginateBy", "page"]),
    getCslJson() {
      return {
        id: this.reference.id,
        type: this.reference.reference_csl_type,
        title: this.reference.title,
        DOI: this.reference.doi,
        author: this.parseNames(this.reference.author),
        issued: [
          {
            "date-parts": [this.reference.year]
          }
        ],
        "container-title": this.reference.book ?? this.reference.journal_name,
        volume: this.reference.volume,
        number: this.reference.number,
        publisher: this.reference.publisher,
        "publisher-place": this.reference.publisher_place,
        page: this.reference.pages,
        URL: this.reference.url
      };
    },
    referenceParameters() {
      return { ...this.advancedSearch.byIds, search: this.search };
    },
    getReferenceType() {
      return this.$i18n.locale === "ee"
        ? this.reference.reference_type
        : this.reference.reference_type_en;
    },
    getReferenceLanguage() {
      return this.$i18n.locale === "ee"
        ? this.reference.reference_language
        : this.reference.reference_language_en;
    },
    parseLocalities() {
      const localityNames = this.reference.localities.split(";");

      const localityNamesEng = this.reference.localities_en.split(";");
      const localityIds = this.reference.locality_ids.split(";");

      return localityIds.map((id, index) => {
        return {
          id: id,
          name: localityNames[index],
          nameEng: localityNamesEng[index]
        };
      });
    },
    parseTaxa() {
      const taxaNames = this.reference.taxa.split(";");
      const ids = this.reference.taxon_ids.split(";");

      return ids.map((id, index) => {
        return {
          id: id,
          name: taxaNames[index]
        };
      });
    },
    parseKeywords() {
      return this.reference.keywords
        .split(";")
        .filter(keyword => {
          return keyword !== " ";
        })
        .map(keyword => {
          return keyword.trim();
        });
    }
  },
  methods: {
    ...mapActions("search", ["updateAdvancedSearch"]),
    handleBack() {
      if (this.prevRoute.name === "reference") {
        this.$router.back();
      } else {
        this.getReferences();
        this.getLibraries();

        this.$router.replace(this.prevRoute);
      }
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
      return `https://geocollections.info/locality/${id}`;
    },
    taxonURL(id) {
      return `https://fossiilid.info/${id}`;
    },
    getReferenceLibraries() {
      return fetchReferenceLibraries({
        search: {
          value: `id:(${this.reference.libraries.replaceAll("|", " ").trim()})`,
          type: "text"
        }
      });
    },
    getReferenceLocalities() {
      const localityIdsStr = this.reference.locality_ids.replaceAll(";", "");
      return fetchReferenceLocalities({
        search: {
          value: `id:(${localityIdsStr})`,
          type: "text"
        }
      });
    },
    getChildReferences() {
      return fetchReferences({
        advancedSearch: {
          parent_reference_id: {
            type: "text",
            id: "parent_reference_id",
            value: this.reference.id,
            lookUpType: "equals",
            fields: ["parent_reference_id"]
          }
        },
        sortBy: ["pages_start"],
        sortDesc: [false],
        fields: ["id", "author", "pages", "title"]
      });
    },
    getReference(id) {
      fetchReference(id).then(res => {
        this.reference = res.results[0];

        if (this.reference === undefined) {
          this.error = true;
          return;
        }

        if (this.reference.localities) {
          this.getReferenceLocalities().then(res => {
            this.localities = res.results
              .filter(locality => {
                return !!(locality.latitude && locality.longitude);
              })
              .map(locality => {
                const localityTitle =
                  this.$i18n.locale === "ee"
                    ? locality.locality
                    : locality.locality_en;

                return {
                  popup: `<div>${localityTitle}</div>`,
                  title: localityTitle,
                  coordinates: [locality.latitude, locality.longitude]
                };
              });
          });
        }

        if (this.reference.libraries) {
          this.getReferenceLibraries().then(res => {
            this.libraries = res.results;
          });
        }

        this.getChildReferences().then(res => {
          if (res.count > 0) this.childReferences = res.results;
        });
      });
    },
    getFileUrl(uuid) {
      return `https://files.geocollections.info/${uuid.substring(
        0,
        2
      )}/${uuid.substring(2, 4)}/${uuid}`;
    }
  }
};
</script>
