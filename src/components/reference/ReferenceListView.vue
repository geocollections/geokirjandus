<template>
  <div v-if="data.length > 0">
    <v-col class="px-0 d-print-none" md="3">
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
    </v-col>
    <v-card-text class="py-0" v-for="(entity, index) in data" :key="entity.id">
      <v-divider v-if="index !== 0" />
      <reference-item
        class="my-2"
        :reference="entity"
        :citation="citation(entity)"
      ></reference-item>
    </v-card-text>
  </div>
</template>

<script>
import ReferenceItem from "@/components/reference/ReferenceItem";
import citationMixin from "@/mixins/citationMixin";

export default {
  name: "ReferenceListView",
  components: { ReferenceItem },
  props: {
    data: {
      type: Array
    }
  },
  mixins: [citationMixin]
};
</script>
