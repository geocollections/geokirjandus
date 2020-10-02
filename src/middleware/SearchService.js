import axios from "axios";

const API_URL = "https://api.geocollections.info/solr";
const FACET_QUERY =
  "q=*&rows=0&facet=on&facet.mincount=1&facet.field=recordbasis&facet.field=highertaxon&facet.field=type_status&facet.field=country&facet.field=datasetowner&facet.field=providername&facet.field=providername&facet.field=providercountry";

class SearchService {
  static async search(searchParams, table) {
    try {
      let start = (searchParams.page - 1) * searchParams.paginateBy;
      let sort = buildSort(searchParams.sortBy, searchParams.sortDesc);
      let searchFields = buildSearchFieldsQuery(
        searchParams.search,
        searchParams.advancedSearch ?? {}
      );
      let url = `${API_URL}/${table}/`;

      let urlParameters = ["defType=edismax"];
      if (searchParams.page) {
        urlParameters.push(`start=${start}`);
      }
      if (searchParams.paginateBy) {
        urlParameters.push(`rows=${searchParams.paginateBy}`);
      }
      if (searchParams.sortBy && searchParams.sortDesc) {
        urlParameters.push(`sort=${sort}`);
      }

      urlParameters.push(searchFields);

      url = `${url}?${urlParameters.join("&")}`;
      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async getDetailView(id, table) {
    try {
      let url = `${API_URL}/${table}/?q=id:${decodeURIComponent(id)}`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      throw new Error(err);
    }
  }

  static async getFacets() {
    try {
      let url = `${API_URL}?${FACET_QUERY}`;

      const res = await axios.get(url);
      return res.data;
    } catch (err) {
      throw new Error(err);
    }
  }
}

function buildSort(sortBy, sortDesc) {
  let sort = "";
  if (sortBy && sortDesc && sortBy.length > 0 && sortDesc.length > 0) {
    sortBy.forEach((field, index) => {
      sort += field + (sortDesc[index] ? " desc" : " asc") + ",";
    });

    if (sort.length > 0) sort = sort.substring(0, sort.length - 1);
  }
  return sort;
}

function buildSearchFieldsQuery(search, advancedSearch) {
  const searchStr = search.value ? `q=${search.value}` : "q=*";

  const advancedSearchStr = Object.entries(advancedSearch).reduce(
    (prev, [k, v]) => {
      const param = v.fields.reduce((prev, curr, idx) => {
        function buildStr(encodedObject) {
          let encodedValue;

          if (v.type === "range") {
            encodedValue = v.value.map(el => {
              return encodeURIComponent(el);
            });
          } else encodedValue = encodeURIComponent(v.value);
          if (curr === "q") encodedObject = encodedObject.substring(1, 3);
          if (v.type === "checkbox") {
            if (curr === "highertaxon_checkbox")
              encodedObject = "fq=highertaxon:";
            encodedValue = encodedValue.replace(/%2C/g, " OR ");
            encodedObject += encodedValue;
          } else {
            if (v.lookUpType === "") encodedObject += encodedValue;
            else if (v.lookUpType === "contains")
              encodedObject += `*${encodedValue}*`;
            else if (v.lookUpType === "equals")
              encodedObject += `"${encodedValue}"`;
            else if (v.lookUpType === "range") {
              const start = isNaN(parseInt(encodedValue[0]))
                ? "*"
                : encodedValue[0];
              const end = isNaN(parseInt(encodedValue[1]))
                ? "*"
                : encodedValue[1];
              encodedObject += `[${start} TO ${end}]`;
            } else if (v.lookUpType === "startsWith")
              encodedObject += `${encodedValue}*`;
            else if (v.lookUpType === "endsWith")
              encodedObject += `*${encodedValue}`;
            else if (v.lookUpType === "notContains")
              encodedObject = `-${curr}:*${encodedValue}*`;
            else if (v.lookUpType === "greater than")
              encodedObject += `[${encodedValue} TO *]`;
            else if (v.lookUpType === "smaller than")
              encodedObject += `[* TO ${encodedValue}]`;
          }
          return encodedObject;
        }
        if (idx === 0) {
          if (v.type === "range") {
            if (isNaN(v.value[0]) && isNaN(v.value[1])) {
              return `${prev}`;
            }
            let encodedObject = `${curr}:`;
            encodedObject = buildStr(encodedObject);

            return `${prev}${encodedObject}`;
          } else if (v.value && v.value.trim().length > 0) {
            let encodedObject = `${curr}:`;
            encodedObject = buildStr(encodedObject);
            return `${prev}${encodedObject}`;
          }
          return `${prev}`;
        }
        if (v.type === "text" && v.value && v.value.trim().length > 0) {
          let encodedObject = ` OR ${curr}:`;
          encodedObject = buildStr(encodedObject);
          return `${prev}${encodedObject}`;
        }
        return `${prev}`;
      }, "");

      if (param.length > 0) {
        if (prev.length > 0) {
          return `${prev}&fq=${param}`;
        }

        return `${prev}fq=${param}`;
      }
      return `${prev}`;
    },
    ""
  );
  return advancedSearchStr.length > 0
    ? encodeURIComponent(`${searchStr}&${advancedSearchStr}`)
    : encodeURIComponent(searchStr);
}

export default SearchService;
