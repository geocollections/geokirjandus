import { z } from "zod";
import uniq from "lodash/uniq";

export const useReferenceFilters = () => {
  const filters = ref({
    isEstonianReference: false,
    isEstonianAuthor: false,
    pdf: false,
    author: "",
    title: "",
    book: "",
    journal: "",
    publisher: "",
    volumeOrNumber: "",
    localities: "",
    taxa: "",
    year: [undefined, undefined] as (number | undefined)[],
    type: new Set<string>(),
    language: new Set<string>(),
    keywords: [] as string[],
  });

  const booleanSchema = z
    .string()
    .transform((val) => val === "true")
    .catch(false);

  const setSchema = z
    .string()
    .transform((val) => new Set(val.split(",")))
    .catch((_ctx) => new Set());

  const querySchema = z.object({
    isEstonianReference: booleanSchema,
    isEstonianAuthor: booleanSchema,
    pdf: booleanSchema,
    author: z.string().catch(""),
    title: z.string().catch(""),
    book: z.string().catch(""),
    journal: z.string().catch(""),
    publisher: z.string().catch(""),
    volumeOrNumber: z.string().catch(""),
    localities: z.string().catch(""),
    taxa: z.string().catch(""),
    keywords: z
      .string()
      .transform((val) => uniq(val.split(",")))
      .catch([]),
    type: setSchema,
    language: setSchema,
    year: z
      .string()
      .transform((val, ctx) => {
        let [startStr, endStr] = val.split("-");
        const start = parseInt(startStr) || undefined;
        const end = parseInt(endStr) || undefined;

        if (start && end && start > end) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Start cannot be larger than end",
          });
          return z.NEVER;
        }

        return [start, end];
      })
      .catch([undefined, undefined]),
  });

  const activeFiltersCount = computed(() => {
    return Object.values(filters.value).filter((val) => {
      if (typeof val === "string") return val.length > 0;
      if (typeof val === "boolean") return val;
      if (val instanceof Set) return !!val.size;
      if (Array.isArray(val)) {
        return val.length > 0 && !val.every((v) => v === undefined);
      }
      return false;
    }).length;
  });

  function resetFilters() {
    filters.value.isEstonianReference = false;
    filters.value.isEstonianAuthor = false;
    filters.value.pdf = false;
    filters.value.title = "";
    filters.value.author = "";
    filters.value.book = "";
    filters.value.journal = "";
    filters.value.publisher = "";
    filters.value.volumeOrNumber = "";
    filters.value.localities = "";
    filters.value.taxa = "";
    filters.value.year = [undefined, undefined];
    filters.value.type.clear();
    filters.value.language.clear();
    filters.value.keywords = [];
  }

  const solrFilters = computed(() => {
    const res = [];
    if (filters.value.isEstonianReference) {
      res.push("is_estonian_reference:true");
    }
    if (filters.value.isEstonianAuthor) {
      res.push("is_estonian_author:true");
    }
    if (filters.value.pdf) {
      res.push("pdf:*");
    }
    if (filters.value.author.length > 0) {
      res.push(`author:*${filters.value.author}*`);
    }
    if (filters.value.title.length > 0) {
      res.push(`title:*${filters.value.title}*`);
    }
    if (filters.value.year.some((val) => val !== undefined)) {
      const start = filters.value.year[0] ?? "*";
      const end = filters.value.year[1] ?? "*";
      res.push(`year_numeric:[${start} TO ${end}]`);
    }
    if (filters.value.book.length > 0) {
      res.push(`book:*${filters.value.book}*`);
    }
    if (filters.value.journal.length > 0) {
      res.push(`journal_name:*${filters.value.journal}*`);
    }
    if (filters.value.publisher.length > 0) {
      res.push(`publisher:*${filters.value.publisher}*`);
    }
    if (filters.value.taxa.length > 0) {
      res.push(`taxa:"${filters.value.taxa}"`);
    }
    if (filters.value.volumeOrNumber.length > 0) {
      res.push(
        `volume:"${filters.value.volumeOrNumber}" OR number:"${filters.value.volumeOrNumber}"`,
      );
    }
    if (filters.value.localities.length > 0) {
      res.push(
        `localities:"${filters.value.localities}" OR localities_en:"${filters.value.localities}"`,
      );
    }

    if (filters.value.keywords.length > 0) {
      res.push(
        `{!tag=keywords}keywords:(${filters.value.keywords
          .map((val) => `"${val}"`)
          .join(" AND ")})`,
      );
    }
    if (filters.value.type.size > 0) {
      res.push(`{!tag=type}type:(${Array.from(filters.value.type).join(" ")})`);
    }
    if (filters.value.language.size > 0) {
      res.push(
        `{!tag=language}language:(${Array.from(filters.value.language).join(
          " ",
        )})`,
      );
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
