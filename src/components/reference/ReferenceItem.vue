<template>
  <div class="referenceItem">
    <span v-if="index !== undefined">{{ index }}. </span>
    <!--    <span v-if="reference.author" class="ablack font-weight-medium">-->
    <!--      <router-link-->
    <!--        :to="{ path: '/reference/' + reference.id }"-->
    <!--        :title="$t('reference.viewReference')"-->
    <!--      >-->
    <!--        {{ reference.author }},-->
    <!--      </router-link>-->
    <!--    </span>-->

    <!--    <span v-if="reference.year"> {{ reference.year }}. </span>-->

    <!--    <span v-if="reference.title"> {{ reference.title }}. </span>-->

    <!--    <span v-if="reference.book_editor || reference.book">-->
    <!--      <i>In: </i>-->
    <!--    </span>-->

    <!--    <span v-if="reference.book_editor">-->
    <!--      {{ reference.book_editor }} (ed.),-->
    <!--    </span>-->

    <!--    <span v-if="reference.book">-->
    <!--      <i>{{ reference.book }}</i-->
    <!--      >.-->
    <!--    </span>-->

    <!--    <span v-if="reference.publisher"> {{ reference.publisher }}, </span>-->

    <!--    <span v-if="reference.publisher_place">-->
    <!--      {{ reference.publisher_place }}.-->
    <!--    </span>-->

    <!--    <span v-if="reference.journal__journal_name">-->
    <!--      <i>{{ reference.journal__journal_name }}</i>-->
    <!--    </span>-->

    <!--    <span v-if="reference.volume"> {{ reference.volume }}, </span>-->

    <!--    <span v-if="reference.number"> {{ reference.number }}, </span>-->

    <!--    <span v-if="reference.pages && reference.journal__journal_name">-->
    <!--      {{ reference.pages }}.-->
    <!--    </span>-->

    <!--    <span v-else-if="reference.pages"> pp. {{ reference.pages }}. </span>-->

    <!--    <span v-if="reference.doi">-->
    <!--      <a target="DoiWindow" @click="openDOI(reference.doi)"-->
    <!--        >https://doi.org/{{ reference.doi }}-->
    <!--      </a>-->
    <!--    </span>-->

    <!--    <span>-->
    <!--      <a-->
    <!--        v-if="reference.attachment__filename"-->
    <!--        target="FileWindow"-->
    <!--        class="green-link"-->
    <!--        @click="openPdf(reference.attachment__filename)"-->
    <!--      >-->
    <!--        <b>PDF</b>-->
    <!--      </a>-->
    <!--      <a-->
    <!--        v-if="-->
    <!--          !reference.attachment__filename &&-->
    <!--            reference.url &&-->
    <!--            getUrl(reference.url)-->
    <!--        "-->
    <!--        :href="getUrl(reference.url)"-->
    <!--        :title="getUrl(reference.url)"-->
    <!--        target="UrlWindow"-->
    <!--        rel="noopener noreferrer"-->
    <!--        class="red-link"-->
    <!--      >-->
    <!--        <b>PDF</b>-->
    <!--      </a>-->
    <!--    </span>-->
    <router-link
      :to="{ path: '/reference/' + reference.id }"
      :title="$t('reference.viewReference')"
    >
      <span v-html="citation.outerHTML" />
    </router-link>
  </div>
</template>

<script>
import Cite from "citation-js";

export default {
  name: "ReferenceItem",
  props: {
    reference: {
      type: Object,
      required: true
    },
    index: {
      type: Number
    }
  },
  computed: {
    citation() {
      const data = {
        id: this.reference.id,
        type: "article-journal",
        title: this.reference.title,
        DOI: this.reference.doi,
        author: [
          {
            family: this.reference.author
          }
        ],
        issued: [
          {
            "date-parts": [this.reference.year]
          }
        ],
        "container-title": this.reference.book,
        volume: this.reference.volume,
        publisher: this.reference.publisher,
        page: this.reference.pages,
        URL: this.reference.url
      };
      const cite = new Cite().set(data);

      return cite.get({ type: "html", style: "citation-apa" });
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

.red-link {
  color: #f44336;
}
</style>
