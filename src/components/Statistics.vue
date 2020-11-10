<template>
  <div v-if="statisticsData" class="pa-3">
    <v-card-text
      class="d-flex justify-center"
      v-html="$t('charts.title_html', { num: statisticsData.count })"
    >
    </v-card-text>
    <v-row>
      <v-col cols="12" sm="6" md="3">
        <!--   Valdkonnad     -->
        <bar-chart
          :chartdata="getKeywordsChartData"
          :options="
            getChartOptions('bar', $t('charts.keywords'), handleKeywordClick)
          "
          :locale="$i18n.locale"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <bar-chart
          :chartdata="getDecadesChartData"
          :options="
            getChartOptions('bar', $t('charts.byDecade'), handleDecadeClick)
          "
          :locale="$i18n.locale"
        />
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <pie-chart
          :chartdata="getTypesChartData"
          :options="getChartOptions('pie', $t('charts.types'), handleTypeClick)"
          :locale="$i18n.locale"
        ></pie-chart>
      </v-col>
      <v-col cols="12" sm="6" md="3">
        <pie-chart
          :chartdata="getLanguageChartData"
          :options="
            getChartOptions('pie', $t('charts.language'), handleLanguageClick)
          "
          :locale="$i18n.locale"
        ></pie-chart>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
import BarChart from "@/components/charts/BarChart";
import PieChart from "@/components/charts/PieChart";

export default {
  name: "Statistics",
  components: { PieChart, BarChart },
  data() {
    return {
      statisticsData: null,
      barChartOptions: {
        title: {
          display: true,
          text: null
        },
        scales: {
          yAxes: [
            {
              type: "linear",
              ticks: {
                autoSkip: true,
                min: 0
              }
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
            rotation: 90,
            anchor: "end",
            align: "top"
          }
        }
      },
      pieChartOptions: {
        title: {
          display: true,
          text: null
        },
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
      data.datasets = [{ data: values }];

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
    ...mapActions("search", ["resetSearch", "updateAdvancedSearch"]),
    getChartOptions(type, title, onClick = null) {
      if (type === "bar") {
        return {
          ...this.barChartOptions,
          title: { ...this.barChartOptions.title, text: title },
          onClick: onClick
        };
      } else if (type === "pie") {
        return {
          ...this.pieChartOptions,
          title: { ...this.pieChartOptions.title, text: title },
          onClick: onClick
        };
      } else if (type === "line") {
        return {
          ...this.lineChartOptions,
          title: { ...this.lineChartOptions.title, text: title },
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
        id: "referenceType",
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
            "&facet.pivot={!ex=type}type,reference_type,reference_type_en&f.type.facet.pivot.mincount=0" +
            "&facet.field={!ex=dt}language&facet.pivot={!ex=type}language,reference_language,reference_language_en&f.language.facet.mincount=0"
        )
        .then(res => {
          this.statisticsData = res.data;
        });
    }
  }
};
</script>

<style scoped></style>
