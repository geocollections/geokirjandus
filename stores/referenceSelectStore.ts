export const useReferenceSelectStore = defineStore(
  "referenceSelect",
  () => {
    const selected = ref<string[]>([]);
    return { selected };
  },
  {
    persist: {
      storage: persistedState.sessionStorage,
    },
  },
);
