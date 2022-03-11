<template>
  <v-select
    :value="citationTemplate"
    :items="templates"
    hide-details
    dense
    outlined
    color="#B76315"
    item-color="#fd8719"
    :menu-props="{ bottom: true, offsetY: true }"
    :label="$t('common.citationStyle')"
    @change="changeTemplate($event)"
  >
    <template #selection="{item}">
      <div
        class="text-caption text-no-wrap text-truncate"
        style="max-width: 90%"
      >
        {{ item.text }}
      </div>
    </template>
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
/* .v-select {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
} */

/* .v-select.fit {
  width: min-content;
}

.v-select.fit .v-select__selection--comma {
  text-overflow: unset;
} */
</style>
