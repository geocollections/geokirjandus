<template>
  <span class="space-x-1">
    <UButton
      v-if="item.doi"
      :ui="{ rounded: 'rounded-full' }"
      variant="outline"
      target="_blank"
      color="yellow"
      rel="noopener"
      size="2xs"
      icon="i-simple-icons-doi"
      @click.stop="openPopup(getDoiUrl(item.doi))"
    >
      DOI
    </UButton>
    <UButton
      v-if="item.pdf"
      :ui="{ rounded: 'rounded-full' }"
      variant="outline"
      target="_blank"
      color="red"
      rel="noopener"
      size="2xs"
      icon="i-heroicons-document"
      @click.stop="openPopup(getFileUrl(item.pdf))"
    >
      PDF
    </UButton>
    <UButton
      v-if="item.url"
      :ui="{ rounded: 'rounded-full' }"
      variant="outline"
      target="_blank"
      color="green"
      rel="noopener"
      size="2xs"
      icon="i-heroicons-arrow-top-right-on-square"
      @click.stop="openPopup(item.url)"
    >
      URL
    </UButton>
  </span>
</template>

<script>
export default defineNuxtComponent({
  name: "ReferenceLinks",
  props: {
    item: {
      type: Object,
      required: true,
    },
    xSmall: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    pdf() {
      if (typeof this.item.parent_reference === "object") {
        return (
          this.item.filename ?? this.item.parent_reference?.filename ?? null
        );
      }
      return (
        this.item.attachment__filename ??
        this.item.parent_reference__attachment__filename ??
        this.item.filename ??
        null
      );
    },
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
    openPopup(url) {
      window.open(url, "_blank", "height=800, width=800");
    }
  },
});
</script>

<style scoped>
.link {
  display: inline-block;
  line-height: normal;
  text-decoration: none;
}
</style>
