<template>
  <v-select
    class="pt-2 pb-1"
    multiple
    outlined
    dense
    color="grey darken-3"
    :label="label"
    :value="value"
    :items="items"
    item-color="#fd8719"
    :menu-props="{
      bottom: true,
      offsetY: true,
      offsetOverflow: true
    }"
    hide-details
    @input="$emit('input', $event)"
    @change="
      $emit('update:advancedSearch', {
        value: $event,
        id: id,
        type: advancedSearch.byIds[id].type
      })
    "
    @blur="$emit('blur')"
  >
  </v-select>
</template>
<script>
export default {
  name: "InputSelect",
  props: {
    value: {
      type: Array,
      require: true
    },
    label: {
      type: String,
      default: ""
    },
    items: {
      type: Array,
      require: true
    }
  }
};
</script>
