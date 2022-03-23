<template>
  <v-navigation-drawer
    app
    clipped
    right
    temporary
    :value="show"
    :style="`z-index: 2050; margin-top: ${$vuetify.application.top}px`"
    @input="$emit('update:navigationDrawer', $event)"
  >
    <v-container>
      <div class="font-family-exo-2 font-weight-medium pl-2 mt-2">
        {{ $t("common.links") }}
      </div>
      <v-divider />
      <v-list class="py-1 px-2">
        <v-list-item class="header-menu-item pa-0 my-1">
          <emaapou-button
            black
            withText
            style="height: 48px;color: rgb(0, 0, 0, 0.87);width: 100%"
          />
        </v-list-item>
        <v-list-item
          v-for="(link, idx) in links"
          :key="idx"
          :href="link.url"
          target="_blank"
          class="header-menu-item rounded my-1"
        >
          <v-list-item-title class="font-family-exo-2">{{
            $t(link.name)
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <div class="font-family-exo-2 font-weight-medium pl-2 mt-2">
        {{ $t("common.language") }}
      </div>
      <v-divider />
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
    </v-container>
  </v-navigation-drawer>
</template>

<script>
import { mapActions, mapState } from "vuex";
import toastMixin from "../mixins/toastMixin";
import EmaapouButton from "./EmaapouButton.vue";

export default {
  name: "AppNavigationMobile",
  mixins: [toastMixin],
  components: { EmaapouButton },
  props: {
    show: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      links: [
        { name: "link.geocollections", url: "https://geocollections.info" },
        { name: "link.fossiilid", url: "https://fossiilid.info" },
        { name: "link.kivid", url: "https://kivid.info" },
        { name: "link.sarvAPI", url: "https://api.geocollections.info" },
        { name: "link.sarvDOI", url: "https://doi.geocollections.info" },
        {
          name: "link.sarvEdit",
          url: "https://edit2.geocollections.info"
        },
        { name: "link.egt", url: "https://fond.egt.ee/fond" },
        { name: "link.natarc", url: "https://natarc.ut.ee" }
      ],
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
