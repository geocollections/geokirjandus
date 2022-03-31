<template>
  <v-text-field
    class="pt-2 pb-1"
    dense
    :color="$vuetify.theme.themes.light.accent"
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

<style lang="scss" scoped>
.v-text-field {
  padding-top: 0px;
  margin-top: 0px;
  ::v-deep .v-input__slot {
    padding-right: 6px !important;
  }
  ::v-deep .v-input__icon--clear button {
    font-size: 20px;
  }
  ::v-deep .v-input__append-inner {
    padding: 0px !important;
  }
}
</style>
