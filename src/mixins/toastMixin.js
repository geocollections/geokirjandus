const toastMixin = {
  methods: {
    toastSuccess(data) {
      if (!data.timeout) data.timeout = 5000;
      if (!data.text) data.text = "OK";
      this.$toast.destroy();
      this.$toast.success(data.text, "OK", {
        position: "topCenter",
        timeout: data.timeout,
        pauseOnHover: false
      });
    },

    toastError(data) {
      if (!data.timeout) data.timeout = 5000;
      if (!data.text) data.text = "Error";
      this.$toast.destroy();
      this.$toast.error(data.text, "Error", {
        position: "topCenter",
        timeout: data.timeout,
        closeOnEscape: true,
        pauseOnHover: false,
        displayMode: "replace"
      });
    },

    toastInfo(data) {
      if (!data.timeout) data.timeout = 5000;
      if (!data.text) data.text = "Info";
      this.$toast.destroy();
      this.$toast.info(data.text, "Info", {
        position: "topCenter",
        timeout: data.timeout,
        pauseOnHover: false
      });
    }
  }
};

export default toastMixin;
