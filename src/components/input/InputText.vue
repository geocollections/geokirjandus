<template>
  <v-text-field
    class="pt-2 pb-1"
    dense
    color="grey darken-3"
    outlined
    :value="value"
    :label="label"
    hide-details
    @input="$emit('input', $event)"
    @blur="$emit('blur')"
  />
</template>

<script>
export default {
  name: "InputText",
  props: {
    value: {
      type: String,
      require: true
    },
    label: {
      type: String,
      default: ""
    }
  }
};
</script>
