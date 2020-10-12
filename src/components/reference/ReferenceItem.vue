<template>
  <div class="referenceItem">
    <div class="pb-1 px-3">
      <reference-citation :reference="reference" />
    </div>
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
