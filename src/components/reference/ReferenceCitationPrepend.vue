<template>
  <span>
    <v-chip
      class="mr-1"
      color="#F0B67F"
      text-color="black"
      link
      outlined
      x-small
      :href="ref"
      >{{ id }}</v-chip
    >
  </span>
</template>

<script>
export default {
  name: "ReferenceCitationPrepend",
  props: ["id"],
  computed: {
    ref() {
      return `/reference/${this.id}`;
    }
  }
};
</script>

<style scoped></style>
