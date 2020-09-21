<template>
  <div class="lang-buttons pa-2">
    <v-btn
        text
        :dark="isDark"
        @click="changeLang('ee')"
        large
        class="font-weight-bold"
    >
      EST <span class="flag flag-ee flag-squared flag-circle ml-1"></span>
    </v-btn>
    <v-btn
        text
        :dark="isDark"
        @click="changeLang('en')"
        large
        class="font-weight-bold"
    >
      ENG<span class="flag flag-en flag-squared flag-circle ml-1"></span>
    </v-btn>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
// import toastMixin from "../../mixins/toastMixin";

export default {
  name: "lang-buttons",
  props: {
    isDark: {
      type: Boolean,
      default: true
    }
  },
  // mixins: [toastMixin],
  computed: {
    ...mapState("settings", ["language"])
  },
  methods: {
    ...mapActions("settings", ["updateLanguage"]),

    changeLang(newLang) {
      if (this.lang === newLang) return;
      this.$i18n.locale = newLang;
      // this.$moment.locale(newLang === "ee" ? "et" : "en");
      this.updateLanguage(newLang);
      // this.toastInfo({ text: this.$t("messages.langChange") });
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
