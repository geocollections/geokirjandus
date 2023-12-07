<template>
  <div class="relative h-full w-full lg:flex">
    <div class="h-full w-full lg:w-1/2">
      <canvas id="myChart"></canvas>
    </div>
    <div class="h-full w-full lg:w-1/2">
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
const state = shallowReactive({
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
  data.color = "#ffffff";
  return data;
});

const { width, height } = useWindowSize();
const isMobile = ref();
const colorMode = useColorMode();

watch(
  () => colorMode.preference,
  () => {
    if (state.decadesChart) {
      state.decadesChart.options.plugins.datalabels.color =
        colorMode.preference === "dark" ? "#ffffff" : undefined;
      state.decadesChart.update();
    }
    if (state.categoryChart) {
      state.categoryChart.options.plugins.datalabels.color =
        colorMode.preference === "dark" ? "#ffffff" : undefined;
      state.categoryChart.update();
    }
  },
);

watchPostEffect(() => {
  const prev = isMobile.value;
  isMobile.value = width.value < 1024;
  if (prev !== isMobile.value && state.decadesChart) {
    state.decadesChart.options.scales.x.reverse = !isMobile.value;
    state.decadesChart.options.maintainAspectRatio = isMobile.value;
    if (isMobile.value) {
      state.decadesChart.options.aspectRatio = 1;
    }
    state.decadesChart.options.plugins.datalabels.align = !isMobile.value
      ? "start"
      : "end";
    state.decadesChart.options.plugins.datalabels.anchor = !isMobile.value
      ? "start"
      : "end";
    state.decadesChart.update();
    state.decadesChart.resize();
  }
  if (prev !== isMobile.value && state.categoryChart) {
    state.categoryChart.options.maintainAspectRatio = isMobile.value;
    if (isMobile.value) {
      state.categoryChart.options.aspectRatio = 1;
    }
    state.categoryChart.update();
    state.categoryChart.resize();
  }
});

onMounted(async () => {
  const yearsCtx = document.getElementById("myChart");
  const mobile = width.value < 1024;
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
      maintainAspectRatio: mobile,
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
          reverse: !mobile,
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
          align: mobile ? "end" : "start",
          anchor: mobile ? "end" : "start",
          color: colorMode.preference === "dark" ? "#ffffff" : undefined,
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
      maintainAspectRatio: mobile,
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
          color: colorMode.preference === "dark" ? "#ffffff" : undefined,
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
