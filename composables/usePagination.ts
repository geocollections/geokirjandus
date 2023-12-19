import { z } from "zod";

export const usePagination = () => {
  const perPageOptions = [10, 25, 50, 100] as const;
  const perPage = ref<(typeof perPageOptions)[number]>(25);
  const page = ref(1);

  const querySchema = z.object({
    page: z
      .string()
      .transform((val) => parseInt(val))
      .refine((val) => val > 0)
      .catch(1),
    perPage: z
      .string()
      .transform((val) => parseInt(val))
      .refine((value): value is (typeof perPageOptions)[number] =>
        perPageOptions.includes(value as (typeof perPageOptions)[number]),
      )
      .catch(perPageOptions[1]),
  });

  const offset = computed(() => {
    return (page.value - 1) * perPage.value;
  });

  // NOTE: USelectMenu does not accept `number[]` so have to transform it
  const perPageMenuOptions = computed(() => {
    return perPageOptions.map((val) => ({
      value: val,
      label: val,
    }));
  });

  return {
    page,
    perPage,
    offset,
    perPageOptions,
    perPageMenuOptions,
    querySchema,
  };
};
