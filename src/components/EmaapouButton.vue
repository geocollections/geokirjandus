<template>
  <v-btn
    v-if="withText"
    text
    elevation="0"
    color="transparent"
    :ripple="false"
    href="https://geoloogia.info"
    class=" text-body-1 justify-start"
    link
  >
    <v-icon left v-if="black" class="emaapou-icon">$emaapouIconBlack</v-icon>
    <v-icon left v-else class="emaapou-icon">$emaapouIcon</v-icon>
    <div class="text-capitalize font-family-exo-2">
      E-maapõu
    </div>
  </v-btn>
  <v-btn v-else dark icon :ripple="false" href="https://geoloogia.info" link>
    <v-icon v-if="black" class="emaapou-icon">$emaapouIconBlack</v-icon>
    <v-icon v-else class="emaapou-icon">$emaapouIcon</v-icon>
  </v-btn>
</template>

<script>
export default {
  name: "EmmapouButton",
  props: {
    black: {
      type: Boolean,
      default: false
    },
    withText: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style lang="sass" scoped>

.emaapou-icon
  height: 28px !important
  width: 28px !important
</style>
