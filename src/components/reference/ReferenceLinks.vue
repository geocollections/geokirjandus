<template>
  <span>
    <v-chip
      v-if="item.doi"
      outlined
      :x-small="xSmall"
      :small="small"
      target="_blank"
      color="blue darken-4"
      rel="noopener"
      class="d-print-none ml-1 my-1 link"
      @click.stop="openDOI(item.doi)"
    >
      <v-icon :x-small="xSmall" small class=" pr-1">ai ai-doi</v-icon>
      <b>DOI</b>
    </v-chip>
    <v-chip
      color="red darken-4"
      outlined
      :x-small="xSmall"
      :small="small"
      v-if="item.attachment__filename"
      target="_blank"
      rel="noopener"
      class="d-print-none ml-1 my-1 link"
      @click.stop="openPdf(item.attachment__filename)"
    >
      <v-icon :x-small="xSmall" small class="pr-1">fas fa-file</v-icon>
      <b>PDF</b>
    </v-chip>
    <v-chip
      v-if="item.url && getUrl(item.url)"
      outlined
      :x-small="xSmall"
      :small="small"
      color="green darken-4"
      class="d-print-none ml-1 my-1 link"
      @click.stop="openUrl(item.url)"
      target="_blank"
      rel="noopener"
    >
      <v-icon :x-small="xSmall" small class="pr-1"
        >fas fa-external-link-square-alt</v-icon
      >
      <b>URL</b>
    </v-chip>
    <v-chip
      v-if="
        !item.attachment_filename && item.parent_reference__attachment__filename
      "
      outlined
      :x-small="xSmall"
      :small="small"
      color="gray"
      class="d-print-none ml-1 my-1 link"
      @click.stop="openPdf(item.parent_reference__attachment__filename)"
      target="_blank"
      rel="noopener"
    >
      <v-icon :x-small="xSmall" small class="pr-1">fas fa-file</v-icon>
      <b>PDF</b>
    </v-chip>
    <v-chip
      v-if="!item.url && item.parent_reference__url"
      outlined
      :x-small="xSmall"
      :small="small"
      color="gray"
      class="d-print-none ml-1 my-1 link"
      @click.stop="openUrl(item.parent_reference__url)"
      target="_blank"
      rel="noopener"
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
        "_blank",
        "height=800, width=800"
      );
    },
    openUrl(url) {
      window.open(url, "_blank", "height=800, width=800");
    },
    openDOI(doi) {
      window.open("https://doi.org/" + doi, "_blank", "height=800, width=800");
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
