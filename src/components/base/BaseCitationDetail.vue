<template>
  <v-card flat outlined>
    <v-card-text class="referenceCitation pb-1" v-html="citation" />

    <v-card-actions class="pt-0">
      <v-spacer />
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
