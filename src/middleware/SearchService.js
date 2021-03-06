import axios from "axios";

const API_URL = "https://api.geocollections.info/solr";
const FACET_QUERY_REFERENCE =
  "facet=on&facet.field={!ex=dt}type&facet.pivot={!ex=type}type,reference_type,reference_type_en&f.type.facet.pivot.mincount=0&" +
  "facet.field={!ex=dt}language&facet.pivot={!ex=type}language,reference_language,reference_language_en&f.language.facet.mincount=0";

class SearchService {
  static async search(parameters, table) {
    try {
      let start = (parameters.page - 1) * parameters.paginateBy;
      let sort = buildSort(parameters.sortBy, parameters.sortDesc);
      let searchFields = buildQueryStr(
        parameters.search,
        parameters.advancedSearch ?? {}
      );
      let url = `${API_URL}/${table}/`;

      let urlParameters = [];

      if (table === "reference") urlParameters.push(FACET_QUERY_REFERENCE);

      if (parameters.page) urlParameters.push(`start=${start}`);

      if (parameters.paginateBy)
        urlParameters.push(`rows=${parameters.paginateBy}`);

      if (parameters.sortBy && parameters.sortDesc)
        urlParameters.push(`sort=${sort}`);

      if (parameters.fields)
        urlParameters.push(`fl=${parameters.fields.join(" ")}`);

      urlParameters.push(searchFields);

      url = `${url}?${urlParameters.join("&")}`;

      const res = await axios.get(url);

      return res.data;
    } catch (err) {
      console.error(err);
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

function buildQueryStr(queryObject, filterQueryObject) {
  let queryStr = "q=*";

  if (queryObject && queryObject.value) {
    if (queryObject.lookUpType === "contains") {
      queryStr = `q={!tag=type}*${encodeURIComponent(queryObject.value)}*`;
    } else {
      queryStr = `q={!tag=type}${encodeURIComponent(queryObject.value)}`;
    }
  }

  const filterQueryStr = Object.entries(filterQueryObject)
    .filter(([_, v]) => {
      if (v.type === "range" && isNaN(v.value[0]) && isNaN(v.value[1]))
        return false;
      if (v.type === "text" && (!v.value || v.value.trim().length <= 0))
        return false;
      if (v.type === "select" && (v.value === null || v.value.length < 1))
        return false;
      return v.value !== null;
    })
    .reduce((prev, [k, v]) => {
      const filterQueryParam = v.fields.reduce((prev, curr, idx) => {
        function buildEncodedParameterStr(searchParameter, fieldId) {
          function buildTextParameter(encodedValue, fieldId) {
            let textArray = encodedValue.split(" ");

            const paramArray = textArray.map(str => {
              // TODO: Use a more general field to check if parameter is of certain type
              // Author is of type lowercase in Solr reference schema and has to be processed differently
              if (searchParameter.id === "author") {
                return `*${str.trim()}*`;
              }
              if (searchParameter.id === "keywords") {
                return `*${str.trim()}*`;
              }
              if (searchParameter.id === "volumeAndNumber") {
                return `"${str.trim()}"`;
              }
              return `"*${str.trim()}*"`;
            });

            return `${fieldId}:(${paramArray.join(" AND ")})`;
            // switch (searchParameter.lookUpType) {
            //   case "contains":
            //     return `${fieldId}:*${encodedValue}*`;
            //   case "equals":
            //     return `${fieldId}:"${encodedValue}"`;
            //   case "startsWith":
            //     return `${fieldId}:${encodedValue}*`;
            //   case "endsWith":
            //     return `${fieldId}:*${encodedValue}`;
            //   case "notContains":
            //     return `-${fieldId}:*${encodedValue}*`;
            //   default:
            //     return `${fieldId}:${encodedValue}`;
            // }
          }

          switch (searchParameter.type) {
            case "range": {
              const encodedValue = searchParameter.value.map(el => {
                return encodeURIComponent(el);
              });

              const start = isNaN(parseInt(encodedValue[0]))
                ? "*"
                : encodedValue[0];
              const end = isNaN(parseInt(encodedValue[1]))
                ? "*"
                : encodedValue[1];
              return `${fieldId}:[${start} TO ${end}]`;
            }
            case "checkbox": {
              const encodedValue = encodeURIComponent(searchParameter.value);
              return `${fieldId}:${encodedValue}`;
            }
            case "select": {
              return `${fieldId}:(${encodeURIComponent(
                searchParameter.value.join(" ")
              )})`;
            }
            case "raw": {
              return `${fieldId}:${encodeURIComponent(searchParameter.value)}`;
            }
            case "text": {
              return encodeURIComponent(
                buildTextParameter(searchParameter.value, fieldId)
              );
            }
            default:
              return null;
          }
        }

        if (idx === 0)
          return `${prev}${buildEncodedParameterStr(v, curr) ?? ""}`;
        else return `${prev} OR ${buildEncodedParameterStr(v, curr) ?? ""}`;
      }, "");

      let tag = "{!tag=type}";
      if (v.id === "referenceType") {
        tag = "{!tag=type,dt}";
      }

      if (v.id === "language") {
        tag = "{!tag=type,dt}";
      }

      if (filterQueryParam === null) return `${prev}`;
      if (prev.length > 0) return `${prev}&fq=${tag}${filterQueryParam}`;
      return `${prev}fq=${tag}${filterQueryParam}`;
    }, "");
  return filterQueryStr.length > 0
    ? encodeURIComponent(`${queryStr}&${filterQueryStr}`)
    : encodeURIComponent(queryStr);
}

export default SearchService;
