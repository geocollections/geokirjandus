<script>
import { Bar } from "vue-chartjs";
import ChartJSPluginColorSchemes from "chartjs-plugin-colorschemes";

export default {
  extends: Bar,
  props: ["chartdata", "options", "locale"],
  mounted() {
    this.addPlugin(ChartJSPluginColorSchemes);

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

<style scoped>
canvas {
  max-height: 275px;
  max-width: 275px;
}
</style>
