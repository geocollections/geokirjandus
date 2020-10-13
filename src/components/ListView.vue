<template>
  <div class="list-view white">
    <v-row no-gutters>
      <v-col class="list-view-column py-0">
        <slot> </slot>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  components: {},
  props: ["module", "data"],
  name: "ListView"
};
</script>
