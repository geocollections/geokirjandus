<template>
  <div class="relative flex h-full w-full">
    <div class="h-full w-1/2">
      <canvas id="myChart"></canvas>
    </div>
    <div class="h-full w-1/2">
      <canvas id="myChart2"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { getRelativePosition } from "chart.js/helpers";
import sortBy from "lodash/sortBy";
const router = useRouter();
const state = reactive({
  categoryChart: null,
  decadesChart: null,
});

const {
  data: statisticsData,
  error,
  refresh,
} = await useFetch(
  "https://api.geoloogia.info/solr/reference" +
    "?q=*&rows=1&fq=is_estonian_reference:1" +
    "&facet=on&facet.query=keywords%3A*alusp%C3%B5hjageoloogia*&facet.query=keywords%3A*paleontoloogia*&facet.query=keywords%3A*kvaternaarigeoloogia*&facet.query=keywords%3A*maavarad*&facet.query=keywords%3A*h%C3%BCdrogeoloogia*&facet.query=keywords:*ehitusgeoloogia*&facet.query=keywords:*m%C3%A4endus*&facet.query=keywords:*personaalia*&facet.query=keywords:*kroonika*" +
    "&facet.field=language&facet.mincount=1&facet.field=type" +
    "&facet.range=year_numeric&f.year_numeric.facet.range.start=1820&f.year_numeric.facet.range.end=2021&f.year_numeric.facet.range.gap=10&f.year_numeric.facet.range.other=before&f.year_numeric.facet.range.other=after" +
    "&facet.pivot={!ex=type}type,reference_type,reference_type_en&f.type.facet.pivot.mincount=1" +
    "&facet.field={!ex=dt}language&facet.pivot={!ex=type}language,reference_language,reference_language_en&f.language.facet.mincount=1",
);
const decadesChartData = computed(() => {
  let data = {};

  let labels = [];
  let values = [];

  for (
    let i = 0;
    i <
    statisticsData.value.facet_counts.facet_ranges.year_numeric.counts.length;
    i += 2
  ) {
    labels.push(
      statisticsData.value.facet_counts.facet_ranges.year_numeric.counts[i],
    );
    values.push(
      statisticsData.value.facet_counts.facet_ranges.year_numeric.counts[i + 1],
    );
  }
  data.labels = labels;
  data.datasets = [
    {
      data: values,
      borderWidth: 1,
    },
  ];

  return data;
});
const keywordsChartData = computed(() => {
  let data = {};

  let labels = [];
  let values = [];

  sortBy(Object.entries(statisticsData.value.facet_counts.facet_queries), [
    ([_k, v]) => -v,
  ]).forEach(([k, v]) => {
    labels.push(k.substring(k.indexOf("*") + 1, k.lastIndexOf("*")));
    values.push(v);
  });

  data.labels = labels;
  data.datasets = [{ data: values }];
  return data;
});

onMounted(async () => {
  const yearsCtx = document.getElementById("myChart");
  state.decadesChart = new Chart(yearsCtx, {
    type: "bar",
    data: {
      labels: decadesChartData.value.labels,
      datasets: decadesChartData.value.datasets,
    },
    plugins: [ChartDataLabels],
    options: {
      onClick: handleDecadeClick,
      onHover: (event, chartElement) => {
        event.native.target.style.cursor = chartElement[0]
          ? "pointer"
          : "default";
      },
      aspectRatio: 1,
      indexAxis: "y",
      layout: {
        padding: {
          right: 5,
        },
      },
      scales: {
        x: {
          type: "linear",
          display: false,
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
          reverse: true,
        },
        y: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
          display: false,
          reverse: true,
        },
      },
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          display: false,
        },
        datalabels: {
          formatter: function (value, context) {
            return context.chart.data.labels[context.dataIndex];
          },
          align: "start",
          anchor: "start",
        },
      },
    },
  });
  const categoriesCTX = document.getElementById("myChart2");
  state.categoryChart = new Chart(categoriesCTX, {
    type: "bar",
    data: {
      labels: keywordsChartData.value.labels,
      datasets: keywordsChartData.value.datasets,
    },
    plugins: [ChartDataLabels],
    options: {
      aspectRatio: 1,
      indexAxis: "y",
      layout: {
        padding: {
          left: 5,
        },
      },
      onClick: handleKeywordClick,
      onHover: (event, chartElement) => {
        event.native.target.style.cursor = chartElement[0]
          ? "pointer"
          : "default";
      },
      scales: {
        x: {
          type: "linear",
          display: false,
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
          display: false,
        },
      },
      plugins: {
        tooltip: {
          enabled: false,
        },
        legend: {
          display: false,
        },
        datalabels: {
          formatter: function (value, context) {
            return context.chart.data.labels[context.dataIndex];
          },
          align: "end",
          anchor: "start",
        },
      },
    },
  });
});
function handleDecadeClick(e) {
  const canvasPosition = getRelativePosition(e, state.decadesChart);

  const dataY = state.decadesChart.scales.y.getValueForPixel(canvasPosition.y);
  const decade = decadesChartData.value.labels[dataY];

  router.push({
    path: "/reference",
    query: {
      year: `${parseInt(decade)}-${parseInt(decade) + 9}`,
      isEstonianReference: false,
    },
  });
}
function handleKeywordClick(e) {
  const canvasPosition = getRelativePosition(e, state.categoryChart);

  const dataY = state.categoryChart.scales.y.getValueForPixel(canvasPosition.y);
  const keyword = keywordsChartData.value.labels[dataY];

  router.push({
    path: "/reference",
    query: { keywords: keyword, isEstonianReference: false },
  });
}
</script>
