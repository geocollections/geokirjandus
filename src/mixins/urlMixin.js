import { mapState } from "vuex";

const urlMixin = {
  computed: {
    ...mapState("settings", ["language"])
  },
  methods: {
    setURLParameters(parameters, route = "") {
      let q = Object.fromEntries(
        Object.entries(parameters)
          .filter(([k, v]) => {
            if (!v.hidden) {
              switch (v.type) {
                case "range": {
                  return (isNaN(v.value[0]) && isNaN(v.value[1])) ||
                    (v.value[0] === null && v.value[1] === null)
                    ? false
                    : v.value;
                }
                case "checkbox": {
                  return v.value;
                }
                case "select": {
                  return v.value === null || v.value.length < 1
                    ? false
                    : v.value;
                }
                default: {
                  return v.value;
                }
              }
            }
          })
          .map(([k, v]) => {
            switch (v.type) {
              case "range": {
                const start = isNaN(v.value[0]) ? "" : `${v.value[0]}`;
                const end = isNaN(v.value[1]) ? "" : `${v.value[1]}`;
                return [k, `${start}-${end}`];
              }
              case "checkbox": {
                return [k, v.value];
              }
              case "select": {
                return [k, v.value.join(",")];
              }
              default: {
                return k === "search"
                  ? [k, v.value]
                  : [`${k}_${v.lookUpType}`, v.value];
              }
            }
          })
      );

      q["lang"] = this.language;

      console.log(q);

      return q;
    }
  }
};

export default urlMixin;
