<template>
  <v-text-field
    class="pt-2 pb-1"
    dense
    color="#135ebf"
    outlined
    :value="value"
    :label="label"
    hide-details
    clearable
    clear-icon="fa-times"
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
