<template>
  <span>
    <v-chip
      v-if="item.doi"
      link
      outlined
      x-small
      target="DoiWindow"
      color="blue"
      class="d-print-none ml-1"
      :href="getDoiUrl(item.doi)"
      ><b>DOI</b>
    </v-chip>
    <v-chip
      color="red"
      link
      outlined
      x-small
      v-if="item.attachment__filename"
      target="FileWindow"
      class="d-print-none ml-1"
      :href="getFileUrl(item.attachment__filename)"
    >
      <b>PDF</b>
    </v-chip>
    <v-chip
      v-if="!item.attachment__filename && item.url && getUrl(item.url)"
      link
      outlined
      x-small
      color="green"
      class="d-print-none ml-1"
      :href="getUrl(item.url)"
      target="UrlWindow d-print-none"
    >
      <b>URL</b>
    </v-chip>
  </span>
</template>

<script>
export default {
  name: "ReferenceLinks",
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    getDoiUrl(doi) {
      return `https://doi.org/${doi}`;
    },
    getFileUrl(uuid) {
      return `https://files.geocollections.info/${uuid.substring(
        0,
        2
      )}/${uuid.substring(2, 4)}/${uuid}`;
    },
    getUrl(url) {
      if (url.startsWith("http")) return url;
      else if (url.startsWith("www.")) return "http://" + url;
      else if (url.includes("www."))
        return "http://" + url.substring(url.indexOf("www."));
      else return false;
    },
    openPdf(uuid) {
      window.open(
        "https://files.geocollections.info/" +
          uuid.substring(0, 2) +
          "/" +
          uuid.substring(2, 4) +
          "/" +
          uuid,
        "",
        "width=1000,height=900"
      );
    },
    openDOI(doi) {
      // TODO: Check for correct doi address
      window.open("https://doi.org/" + doi, "", "width=1000,height=900");
    }
  }
};
</script>

<style scoped></style>
