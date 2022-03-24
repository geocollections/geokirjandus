<script>
import { Pie } from "vue-chartjs";
import ChartJSPluginColorSchemes from "chartjs-plugin-colorschemes";
import ChartDataLabels from "chartjs-plugin-datalabels";
export default {
  extends: Pie,
  props: {
    chartData: Object,
    options: Object,
    locale: String
  },
  mounted() {
    this.addPlugin(ChartJSPluginColorSchemes);
    this.addPlugin(ChartDataLabels);
    this.renderChart(this.chartData, this.options);
  },
  watch: {
    locale: {
      handler() {
        this.$data._chart.destroy();
        this.renderChart(this.chartData, this.options);
      }
    }
  }
};
</script>

<style scoped>
canvas {
  max-height: 275px;
  max-width: 275px;
}
</style>
