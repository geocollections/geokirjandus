<template>
  <v-select
    :value="citationTemplate"
    :items="templates"
    dense
    outlined
    hide-details
    :label="$t('common.citationStyle')"
    @change="changeTemplate($event)"
  >
  </v-select>
</template>

<script>
import citationMixin from "@/mixins/citationMixin";

export default {
  name: "CitationSelect",
  mixins: [citationMixin]
};
</script>

<style scoped></style>
