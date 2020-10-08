<template>
  <div class="referenceItem">
    <div class="pb-1">
      <router-link
        class="d-print-none"
        :to="{ path: '/reference/' + reference.id }"
        :title="$t('reference.viewReference')"
      >
        <reference-citation :reference="reference" />
      </router-link>
      <reference-links :item="reference" />
    </div>

    <reference-citation class="d-none d-print-block" :reference="reference" />
  </div>
</template>

<script>
import ReferenceLinks from "@/components/reference/ReferenceLinks";
import ReferenceCitation from "@/components/reference/ReferenceCitation";
export default {
  name: "ReferenceItem",
  components: { ReferenceCitation, ReferenceLinks },
  props: {
    reference: {
      type: Object,
      required: true
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
