<template>
  <v-main class="reference">
    <v-container v-if="reference">
      <v-row>
        <v-col cols="auto">
          <v-btn large icon @click="$router.go(-1)">
            <v-icon>fas fa-backspace</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <h1>{{ reference.reference }}</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>{{ $t("common.generalInfo") }}</h3>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <th>{{ $t("reference.id") }}</th>
                  <td>{{ reference.id }}</td>
                </tr>
                <tr>
                  <th>{{ $t("reference.reference") }}</th>
                  <td>{{ reference.reference }}</td>
                </tr>
                <tr>
                  <th>{{ $t("reference.author") }}</th>
                  <td>{{ reference.author }}</td>
                </tr>
                <tr>
                  <th>{{ $t("reference.year") }}</th>
                  <td>{{ reference.year }}</td>
                </tr>
                <tr>
                  <th>{{ $t("reference.title") }}</th>
                  <td>{{ reference.title }}</td>
                </tr>
                <tr v-if="reference.book">
                  <th>{{ $t("reference.book") }}</th>
                  <td>{{ reference.book }}</td>
                </tr>
                <tr v-if="reference.book">
                  <th>{{ $t("reference.bookEditor") }}</th>
                  <td>{{ reference.book_editor }}</td>
                </tr>
                <tr v-if="reference.journal__journal_name">
                  <th>{{ $t("reference.journalName") }}</th>
                  <td>{{ reference.journal__journal_name }}</td>
                </tr>
                <tr v-if="reference.volume">
                  <th>{{ $t("reference.volume") }}</th>
                  <td>{{ reference.volume }}</td>
                </tr>
                <tr>
                  <th>{{ $t("reference.pages") }}</th>
                  <td>{{ reference.pages }}</td>
                </tr>
                <tr v-if="reference.localities">
                  <th>{{ $t("reference.localities") }}</th>
                  <td>{{ reference.localities }}</td>
                </tr>
                <tr>
                  <!--  TODO: is this source type?  -->
                  <th>{{ $t("reference.type") }}</th>
                  <td>{{ getReferenceType }}</td>
                </tr>
                <tr>
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
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row v-if="libraries">
        <v-col>
          <h3>{{ $t("reference.libraries") }}</h3>
          <div v-for="(library, index) in libraries" :key="index">
            <router-link :to="{ path: `/library/${library.id}` }">
              {{ library.title }}
            </router-link>
            <span>{{ ` ${library.author} (${library.year})` }}</span>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="reference.attachment_filename">
        <v-col>
          <h3>{{ $t("reference.file") }}</h3>
          <a :href="getFileUrl(reference.attachment__filename)" target="_blank"
            >File</a
          >
        </v-col>
      </v-row>
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
