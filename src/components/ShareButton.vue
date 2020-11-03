<template>
  <v-dialog v-model="open" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        dark
        small
        style="border-radius: 4px; background-color: #E58124"
        class="mx-2"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon small>fas fa-share-alt</v-icon>
      </v-btn>
    </template>
    <v-card color="#F6EDDF">
      <v-card-title>
        URL
        <v-card-actions>
          <copy-button :text="getShareURL" :message="$t('messages.copyURL')" />
        </v-card-actions>
      </v-card-title>
      <v-card-text>
        <v-card outlined>
          <v-card-text style="word-break: break-all">
            {{ getShareURL }}
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="open = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from "vuex";
import urlMixin from "@/mixins/urlMixin";
import CopyButton from "@/components/CopyButton";

export default {
  name: "ShareButton",
  components: { CopyButton },
  mixins: [urlMixin],
  data() {
    return {
      open: false
    };
  },
  computed: {
    ...mapState("search", ["search", "advancedSearch"]),
    getShareURL() {
      let resolve = this.$router.resolve({
        name: "query",
        query: this.setURLParameters({
          ...this.advancedSearch.byIds,
          search: this.search
        })
      });

      return `https://geoloogia.info${resolve.href}`;
    }
  }
};
</script>

<style scoped></style>
