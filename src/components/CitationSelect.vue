<template>
  <v-select
    class="fit"
    :value="citationTemplate"
    :items="templates"
    hide-details
    color="#B76315"
    item-color="#fd8719"
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

<style>
.v-select.fit {
  width: min-content;
}
.v-select.fit .v-select__selection--comma {
  text-overflow: unset;
}
</style>
