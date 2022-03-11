const mutations = {
  SET_REFERENCE_HEADERS(state, payload) {
    state.referenceHeaders = payload;
  },
  SET_REFERENCE_IN_LIBRARY_HEADERS(state, payload) {
    state.referenceInLibraryHeaders = payload;
  },
  SET_LIBRARY_HEADERS(state, payload) {
    state.libraryHeaders = payload;
  },
  RESET_HEADERS(state, { module, initHeaders }) {
    state[module] = initHeaders;
  }
};

export default mutations;
