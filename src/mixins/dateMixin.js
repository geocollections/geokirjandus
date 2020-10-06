const dateMixin = {
  computed: {
    getDateLocale() {
      if (this.$i18n.locale === "ee") {
        return "et-EE";
      } else {
        return "en-GB";
      }
    }
  },
  methods: {
    formatDate(date) {
      return date
        ? new Date(date).toLocaleString(this.getDateLocale, {
            dateStyle: "medium"
          })
        : null;
    }
  }
};

export default dateMixin;
