export default function ({
  query,
  page,
  perPage,
  sort,
  filters,
}: {
  query: string;
  page: number;
  perPage: number;
  sort: string;
  filters: { [K: string]: any };
}) {
  const queryParams: { [K: string]: any } = {
    page: page,
    perPage: perPage,
    sort: sort,
  };
  if (query.length > 0) {
    queryParams.q = query;
  }
  if (filters.isEstonianReference) {
    queryParams.isEstonianReference = filters.isEstonianReference.toString();
  }
  if (filters.isEstonianAuthor) {
    queryParams.isEstonianAuthor = filters.isEstonianAuthor.toString();
  }
  if (filters.title.length > 0) {
    queryParams.title = filters.title;
  }
  if (filters.book.length > 0) {
    queryParams.book = filters.book;
  }
  if (filters.journal.length > 0) {
    queryParams.journal = filters.journal;
  }
  if (filters.publisher.length > 0) {
    queryParams.publisher = filters.publisher;
  }
  if (filters.volumeOrNumber.length > 0) {
    queryParams.volumeOrNumber = filters.volumeOrNumber;
  }
  if (filters.localities.length > 0) {
    queryParams.localities = filters.localities;
  }
  if (filters.taxa.length > 0) {
    queryParams.taxa = filters.taxa;
  }
  if (filters.type.size > 0) {
    queryParams.type = Array.from(filters.type).join(",");
  }
  if (filters.language.size > 0) {
    queryParams.language = Array.from(filters.language).join(",");
  }

  if (filters.keywords.size > 0) {
    queryParams.keywords = Array.from(filters.keywords).join(",");
  }

  if (filters.year.some((val) => val !== null)) {
    const start = filters.year[0] ?? "*";
    const end = filters.year[1] ?? "*";

    queryParams.year = `${start}-${end}`;
  }
  return queryParams;
}
