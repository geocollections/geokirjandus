<script>
import { Pie } from "vue-chartjs";
import ChartJSPluginColorSchemes from "chartjs-plugin-colorschemes";
import ChartDataLabels from "chartjs-plugin-datalabels";
export default {
  extends: Pie,
  props: ["chartdata", "options", "locale"],
  mounted() {
    this.addPlugin(ChartJSPluginColorSchemes);
    this.addPlugin(ChartDataLabels);
    this.renderChart(this.chartdata, this.options);
  },
  watch: {
    locale: {
      handler() {
        this.$data._chart.destroy();
        this.renderChart(this.chartdata, this.options);
      }
    }
  }
};
</script>

<style scoped></style>
