<template>
  <div v-if="data.length > 0">
    <div class="list" v-for="(entity) in data" :key="entity.id">
      <div class="list-row ml-2 p-1">
        <reference-item :reference="entity"></reference-item>
      </div>
    </div>
  </div>
</template>

<script>
import ReferenceItem from "@/components/reference/ReferenceItem";
export default {
  components: { ReferenceItem },
  props: {
    data: {
      type: Array
    },
    bodyActiveColor: {
      type: String,
      required: false,
      default: "deep-orange"
    }
  },
  name: "ReferenceListView",
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

    openDOI(params) {
      // TODO: Check for correct doi address
      window.open("https://doi.org/" + params.doi, "", "width=1000,height=900");
    },

    openPdf(params) {
      window.open(
        "https://files.geocollections.info/" +
          params.pdf.substring(0, 2) +
          "/" +
          params.pdf.substring(2, 4) +
          "/" +
          params.pdf,
        "",
        "width=1000,height=900"
      );
    }
  }
};
</script>

<style scoped>
.list /*:not(:first-child)*/
 {
  /*border-top: dotted 1.2pt #ccc;*/
  padding: 0.2em 0 0 4em;
  text-indent: -4em;
}

.list-row {
  font-size: 1rem;
}

.green-link {
  color: #4caf50;
}

.red-link {
  color: #f44336;
}

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
</style>
