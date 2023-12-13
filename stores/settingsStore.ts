export const useSettingsStore = defineStore(
  "settings",
  () => {
    const citationStyleOptions = computed(() => [
      { value: "apa", name: "APA" },
      { value: "harvard1", name: "Harvard" },
      { value: "sedimentology", name: "Sedimentology" },
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
