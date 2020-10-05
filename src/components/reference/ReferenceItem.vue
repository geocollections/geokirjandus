<template>
  <div class="referenceItem">
    <div class="pb-1">
      <v-chip
        v-if="reference.doi"
        link
        small
        target="DoiWindow"
        color="blue"
        class="d-print-none mr-1"
        @click="openDOI(reference.doi)"
        ><b>DOI</b>
      </v-chip>
      <v-chip
        color="green"
        link
        small
        v-if="reference.attachment__filename"
        target="FileWindow"
        class="d-print-none mr-1"
        @click="openPdf(reference.attachment__filename)"
      >
        <b>PDF</b>
      </v-chip>
      <v-chip
        v-if="
          !reference.attachment__filename &&
            reference.url &&
            getUrl(reference.url)
        "
        link
        small
        color="red"
        class="d-print-none"
        :href="getUrl(reference.url)"
        target="UrlWindow d-print-none"
      >
        <b>URL</b>
      </v-chip>
    </div>

    <router-link
      class="d-print-none"
      :to="{ path: '/reference/' + reference.id }"
      :title="$t('reference.viewReference')"
    >
      <span v-html="citation" />
    </router-link>
    <div class="d-none d-print-block" v-html="citation"></div>
  </div>
</template>

<script>

export default {
  name: "ReferenceItem",
  props: {
    reference: {
      type: Object,
      required: true
    },
    citation: {
      type: String
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
.ablack a:link,
.ablack a:visited {
  color: #000;
}

a:hover {
  opacity: 0.8;
}

.ablack:hover {
  text-decoration: underline;
}

.green-link {
  color: #4caf50;
}

.red-link {
  color: #f44336;
}

.blue-link {
  color: blue;
}
</style>
