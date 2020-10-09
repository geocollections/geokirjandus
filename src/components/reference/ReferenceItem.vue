<template>
  <div class="referenceItem">
    <div class="pb-1">
      <div>
        <reference-citation :reference="reference" />
      </div>
    </div>

    <reference-citation class="d-none d-print-block" :reference="reference" />
  </div>
</template>

<script>
import ReferenceCitation from "@/components/reference/ReferenceCitation";
export default {
  name: "ReferenceItem",
  components: { ReferenceCitation },
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
