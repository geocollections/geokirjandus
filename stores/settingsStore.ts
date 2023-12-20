export const useSettingsStore = defineStore(
  "settings",
  () => {
    const citationStyleOptions = computed(() => [
      { value: "apa", name: "APA" },
      { value: "harvard1", name: "Harvard" },
      { value: "sedimentology", name: "Sedimentology" },
      { value: "geol-mag", name: "Geological magazine" },
      { value: "holocene", name: "Holocene" },
      { value: "nature", name: "Nature" },
      { value: "geology", name: "Geology" },
      { value: "palaeo3", name: "Palaeo3" },
      { value: "ejes", name: "EJES" },
      { value: "gsl", name: "The Geological Society of London" },
    ]);
    const citationStyle = ref(citationStyleOptions.value[0].value);

    const view = ref<"summary" | "compact">("summary");

    return { citationStyle, citationStyleOptions, view };
  },
  {
    persist: {
      paths: ["citationStyle", "view"],
    },
  },
);
