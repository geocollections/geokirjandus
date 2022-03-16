<template>
  <v-card flat outlined class="d-md-flex">
    <v-card-text class="referenceCitation black--text" v-html="citation" />

    <v-card-actions>
      <copy-button clipboard-class="referenceCitation" id="referenceCopy" />
    </v-card-actions>
  </v-card>
</template>

<script>
import CopyButton from "../CopyButton.vue";
export default {
  components: { CopyButton },
  name: "BaseCitationDetail",
  props: {
    citation: {
      type: String,
      required: true
    }
  }
};
</script>
