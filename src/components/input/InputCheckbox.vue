<template>
  <v-checkbox
    class="mt-0 pt-0"
    :label="label"
    :color="$vuetify.theme.themes.light.accent"
    :false-value="null"
    true-value="1"
    hide-details
    :input-value="value"
    @change="$emit('input', $event)"
  />
</template>

<script>
export default {
  name: "InputCheckbox",
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
