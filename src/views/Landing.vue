<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <h1>{{ $t("title") }}</h1>
        <p>{{$t("subtitle")}}</p>
        <v-btn to="/reference">View all references</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Landing"
};
</script>

<style scoped></style>
