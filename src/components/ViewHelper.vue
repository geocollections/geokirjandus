<template>
  <v-card-actions class="flex-column flex-md-row justify-md-space-between py-0">
    <div class="col-md-3 px-2">
      <v-select
        :value="paginateBy"
        color="#B76315"
        dense
        :menu-props="{ bottom: true, offsetY: true }"
        :items="paginateByOptionsTranslated"
        item-color="black"
        :label="$t('common.paginateBy')"
        hide-details
        @change="$emit('update:paginateBy', $event)"
      />
    </div>
    <div style="font-size: 0.8rem" class="ml-md-auto">{{ getRange }}</div>
    <v-pagination
      :value="page"
      color="#E58124"
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
        { text: "pagination", value: 100 }
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
    },
    getRange() {
      return `${
        this.count > 0 ? this.paginateBy * this.page - (this.paginateBy - 1) : 0
      } - ${
        this.paginateBy * this.page > this.count
          ? this.count
          : this.paginateBy * this.page
      } (${this.count})`;
    }
  }
};
</script>

<style>
button {
  outline: none !important;
}
</style>
