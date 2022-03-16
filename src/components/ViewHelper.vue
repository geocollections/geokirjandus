<template>
  <div class="align-center fill-height d-flex py-0">
    <div
      class="d-flex align-center ml-sm-auto px-2 paginationSelect fill-height"
      style="flex: 0 0 0"
    >
      <div class="mr-3 text-no-wrap text-caption">
        {{ $t("common.paginateBy") }}
      </div>
      <v-select
        :value="paginateBy"
        class="mt-0 text-caption"
        style="max-width: 100px"
        color="#135ebf"
        dense
        outlined
        :menu-props="{ bottom: true, offsetY: true }"
        :items="paginateByOptionsTranslated"
        item-color="black"
        hide-details
        @change="$emit('update:paginateBy', $event)"
      />
    </div>
    <!-- <div class="range">{{ getRange }}</div> -->
    <v-pagination
      class="pageSelect "
      :value="page"
      color="#135ebf"
      prev-icon="fas fa-angle-left"
      next-icon="fas fa-angle-right"
      :length="Math.ceil(count / paginateBy)"
      :total-visible="$vuetify.breakpoint.mdAndUp ? 5 : 3"
      @input="$emit('update:page', $event)"
    />
  </div>
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
          text: item.value
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

.range {
  font-size: 0.8rem;
}
</style>
