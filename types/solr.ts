export type SolrResponse<T = any> = {
  response: {
    numFound: number;
    start: number;
    docs: T[];
  };
};

type BucketKeys = { [K: string]: BucketKeys };
type Facet<Keys extends BucketKeys> = {
  [K in keyof Keys]: {
    buckets: Facet<Keys[K]>[];
  };
} & {
  val: string;
  count: number;
};
export type SolrFacets<Keys extends BucketKeys> = {
  facets: {
    [K in keyof Keys]: {
      buckets: Facet<Keys[K]>[];
    } & {
      count: number;
    };
  };
};
