<template>
  <v-fade-transition>
    <v-card flat color="transparent" v-if="statisticsData">
      <div>
        <v-card-text
          class="text-h6 pt-0 d-flex justify-center"
          v-html="$t('charts.title_html', { num: statisticsData.count })"
        >
        </v-card-text>
        <v-row justify="space-around">
          <v-col cols="12" sm="6" md="auto">
            <div class="text-h6 text-center pb-3">
              {{ $t("charts.keywords") }}
            </div>
            <bar-chart
              id="keywords"
              class="d-flex justify-center"
              :chartData="getKeywordsChartData"
              :options="getKeywordsChartOptions(handleKeywordClick)"
              :locale="$i18n.locale"
            />
          </v-col>
          <v-divider class="mt-8" vertical />
          <v-col cols="12" sm="6" md="auto">
            <div class="text-h6 text-center pb-3">
              {{ $t("charts.byDecade") }}
            </div>
            <bar-chart
              id="byDecade"
              class="d-flex justify-center"
              :chartData="getDecadesChartData"
              :options="getDecadesChartOptions(handleDecadeClick)"
              :locale="$i18n.locale"
            />
          </v-col>
          <v-divider class="mt-8" vertical />
          <v-col cols="12" sm="6" md="auto">
            <div class="text-h6 text-center pb-3">{{ $t("charts.types") }}</div>
            <pie-chart
              class="d-flex justify-center"
              :chartData="getTypesChartData"
              :options="getChartOptions('pie', handleTypeClick)"
              :locale="$i18n.locale"
            ></pie-chart>
          </v-col>
          <!-- <v-col cols="12" sm="6" md="3">
            <h3 class="text-center pb-3">{{ $t("charts.language") }}</h3>
            <pie-chart
              class="d-flex justify-center"
              :chartData="getLanguageChartData"
              :options="getChartOptions('pie', handleLanguageClick)"
              :locale="$i18n.locale"
            ></pie-chart>
          </v-col> -->
        </v-row>
      </div>
    </v-card>
  </v-fade-transition>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";
import { cloneDeep } from "lodash";
export default {
  name: "Statistics",
  components: { PieChart, BarChart },
  data() {
    return {
      statisticsData: null,
      barChartOptions: {
        scales: {
          xAxes: [
            {
              type: "linear",
              ticks: {
                autoSkip: true,
                min: 0,
                display: false
              },

              gridLines: false
            }
          ],
          yAxes: [
            {
              ticks: {
                padding: 10,
                display: false
              },
              gridLines: false
            }
          ]
        },
        legend: {
          display: false
        },
        plugins: {
          colorschemes: {
            scheme: "tableau.Orange20"
          },
          datalabels: {
            formatter: function(value, context) {
              return context.chart.data.labels[context.dataIndex];
            },
            // rotation: 270,
            align: "end",
            anchor: "end"
          }
        }
      },
      pieChartOptions: {
        legend: {
          display: false
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItems, data) {
              return `${data.labels[tooltipItems.index].name} : ${
                data.datasets[tooltipItems.datasetIndex].data[
                  tooltipItems.index
                ]
              }`;
            }
          }
        },
        plugins: {
          datalabels: {
            formatter: function(value, context) {
              if (value > 99)
                return context.chart.data.labels[context.dataIndex].name;
              else return "";
            },
            display: "auto"
          },
          colorschemes: {
            scheme: "tableau.Orange20"
          }
        }
      },
      lineChartOptions: {
        title: {
          display: true,
          text: null
        },
        responsive: false,
        maintainAspectRatio: false,
        legend: {
          display: false
        },
        plugins: {
          colorschemes: {
            scheme: "tableau.Orange20"
          }
        }
      }
    };
  },
  computed: {
    getTypesChartData() {
      let data = {};

      let labels = [];
      let values = [];

      const fields = this.statisticsData.facet_counts.facet_fields.type;
      const pivot = this.statisticsData.facet_counts.facet_pivot[
        "type,reference_type,reference_type_en"
      ];
      for (let i = 0; i < fields.length; i += 2) {
        if (this.$i18n.locale === "ee") {
          labels.push({
            id: fields[i],
            name: pivot.find(o => o.value.toString() === fields[i]).pivot[0]
              .value
          });
        } else {
          labels.push({
            id: fields[i],
            name: pivot.find(o => o.value.toString() === fields[i]).pivot[0]
              .pivot[0].value
          });
        }
        values.push(fields[i + 1]);
      }
      data.labels = labels;
      data.datasets = [{ data: values }];

      return data;
    },
    getLanguageChartData() {
      let data = {};

      let labels = [];
      let values = [];

      const fields = this.statisticsData.facet_counts.facet_fields.language;
      const pivot = this.statisticsData.facet_counts.facet_pivot[
        "language,reference_language,reference_language_en"
      ];
      for (let i = 0; i < fields.length; i += 2) {
        if (this.$i18n.locale === "ee") {
          labels.push({
            id: fields[i],
            name: pivot.find(o => o.value === fields[i]).pivot[0].value
          });
        } else {
          labels.push({
            id: fields[i],
            name: pivot.find(o => o.value === fields[i]).pivot[0].pivot[0].value
          });
        }

        values.push(fields[i + 1]);
      }
      data.labels = labels;
      data.datasets = [{ data: values, borderWidth: 1 }];

      return data;
    },
    getDecadesChartData() {
      let data = {};

      let labels = [];
      let values = [];

      for (
        let i = 0;
        i <
        this.statisticsData.facet_counts.facet_ranges.year_numeric.counts
          .length;
        i += 2
      ) {
        labels.push(
          this.statisticsData.facet_counts.facet_ranges.year_numeric.counts[i]
        );
        values.push(
          this.statisticsData.facet_counts.facet_ranges.year_numeric.counts[
            i + 1
          ]
        );
      }
      data.labels = labels;
      data.datasets = [
        {
          data: values,
          borderWidth: 1
        }
      ];

      return data;
    },
    getKeywordsChartData() {
      let data = {};

      let labels = [];
      let values = [];

      Object.entries(this.statisticsData.facet_counts.facet_queries).forEach(
        ([k, v]) => {
          labels.push(k.substring(k.indexOf("*") + 1, k.lastIndexOf("*")));
          values.push(v);
        }
      );

      data.labels = labels;
      data.datasets = [{ data: values }];
      return data;
    }
  },
  created() {
    this.getStatisticsData();
  },
  methods: {
    ...mapActions("search/reference", ["resetSearch", "updateAdvancedSearch"]),

    getKeywordsChartOptions(onClick) {
      let options = cloneDeep(this.getChartOptions("bar", onClick));

      options.scales.xAxes[0].ticks.max = 7000;

      return options;
    },
    getDecadesChartOptions(onClick) {
      let options = cloneDeep(this.getChartOptions("bar", onClick));

      options.scales.xAxes[0].ticks.max = 4000;

      return options;
    },
    getChartOptions(type, onClick = null) {
      if (type === "bar") {
        return {
          ...this.barChartOptions,
          onClick: onClick
        };
      } else if (type === "pie") {
        return {
          ...this.pieChartOptions,
          onClick: onClick
        };
      } else if (type === "line") {
        return {
          ...this.lineChartOptions,
          onClick: onClick
        };
      }
      return {};
    },
    handleDecadeClick(point, e) {
      if (e.length < 1) return;
      const decade = this.getDecadesChartData.labels[e[0]._index];

      this.resetSearch();
      this.updateAdvancedSearch({
        id: "year",
        value: [parseInt(decade), parseInt(decade) + 9]
      });
      this.$router.push({ name: "searchReference" });
    },
    handleKeywordClick(point, e) {
      if (e.length < 1) return;
      const keyword = this.getKeywordsChartData.labels[e[0]._index];

      this.resetSearch();
      this.updateAdvancedSearch({
        id: "keywords",
        value: keyword
      });
      this.$router.push({ name: "searchReference" });
    },
    handleTypeClick(point, e) {
      if (e.length < 1) return;
      const type = this.getTypesChartData.labels[e[0]._index];

      this.resetSearch();

      this.updateAdvancedSearch({
        id: "type",
        value: [type.id]
      });

      this.$router.push({ name: "searchReference" });
    },
    handleLanguageClick(point, e) {
      if (e.length < 1) return;
      const language = this.getLanguageChartData.labels[e[0]._index];

      this.resetSearch();

      this.updateAdvancedSearch({
        id: "language",
        value: [language.id]
      });

      this.$router.push({ name: "searchReference" });
    },

    getStatisticsData() {
      axios
        .get(
          "https://api.geocollections.info/solr/reference/" +
            "?q=*&rows=1&fq=is_estonian_reference:1" +
            "&facet=on&facet.query=keywords%3A*alusp%C3%B5hjageoloogia*&facet.query=keywords%3A*paleontoloogia*&facet.query=keywords%3A*kvaternaarigeoloogia*&facet.query=keywords%3A*maavarad*&facet.query=keywords%3A*h%C3%BCdrogeoloogia*&facet.query=keywords:*ehitusgeoloogia*&facet.query=keywords:*m%C3%A4endus*&facet.query=keywords:*personaalia*&facet.query=keywords:*kroonika*" +
            "&facet.field=language&facet.mincount=1&facet.field=type" +
            "&facet.range=year_numeric&f.year_numeric.facet.range.start=1820&f.year_numeric.facet.range.end=2021&f.year_numeric.facet.range.gap=10&f.year_numeric.facet.range.other=before&f.year_numeric.facet.range.other=after" +
            "&facet.pivot={!ex=type}type,reference_type,reference_type_en&f.type.facet.pivot.mincount=1" +
            "&facet.field={!ex=dt}language&facet.pivot={!ex=type}language,reference_language,reference_language_en&f.language.facet.mincount=1"
        )
        .then(res => {
          this.statisticsData = res.data;
        });
    }
  }
};
</script>

<style scoped></style>
