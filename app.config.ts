export default defineAppConfig({
  nuxtIcon: {},
  ui: {
    primary: "carrot-orange",

    button: {
      color: {
        black: {
          soft: "text-black dark:text-white bg-stone-200 hover:bg-stone-300 disabled:bg-stone-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:disabled:bg-gray-950 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-carrot-orange-500 dark:focus-visible:ring-carrot-orange-400",
        },
      },
    },
    card: {
      background: "dark:bg-gray-800",
      divide: "dark:divide-gray-700",
      ring: "dark:ring-gray-700",
      header: {
        base: "text-base font-bold ",
        padding: "px-2 py-4 sm:px-4",
      },
    },
  },
});
