<template>
  <div ref="mapElement" style="height: 500px"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});
export default {
  name: "LeafletMap",
  props: {
    markers: {
      type: Array
    }
  },
  data() {
    return {
      map: null
    };
  },
  watch: {
    markers: {
      handler() {
        for (const m of this.markers) {
          L.marker(m.coordinates, { title: m.title }).addTo(this.map);
        }
      }
    }
  },
  mounted() {
    this.setupLeafletMap();
  },
  methods: {
    setupLeafletMap() {
      const mapDiv = L.map(this.$refs["mapElement"]).setView([0, 0], 1);
      this.map = mapDiv;
      L.tileLayer(
        "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
        {
          attribution:
            'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          minZoom: 1,
          id: "mapbox/streets-v11",
          tileSize: 512,
          zoomOffset: -1,
          accessToken:
            "pk.eyJ1IjoiZXJpa2R6byIsImEiOiJja2VpOWIxOHowaWUyMnRwY3Nwa2RncWxsIn0.rL0RG5H3mbyCADqV24CotA"
        }
      ).addTo(mapDiv);
    }
  }
};
</script>

<style scoped></style>
