<template>
  <div ref="mapElement" style="height: 500px; z-index: 0"></div>
</template>

<script>
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

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
      map: null,
      maps: [
        {
          name: "CartoDB",
          leafletObject: L.tileLayer(
            "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
            {
              attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            }
          ),
          minZoom: 1,
          maxZoom: 18
        },
        {
          name: "OpenStreetMap",
          leafletObject: L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
              attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
          ),
          minZoom: 1,
          maxZoom: 18
        },
        {
          name: "OpenTopoMap",
          leafletObject: L.tileLayer(
            "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            {
              attribution:
                'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            }
          ),
          minZoom: 1,
          maxZoom: 18
        },
        {
          name: "Estonian satellite",
          leafletObject: L.tileLayer(
            "https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
            {
              attribution:
                "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
              tms: true,
              worldCopyJump: true,
              detectRetina: true,
              zIndex: 1,
              updateWhenIdle: true,
              continuousWorld: true
            }
          ),
          minZoom: 6,
          maxZoom: 18
        },
        {
          name: "Estonian map",
          leafletObject: L.tileLayer(
            "https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
            {
              attribution:
                "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
              tms: true,
              worldCopyJump: true,
              detectRetina: true,
              zIndex: 1,
              updateWhenIdle: true,
              continuousWorld: true
            }
          ),
          minZoom: 6,
          maxZoom: 18
        }
      ],
      overlayMaps: [
        {
          name: "Estonian hybrid",
          leafletObject: L.tileLayer(
            "https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
            {
              attribution:
                "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
              tms: true,
              worldCopyJump: true,
              detectRetina: true,
              zIndex: 2,
              updateWhenIdle: true,
              continuousWorld: true
            }
          ),
          minZoom: 6,
          maxZoom: 18
        }
      ]
    };
  },
  watch: {
    markers: {
      handler() {
        const markerClusters = L.markerClusterGroup();
        let markers = [];
        for (const m of this.markers) {
          const markerObj = new L.CircleMarker(m.coordinates, {
            title: m.title
          });
          markers.push(markerObj);
          if (m.popup) markerObj.bindPopup(m.popup);

          markerClusters.addLayer(markerObj);
        }
        this.map.addLayer(markerClusters);
        let bounds = new L.featureGroup(markers).getBounds();
        console.log(bounds);
        this.map.fitBounds(bounds);
      }
    }
  },
  mounted() {
    this.setupLeafletMap();
  },
  methods: {
    setupLeafletMap() {
      const mapDiv = L.map(this.$refs["mapElement"], {
        layers: [this.maps[0].leafletObject]
      }).setView([0, 0], 1);

      let baseMaps = {};
      this.maps.forEach(
        provider => (baseMaps[provider.name] = provider.leafletObject)
      );

      L.control.layers(baseMaps).addTo(mapDiv);
      this.map = mapDiv;
    }
  }
};
</script>

<style scoped></style>
