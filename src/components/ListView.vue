<template>
  <div class="list-view white" >
    <v-row no-gutters>
      <v-col class="list-view-column py-0">
        <slot>

        </slot>
        </v-col>
    </v-row>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: ["module", "data"],
  name: "ListView"
};
</script>

<style>
@media print {
  @page {
    width: 297mm;
    height: 210mm;
    margin: 15mm 5mm;
  }

  html,
  body,
  #app,
  .v-application--wrap,
  .dashboard,
  .v-content,
  .v-content__wrap,
  .container,
  .list-module-core,
  .table-card,
  .v-card,
  .row,
  .col {
    all: unset !important;
  }
  a {
    text-decoration: none !important;
  }
  .list-view-column {
    padding: 0 !important;
  }

  .list-row {
    width: 100%;
    height: 100%;
  }
}

@media screen {
  .list-view-column {
    padding: 16px !important;
  }
}
</style>
