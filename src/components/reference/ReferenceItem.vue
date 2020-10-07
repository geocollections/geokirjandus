<template>
  <div class="referenceItem">
    <div class="pb-1">
      <router-link
        class="d-print-none"
        :to="{ path: '/reference/' + reference.id }"
        :title="$t('reference.viewReference')"
      >
        <span v-html="citation" />
      </router-link>
      <reference-links :item="reference" />
    </div>

    <div class="d-none d-print-block" v-html="citation"></div>
  </div>
</template>

<script>
import ReferenceLinks from "@/components/reference/ReferenceLinks";
export default {
  name: "ReferenceItem",
  components: { ReferenceLinks },
  props: {
    reference: {
      type: Object,
      required: true
    },
    citation: {
      type: String
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
