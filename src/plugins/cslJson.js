import i18n from "@/i18n";

const parseNames = namesStr => {
  const namesSplitByComma = namesStr ? namesStr.split(",") : [];

  const authors = [];

  for (let i = 0; i < namesSplitByComma.length; i += 2) {
    const name = {
      given: namesSplitByComma[i + 1],
      family: namesSplitByComma[i]
    };

    authors.push(name);
  }

  return authors;
};

export default {
  install: (Vue, ...options) => {
    Vue.prototype.$getWebpageCsl = data => {
      const title =
        (i18n.locale === "en"
          ? data.title_short_en ?? data.title_en
          : data.title_short ?? data.title) ?? data.title;
      return {
        id: data.id,
        type: "webpage",
        author: parseNames(data.author_txt),
        issued: [
          {
            "date-parts": [data.year]
          }
        ],
        publisher: i18n.t("common.libraryPublisher"),
        title: title,
        URL: `https://geoloogia.info/library/${data.id}`
      };
    };

    Vue.prototype.$getCsl = data => {
      return {
        type: data.reference_csl_type,
        title: data.title,
        DOI: data.doi,
        author: parseNames(data.author),
        issued: [
          {
            "date-parts": [data.year]
          }
        ],
        "container-title": data.book ?? data.journal_name,
        "original-title": data.title_original,
        editor: data.book_editor ? parseNames(data.book_editor) : null,
        volume: data.volume,
        number: data.number,
        publisher: data.publisher,
        abstract: data.abstract,
        "publisher-place": data.publisher_place,
        page: data.pages,
        URL: data.url
      };
    };

    Vue.prototype.$getCslDetail = data => {
      return {
        type: data.type.csl_type,
        title: data.title,
        DOI: data.doi,
        author: parseNames(data.author),
        issued: [
          {
            "date-parts": [data.year]
          }
        ],
        "container-title": data.journal?.journal_name ?? null,
        "original-title": data.title_original,
        editor: data.book_editor ? parseNames(data.book_editor) : null,
        volume: data.volume,
        number: data.number,
        publisher: data.publisher,
        abstract: data.abstract,
        "publisher-place": data.publisher_place,
        page: data.pages,
        URL: data.url
      };
    };
  }
};
