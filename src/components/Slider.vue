<template>
  <v-range-slider
    v-model="rangeValue"
    :max="2020"
    :min="1880"
    hide-details
    class="align-center"
  >
    <!--          <template v-slot:prepend>-->
    <!--            <v-text-field-->
    <!--                :value="range[0]"-->
    <!--                class="mt-0 pt-0"-->
    <!--                hide-details-->
    <!--                single-line-->
    <!--                type="number"-->
    <!--                style="width: 60px"-->
    <!--                @change="$set(range, 0, $event)"-->
    <!--            ></v-text-field>-->
    <!--          </template>-->
    <!--          <template v-slot:append>-->
    <!--            <v-text-field-->
    <!--                :value="range[1]"-->
    <!--                class="mt-0 pt-0"-->
    <!--                hide-details-->
    <!--                single-line-->
    <!--                type="number"-->
    <!--                style="width: 60px"-->
    <!--                @change="$set(range, 1, $event)"-->
    <!--            ></v-text-field>-->
    <!--          </template>-->
  </v-range-slider>
</template>

<script>
export default {
  name: "Slider",
  props: ["range"],
  computed: {
    rangeValue: {
      get() {
        return this.range;
      },
      set(newValue) {
        this.$emit("update:range", newValue)
      }
    }
  }
  // data() {
  //   return {
  //     range: [1800, 2000]
  //   };
  // }
};
</script>

<style scoped></style>
