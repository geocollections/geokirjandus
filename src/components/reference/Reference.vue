<template>
  <v-container>
    <v-card v-if="reference">
      <v-card-title
        style="background-color: #F6EDDF"
        class="pt-1 pb-1 d-flex text-center"
      >
        <v-col cols="auto" class="py-0 px-0">
          <v-btn large icon @click="$router.go(-1)">
            <v-icon>fas fa-arrow-left</v-icon>
          </v-btn>
        </v-col>
        <div class="col" style="word-break: normal">
          {{ reference.reference }}
        </div>
      </v-card-title>
      <v-card-actions class=" pt-3">
        <reference-links :item="reference" />
      </v-card-actions>
      <v-card-text class="pt-1">
        <div class="d-flex pt-0">
          <h3 class="pr-3 d-flex align-center">{{ $t("common.citation") }}</h3>
          <div class="col-md-3 px-0">
            <citation-select />
          </div>
        </div>
        <v-card flat outlined>
          <div class="pa-4">
            <reference-citation :reference="reference" :only-text="true" />
          </div>
        </v-card>
      </v-card-text>
      <!--  TODO: Currently shows map with no markers when localities are present but dont have coordinates  -->
      <v-card-text class="pt-0" v-if="localities">
        <h3 class="pb-3">{{ $t("common.map") }}</h3>
        <leaflet-map :markers="getMapMarkers" />
      </v-card-text>
      <v-card-text class="pt-0">
        <h3 class="pb-3">{{ $t("common.generalInfo") }}</h3>
        <v-simple-table>
          <template v-slot:default>
            <tbody>
              <tr>
                <th>{{ $t("reference.id") }}</th>
                <td>{{ reference.id }}</td>
              </tr>
              <tr v-if="reference.reference">
                <th>{{ $t("reference.reference") }}</th>
                <td>{{ reference.reference }}</td>
              </tr>
              <tr v-if="reference.author">
                <th>{{ $t("reference.author") }}</th>
                <td>{{ reference.author }}</td>
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
              <tr v-if="reference.book">
                <th>{{ $t("reference.book") }}</th>
                <td>{{ reference.book }}</td>
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
              <tr v-if="reference.abstract">
                <th>{{ $t("reference.abstract") }}</th>
                <td class="py-4" v-html="reference.abstract"></td>
              </tr>
              <tr v-if="reference.remarks">
                <th>{{ $t("reference.remarks") }}</th>
                <td v-html="reference.remarks"></td>
              </tr>
              <tr v-if="reference.keywords">
                <th>{{ $t("reference.keywords") }}</th>
                <td class="py-4">
                  <ul>
                    <li v-for="(keyword, index) in parseKeywords" :key="index">
                      <router-link
                        :to="`/reference/?keywords_contains=${keyword}`"
                      >
                        {{ keyword }}
                      </router-link>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr v-if="reference.localities">
                <th>{{ $t("reference.localities") }}</th>
                <td class="py-4">
                  <ul>
                    <li v-for="locality in parseLocalities" :key="locality.id">
                      <a :href="localityURL(locality.id)" target="_blank">{{
                        locality.name
                      }}</a>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr v-if="reference.taxa">
                <th>{{ $t("reference.describedTaxa") }}</th>
                <td class="py-4">
                  <ul>
                    <li v-for="taxon in parseTaxa" :key="taxon.id">
                      <a :href="taxonURL(taxon.id)" target="_blank">{{
                        taxon.name
                      }}</a>
                    </li>
                  </ul>
                </td>
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
      <v-card-text v-if="reference.libraries">
        <h3 class="pb-0">{{ $t("reference.libraries") }}</h3>
        <div class="py-3" v-for="(library, index) in libraries" :key="index">
          <router-link :to="{ path: `/library/${library.id}` }">
            {{ library.title }}
          </router-link>
          <span>{{ ` ${library.author} (${library.year})` }}</span>
        </div>
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
  fetchReferenceLocalities
} from "@/utils/apiCalls";
import dateMixin from "@/mixins/dateMixin";
import CitationSelect from "@/components/CitationSelect";
import ReferenceCitation from "@/components/reference/ReferenceCitation";
import LeafletMap from "@/components/LeafletMap";
import ReferenceLinks from "@/components/reference/ReferenceLinks";

export default {
  name: "Reference",
  components: { ReferenceLinks, LeafletMap, ReferenceCitation, CitationSelect },
  data() {
    return {
      id: this.$route.params.id,
      reference: null,
      libraries: [],
      localities: [],
      error: false
    };
  },
  created() {
    this.getReference().then(res => {
      this.reference = res.results[0];

      if (this.reference === undefined) {
        this.error = true;
        return;
      }

      if (this.reference.localities) {
        this.getReferenceLocalities().then(res => {
          this.localities = res.results;
        });
      }

      if (this.reference.libraries) {
        this.getReferenceLibraries().then(res => {
          this.libraries = res.results;
        });
      }
    });
  },
  mixins: [dateMixin],
  computed: {
    getMapMarkers() {
      return this.localities
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
      const localityIds = this.reference.locality_ids.split(";");

      return localityIds.map((id, index) => {
        return {
          id: id,
          name: localityNames[index]
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
      return this.reference.keywords.split(";").filter(keyword => {
        return keyword !== " ";
      });
    }
  },
  methods: {
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
          type: "text",
          lookUpType: "contains"
        }
      });
    },
    // TODO: Currently returns more ids than there are related to reference
    getReferenceLocalities() {
      const localityIdsStr = this.reference.locality_ids.replaceAll(";", "");
      return fetchReferenceLocalities({
        search: {
          value: `id:(${localityIdsStr})`,
          type: "text",
          lookUpType: "contains"
        }
      });
    },
    getReference() {
      return fetchReference(this.$route.params.id);
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
