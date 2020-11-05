<template>
  <v-select
    :value="citationTemplate"
    :items="templates"
    hide-details
    color="#B76315"
    item-color="#E58124"
    :menu-props="{ bottom: true, offsetY: true }"
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
