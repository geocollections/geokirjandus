<template>
  <div>
    <v-slide-y-transition :hide-on-leave="true">
      <div key="1" v-if="showMore" v-html="htmlStr" />
      <div key="2" v-else v-html="blurb" />
    </v-slide-y-transition>
    <v-btn
      class="mt-2"
      text
      rounded
      color="#135ebf"
      @click="showMore = !showMore"
      x-small
      >{{ !showMore ? $t("common.showMore") : $t("common.showLess") }}</v-btn
    >
  </div>
</template>

<script>
export default {
  name: "ReadMore",
  props: {
    htmlStr: String
  },
  data() {
    return {
      showMore: false
    };
  },
  computed: {
    blurb() {
      const div = document.createElement("div");
      div.innerHTML = this.htmlStr;
      const firstP = div.querySelector("p");
      firstP.className = "text-truncate";
      const text = firstP.textContent;
      const match = text.match(/(\S+\s*){0,100}/);
      return match[0] + "...";
    }
  }
};
</script>

<style scoped></style>
