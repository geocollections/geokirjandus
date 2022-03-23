const actions = {
  setReferenceHeaders({ commit }, payload) {
    commit("SET_REFERENCE_HEADERS", payload);
  },

  setReferenceInLibraryHeaders({ commit }, payload) {
    commit("SET_REFERENCE_IN_LIBRARY_HEADERS", payload);
  },

  setLibraryHeaders({ commit }, payload) {
    commit("SET_LIBRARY_HEADERS", payload);
  },

  async resetHeaders({ commit, dispatch, rootState }, { module, options }) {
    const { initState } = await import(`./index.js`);

    const initHeaders = initState()[module];

    const initHeadersSortHeadersEnabled = initHeaders.map(header => {
      if (options.sortBy.includes(header.value))
        return { ...header, show: true };
      return header;
    });
    console.log(initHeaders, options.sortBy, initHeadersSortHeadersEnabled);
    commit("RESET_HEADERS", {
      module,
      initHeaders: initHeadersSortHeadersEnabled
    });
  }
};

export default actions;
