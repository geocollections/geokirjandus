<template>
  <v-select
    class="pt-2 pb-1"
    multiple
    outlined
    dense
    chips
    deletable-chips
    clear-icon="fa-times"
    color="#135ebf"
    :label="label"
    :value="value"
    :items="items"
    item-color="#135ebf"
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
    <template #selection="{ item }">
      <v-chip small>{{ item.text }}</v-chip>
    </template>
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
