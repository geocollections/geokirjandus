<template>
  <span>
    <v-chip
      v-if="item.doi"
      link
      outlined
      :x-small="xSmall"
      :small="small"
      target="_blank"
      color="blue"
      class="d-print-none ml-1 my-1 link"
      :href="getDoiUrl(item.doi)"
    >
      <v-icon :x-small="xSmall" small class=" pr-1">ai ai-doi</v-icon>
      <b>DOI</b>
    </v-chip>
    <v-chip
      color="red"
      link
      outlined
      :x-small="xSmall"
      :small="small"
      v-if="item.attachment__filename"
      target="_blank"
      class="d-print-none ml-1 my-1 link"
      :href="getFileUrl(item.attachment__filename)"
    >
      <v-icon :x-small="xSmall" small class="pr-1">fas fa-file</v-icon>
      <b>PDF</b>
    </v-chip>
    <v-chip
      v-if="item.url && getUrl(item.url)"
      link
      outlined
      :x-small="xSmall"
      :small="small"
      color="green"
      class="d-print-none ml-1 my-1 link"
      :href="getUrl(item.url)"
      target="_blank"
    >
      <v-icon :x-small="xSmall" small class="pr-1"
        >fas fa-external-link-square-alt</v-icon
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
    },
    xSmall: {
      type: Boolean,
      default: false
    },
    small: {
      type: Boolean,
      default: false
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

<style scoped>
.link {
  display: inline-block;
  line-height: normal;
  text-decoration: none;
}
</style>
