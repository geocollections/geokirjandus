import { asSitemapUrl, defineSitemapEventHandler } from "#imports";

export default defineSitemapEventHandler(async () => {
  const referenceCount = await $fetch<{
    response: { numFound: number };
  }>("https://api.geoloogia.info/solr/reference", {
    query: { fl: "id", rows: 0, q: "*" },
  });

  const referenceRes = await $fetch<{
    response: { docs: { id: string; date_changed: string }[] };
  }>("https://api.geoloogia.info/solr/reference", {
    query: {
      fl: "id,date_changed",
      rows: referenceCount.response.numFound,
      q: "*",
    },
  });

  const libraryCount = await $fetch<{
    response: { numFound: number };
  }>("https://api.geoloogia.info/solr/library", {
    query: { fl: "id", rows: 0, q: "*" },
  });

  const libraryRes = await $fetch<{
    response: { docs: { id: string; date_changed: string }[] };
  }>("https://api.geoloogia.info/solr/library", {
    query: {
      fl: "id,date_changed",
      rows: libraryCount.response.numFound,
      q: "*",
    },
  });
  return [
    ...referenceRes.response.docs.map((p) =>
      asSitemapUrl({
        loc: `/reference/${p.id}`,
        lastmod: p.date_changed,
        _i18nTransform: true,
      }),
    ),
    ...libraryRes.response.docs.map((p) =>
      asSitemapUrl({
        loc: `/library/${p.id}`,
        lastmod: p.date_changed,
        _i18nTransform: true,
      }),
    ),
  ];
});
