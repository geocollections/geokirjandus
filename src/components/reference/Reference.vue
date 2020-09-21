<template>
  <div class="reference">
    <v-container v-if="reference">
      <v-row>
        <v-col>
          <v-btn @click="$router.go(-1)">
            Back
          </v-btn>
        </v-col>
        <v-col>
          <h1>{{ reference.reference }}</h1>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h3>General Info</h3>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{{ reference.id }}</td>
                </tr>
                <tr>
                  <th>Reference</th>
                  <td>{{ reference.reference }}</td>
                </tr>
                <tr>
                  <th>Author</th>
                  <td>{{ reference.author }}</td>
                </tr>
                <tr>
                  <th>Year</th>
                  <td>{{ reference.year }}</td>
                </tr>
                <tr>
                  <th>Title</th>
                  <td>{{ reference.title }}</td>
                </tr>
                <tr v-if="reference.book">
                  <th>Book</th>
                  <td>{{ reference.book }}</td>
                </tr>
                <tr v-if="reference.book">
                  <th>Book editor</th>
                  <td>{{ reference.book_editor }}</td>
                </tr>
                <tr v-if="reference.journal__journal_name">
                  <th>Journal</th>
                  <td>{{ reference.journal__journal_name }}</td>
                </tr>
                <tr v-if="reference.volume">
                  <th>Volume</th>
                  <td>{{ reference.volume }}</td>
                </tr>
                <tr>
                  <th>Pages</th>
                  <td>{{ reference.pages }}</td>
                </tr>
                <tr v-if="reference.localities">
                  <th>Localities</th>
                  <td>{{ reference.localities }}</td>
                </tr>
                <tr>
                  <!--  TODO: is this source type?  -->
                  <th>Type</th>
                  <td>{{ reference.type }}</td>
                </tr>
                <tr>
                  <!--  TODO: shows only language id right now  -->
                  <th>Language</th>
                  <td>{{ reference.language }}</td>
                </tr>
                <tr v-if="reference.doi">
                  <th>DOI</th>
                  <td>
                    <a :href="reference.doi_url" target="_blank">{{
                      reference.doi
                    }}</a>
                  </td>
                </tr>
                <tr v-if="reference.abstract">
                  <th>Abstract</th>
                  <td v-html="reference.abstract"></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
      <v-row v-if="reference.attachment_filename">
        <v-col>
          <h3>File</h3>
          <a :href="getFileUrl(reference.attachment__filename)" target="_blank"
            >File</a
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { fetchReference } from "@/utils/apiCalls";

export default {
  name: "Reference",
  data() {
    return {
      id: this.$route.params.id,
      reference: null
    };
  },
  created() {
    this.getReference().then(res => {
      console.log(res.results[0]);
      this.reference = res.results[0];
    });
  },
  methods: {
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
