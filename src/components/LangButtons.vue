<template>
  <v-menu transition="slide-y-transition" offset-y bottom right>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        aria-label="select language"
        class="ml-auto d-block"
        icon
        dark
        :ripple="false"
        v-bind="attrs"
        v-on="on"
      >
        <span :class="classObject" />
      </v-btn>
    </template>
    <v-list color="#F6EDDF">
      <div v-for="(language, idx) in languages" :key="idx">
        <v-list-item @click="changeLang(language.value)">
          <v-list-item-title class="d-flex ">
            <span
              v-if="language.value === 'ee'"
              class="flag flag-ee flag-squared flag-circle mr-2 lang-button"
            />
            <span
              v-if="language.value === 'en'"
              class="flag flag-en flag-squared flag-circle mr-2 lang-button"
            />
            <span class="align-self-center">{{ language.text }}</span>
          </v-list-item-title>
        </v-list-item>
      </div>
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
        { value: "ee", text: "EST" },
        { value: "en", text: "ENG" }
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

<style scoped>
.lang-buttons {
  /*text-align: right;*/
  /*position: absolute;*/
  right: 0;
}

.lang-button {
  height: 28px;
  width: 28px !important;
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
