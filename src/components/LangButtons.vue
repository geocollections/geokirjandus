<template>
  <v-menu
    content-class="mt-2"
    transition="slide-y-transition"
    offset-y
    bottom
    right
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        aria-label="select language"
        class="ml-auto d-block rounded mr-1"
        icon
        dark
        :ripple="false"
        v-bind="attrs"
        v-on="on"
      >
        <span :class="classObject" />
      </v-btn>
    </template>
    <v-list class="py-1 px-2">
      <v-list-item
        v-for="(lang, idx) in languages"
        :key="idx"
        class="header-menu-item rounded my-1"
        :class="{ 'header-menu-item-active': language == lang.value }"
        @click="changeLang(lang.value)"
      >
        <v-list-item-title class="d-flex py-1">
          <span
            v-if="lang.value === 'ee'"
            class="flag flag-ee flag-squared flag-circle mr-2 lang-button"
          />
          <span
            v-if="lang.value === 'en'"
            class="flag flag-en flag-squared flag-circle mr-2 lang-button"
          />
          <span class="align-self-center font-family-exo-2">{{
            lang.text
          }}</span>
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import { mapActions, mapState } from "vuex";
import toastMixin from "../mixins/toastMixin";

export default {
  name: "lang-buttons",
  mixins: [toastMixin],
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      languages: [
        { value: "ee", text: "Eesti" },
        { value: "en", text: "English" }
      ]
    };
  },
  computed: {
    ...mapState("settings", ["language"]),
    classObject() {
      return {
        flag: true,
        "flag-en": this.language === "en",
        "flag-ee": this.language === "ee",
        "flag-squared": true,
        "flag-circle": true,
        "lang-button": true
      };
    }
  },
  methods: {
    ...mapActions("settings", ["updateLanguage"]),
    changeLang(newLang) {
      if (this.lang === newLang) return;
      this.$i18n.locale = newLang;
      this.updateLanguage(newLang);
      this.toastInfo({ text: this.$t("messages.langChange") });
    }
  }
};
</script>

<style scoped lang="scss">
.lang-buttons {
  /*text-align: right;*/
  /*position: absolute;*/
  right: 0;
}

.lang-button {
  height: 24px;
  width: 24px !important;
}

.flag {
  position: relative;
  display: inline-block;
  width: 1.33333333em;
  line-height: 1em;
  background-size: cover;
  background-position: 50%;
  background-repeat: no-repeat;
}

.flag:before {
  content: "\A0";
}

.flag-ee {
  background-image: url("../assets/ee.svg");
}

.flag-en {
  background-image: url("../assets/en.svg");
}

.flag-squared {
  width: 1em;
}

.flag-circle {
  border-radius: 100%;
}
</style>
