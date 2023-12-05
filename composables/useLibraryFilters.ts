import { z } from "zod";

export const useLibraryFilters = () => {
  const { locale } = useI18n();

  const filters = ref({
    year: [null, null] as (number | null)[],
    author: "",
    title: "",
  });

  const querySchema = z.object({
    year: z
      .string()
      .transform((val, ctx) => {
        let [startStr, endStr] = val.split("-");
        const start = parseInt(startStr) || null;
        const end = parseInt(endStr) || null;

        if (start && end && start > end) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Start year cannot be later than end year",
          });
          return z.NEVER;
        }

        return [start, end];
      })
      .catch([null, null]),
    author: z.string().catch(""),
    title: z.string().catch(""),
  });

  const activeFiltersCount = computed(() => {
    return Object.values(filters).filter((val) => {
      if (typeof val === "string") return val.length > 0;
      if (typeof val === "boolean") return val;
      if (val instanceof Set) return val.size;
      if (Array.isArray(val)) return !val.every((v) => v === null);
    }).length;
  });

  function resetFilters() {
    filters.value.year = [null, null];
    filters.value.author = "";
    filters.value.title = "";
  }

  const solrFilters = computed(() => {
    const res = [];
    if (filters.value.year.some((val) => val !== null)) {
      const start = filters.value.year[0] ?? "*";
      const end = filters.value.year[1] ?? "*";
      res.push(`year:[${start} TO ${end}]`);
    }
    if (filters.value.author.length > 0) {
      res.push(`author:*${filters.value.author}*`);
    }
    if (filters.value.title.length > 0) {
      if (locale.value === "et") {
        res.push(`title:*${filters.value.title}*`);
      } else {
        res.push(`title_en:*${filters.value.title}*`);
      }
    }

    return res;
  });
  return {
    filters,
    activeFiltersCount,
    solrFilters,
    resetFilters,
    querySchema,
  };
};
