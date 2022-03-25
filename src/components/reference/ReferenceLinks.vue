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
      v-if="pdf"
      color="red darken-4"
      outlined
      :x-small="xSmall"
      :small="small"
      target="_blank"
      rel="noopener"
      class="d-print-none ml-1 my-1 link"
      @click.stop="openPdf(pdf)"
    >
      <v-icon :x-small="xSmall" small class="pr-1">fas fa-file</v-icon>
      <b>PDF</b>
    </v-chip>
    <v-chip
      v-if="url"
      outlined
      :x-small="xSmall"
      :small="small"
      color="green darken-4"
      class="d-print-none ml-1 my-1 link"
      @click.stop="openUrl(url)"
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
  computed: {
    pdf() {
      if (this.item.parent_reference) {
        return (
          this.item.filename ?? this.item.parent_reference.filename ?? null
        );
      }
      return (
        this.item.attachment__filename ??
        this.item.parent_reference__attachment__filename ??
        this.item.filename ??
        null
      );
    },
    url() {
      // if (this.item.parent_reference) {
      //   return this.item.url ?? this.item.parent_reference.url ?? null;
      // }
      return this.item.url ?? this.item.parent_reference__url ?? null;
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
