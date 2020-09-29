<template>
  <v-main class="reference">
    <v-container v-if="reference">
      <v-card>
        <v-card-title>
          <v-col cols="auto">
            <v-btn large icon @click="$router.go(-1)">
              <v-icon>fas fa-backspace</v-icon>
            </v-btn>
          </v-col>
          <v-col>
            <h1>{{ reference.reference }}</h1>
          </v-col>
        </v-card-title>
        <v-card-text>
          <h3>{{ $t("common.generalInfo") }}</h3>
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
                <tr v-if="reference.localities">
                  <th>{{ $t("reference.localities") }}</th>
                  <td>{{ reference.localities }}</td>
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
                  <td v-html="reference.abstract"></td>
                </tr>
                <tr v-if="reference.remarks">
                  <th>{{ $t("reference.remarks") }}</th>
                  <td v-html="reference.remarks"></td>
                </tr>
                <tr v-if="reference.keywords">
                  <th>{{ $t("reference.keywords") }}</th>
                  <td>{{ reference.keywords }}</td>
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
          <h3>{{ $t("reference.libraries") }}</h3>
          <div v-for="(library, index) in libraries" :key="index">
            <router-link :to="{ path: `/library/${library.id}` }">
              {{ library.title }}
            </router-link>
            <span>{{ ` ${library.author} (${library.year})` }}</span>
          </div>
        </v-card-text>
        <v-card-text v-if="reference.attachment__filename || reference.url">
          <h3>{{ $t("common.links") }}</h3>
          <v-btn
            v-if="reference.attachment__filename"
            target="_blank"
            :href="getFileUrl(reference.attachment__filename)"
            ><v-icon>fas fa-file</v-icon><span class="pl-1">PDF</span>
          </v-btn>
          <v-btn v-if="reference.url" target="_blank" :href="reference.url">
            <v-icon>fas fa-external-link-square-alt</v-icon
            ><span class="pl-1">URL</span>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-container>
  </v-main>
</template>

<script>
import { fetchReference, fetchReferenceLibraries } from "@/utils/apiCalls";

export default {
  name: "Reference",
  data() {
    return {
      id: this.$route.params.id,
      reference: null,
      libraries: null
    };
  },
  created() {
    this.getReference().then(res => {
      this.reference = res.results[0];
      if (this.reference.libraries) {
        this.getReferenceLibraries().then(res => {
          this.libraries = res.results;
        });
      }
    });
  },
  computed: {
    getDateLocale() {
      if (this.$i18n.locale === "ee") {
        return "et-EE";
      } else {
        return "en-GB";
      }
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
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleString(this.getDateLocale, {
        dateStyle: "medium"
      });
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
