const urlMixin = {
  methods: {
    setURLParameters(parameters, page, paginateBy) {
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
                  return k === "isEstonianAuthor" || k === "isEstonianReference"
                    ? false
                    : v.value;
                }
                case "select": {
                  return v.value === null || v.value.length < 1 ? false : v.value;
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
      if (page > 1) {
        q.page = page;
      }
      if (paginateBy !== 50) {
        q.paginateBy = paginateBy;
      }
      this.$router.push({ query: q, path: "/reference" }).catch(() => {});
    }
  }
};

export default urlMixin;
