export default defineNuxtPlugin(({ vueApp, $i18n }) => {
  function translate(translations) {
    return $i18n.locale.value === "et" ? translations.et : translations.en;
  }
  return {
    provide: {
      translate,
    },
  };
});
