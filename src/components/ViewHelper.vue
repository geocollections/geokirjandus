<template>
  <v-card-actions
    v-if="count > 0"
    class="d-flex flex-column justify-space-around flex-md-row justify-md-space-between py-0"
  >
    <div class="col-md-3 px-2">
      <v-select
        :value="paginateBy"
        color="primary"
        dense
        :items="paginateByOptionsTranslated"
        item-color="black"
        :label="$t('common.paginateBy')"
        hide-details
        @change="$emit('update:paginateBy', $event)"
      />
    </div>
    <v-pagination
      :value="page"
      color="#F0B67F"
      circle
      prev-icon="fas fa-angle-left"
      next-icon="fas fa-angle-right"
      :length="Math.ceil(count / paginateBy)"
      :total-visible="5"
      @input="$emit('update:page', $event)"
    />
  </v-card-actions>
</template>

<script>
export default {
  name: "ViewHelper",
  props: {
    count: {
      type: Number,
      required: true
    },
    paginateBy: {
      type: Number,
      required: true
    },
    page: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      paginateByOptions: [
        { text: "pagination", value: 10 },
        { text: "pagination", value: 25 },
        { text: "pagination", value: 50 },
        { text: "pagination", value: 100 },
        { text: "pagination", value: 250 },
        { text: "pagination", value: 500 },
        { text: "pagination", value: 1000 }
      ]
    };
  },
  computed: {
    paginateByOptionsTranslated() {
      return this.paginateByOptions.map(item => {
        return {
          ...item,
          text: this.$t(item.text, { num: item.value })
        };
      });
    }
  }
};
</script>

<style scoped></style>
