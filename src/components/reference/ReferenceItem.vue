<template>
  <div class="referenceItem">
    <span v-if="index !== undefined">{{ index }}. </span>
    <span v-if="reference.author" class="ablack font-weight-medium">
      <router-link
        :to="{ path: '/reference/' + reference.id }"
        :title="$t('reference.viewReference')"
      >
        {{ reference.author }},
      </router-link>
    </span>

    <span v-if="reference.year"> {{ reference.year }}. </span>

    <span v-if="reference.title"> {{ reference.title }}. </span>

    <span v-if="reference.book_editor || reference.book">
      <i>In: </i>
    </span>

    <span v-if="reference.book_editor">
      {{ reference.book_editor }} (ed.),
    </span>

    <span v-if="reference.book">
      <i>{{ reference.book }}</i
      >.
    </span>

    <span v-if="reference.publisher"> {{ reference.publisher }}, </span>

    <span v-if="reference.publisher_place">
      {{ reference.publisher_place }}.
    </span>

    <span v-if="reference.journal__journal_name">
      <i>{{ reference.journal__journal_name }}</i>
    </span>

    <span v-if="reference.volume"> {{ reference.volume }}, </span>

    <span v-if="reference.number"> {{ reference.number }}, </span>

    <span v-if="reference.pages && reference.journal__journal_name">
      {{ reference.pages }}.
    </span>

    <span v-else-if="reference.pages"> pp. {{ reference.pages }}. </span>

    <!-- TODO: DOI LINK -->
    <span v-if="reference.doi">
      <a
        :href="getDoiUrl(reference.doi)"
        :title="getDoiUrl(reference.doi)"
        target="DoiWindow"
        >https://doi.org/{{ reference.doi }}
      </a>
    </span>

    <span>
      <a
        v-if="reference.attachment__filename"
        :href="getFileUrl(reference.attachment__filename)"
        :title="getFileUrl(reference.attachment__filename)"
        target="FileWindow"
        class="green-link"
      >
        <b>PDF</b>
      </a>
      <a
        v-if="
          reference.attachment__filename === null &&
            reference.url &&
            getUrl(reference.url)
        "
        :href="getUrl(reference.url)"
        :title="getUrl(reference.url)"
        target="UrlWindow"
        rel="noopener noreferrer"
        class="red-link"
      >
        <b>PDF</b>
      </a>
    </span>
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
    index: {
      type: Number
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
    }
  }
};
</script>

<style scoped></style>
