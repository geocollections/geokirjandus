<template>
  <div v-if="data.length > 0">
    <div class="list" v-for="(entity, index) in data" :key="index">
      <div class="list-row ml-2 p-1">
        <span v-if="entity.author" class="ablack font-weight-medium">
          <router-link
              :to="{ path: '/reference/' + entity.id }"
              :title="$t('reference.viewReference')"
          >
            {{ entity.author }},
          </router-link>
        </span>

        <span v-if="entity.year"> {{ entity.year }}. </span>

        <span v-if="entity.title"> {{ entity.title }}. </span>

        <span v-if="entity.book_editor || entity.book">
          <i>In: </i>
        </span>

        <span v-if="entity.book_editor"> {{ entity.book_editor }} (ed.), </span>

        <span v-if="entity.book">
          <i>{{ entity.book }}</i
          >.
        </span>

        <span v-if="entity.publisher"> {{ entity.publisher }}, </span>

        <span v-if="entity.publisher_place">
          {{ entity.publisher_place }}.
        </span>

        <span v-if="entity.journal__journal_name">
          <i>{{ entity.journal__journal_name }}</i>
        </span>

        <span v-if="entity.volume"> {{ entity.volume }}, </span>

        <span v-if="entity.number"> {{ entity.number }}, </span>

        <span v-if="entity.pages && entity.journal__journal_name">
          {{ entity.pages }}.
        </span>

        <span v-else-if="entity.pages"> pp. {{ entity.pages }}. </span>

        <!-- TODO: DOI LINK -->
        <span v-if="entity.doi">
          <a
              :href="getDoiUrl(entity.doi)"
              :title="getDoiUrl(entity.doi)"
              target="DoiWindow"
              :class="`${bodyActiveColor}--text`"
          >https://doi.org/{{ entity.doi }}
          </a>
        </span>

        <span>
          <a
              v-if="entity.attachment__filename"
              :href="getFileUrl(entity.attachment__filename)"
              :title="getFileUrl(entity.attachment__filename)"
              target="FileWindow"
              class="green-link"
          >
            <b>PDF</b>
          </a>
          <a
              v-if="
              entity.attachment__filename === null &&
                entity.url &&
                getUrl(entity.url)
            "
              :href="getUrl(entity.url)"
              :title="getUrl(entity.url)"
              target="UrlWindow"
              rel="noopener noreferrer"
              class="red-link"
          >
            <b>PDF</b>
          </a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
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
