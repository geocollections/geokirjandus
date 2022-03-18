<template>
  <div class="pb-1">
    <v-subheader v-if="label" class="px-0 d-inline">{{ label }}</v-subheader>
    <v-row no-gutters>
      <v-col cols="6">
        <v-text-field
          class="pr-1"
          outlined
          dense
          :value="value[0]"
          color="#135ebf"
          :label="fieldLabels.min"
          hide-details
          single-line
          type="number"
          @input="handleInput($event, true)"
          @focus="handleFocus"
          @blur="handleBlur"
          clearable
          clear-icon="fa-times"
        >
        </v-text-field>
      </v-col>
      <v-col cols="6">
        <v-text-field
          class="pl-1"
          outlined
          dense
          :value="value[1]"
          color="#135ebf"
          :label="fieldLabels.max"
          hide-details
          single-line
          type="number"
          @input="handleInput($event, false)"
          @focus="handleFocus"
          @blur="handleBlur"
          clearable
          clear-icon="fa-times"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { isEmpty } from "lodash";
export default {
  name: "InputRange",
  data() {
    return {
      isFocused: false
    };
  },
  props: {
    value: {
      type: Array,
      default: () => {
        return [null, null];
      }
    },
    label: {
      type: String,
      default: null
    },
    fieldLabels: {
      type: Object,
      default: () => {
        return { min: "min", max: "max" };
      }
    }
  },
  methods: {
    handleFocus(e) {
      this.isFocused = true;
    },
    handleBlur(e) {
      this.isFocused = false;
      this.$emit("blur");
    },
    parseInput(input) {
      if (isEmpty(input)) return null;
      else return parseInt(input);
    },
    handleInput(e, isMin) {
      if (isMin) {
        this.$emit("input", [this.parseInput(e), this.value[1]]);
      } else {
        this.$emit("input", [this.value[0], this.parseInput(e)]);
      }
    }
  }
};
</script>

<style scoped lang="scss">
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
