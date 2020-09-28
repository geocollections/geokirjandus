<template>
  <div v-if="data.length > 0">
    <div v-for="(entity, index) in data" :key="entity.id">
      <v-divider v-if="index !== 0" />
      <reference-item class="my-2" :reference="entity"></reference-item>
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
  name: "ReferenceListView"
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
