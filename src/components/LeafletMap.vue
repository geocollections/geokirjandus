<template>
  <div ref="mapElement" class="map" />
</template>

<script>
import "leaflet/dist/leaflet.css";

import {
  Icon,
  tileLayer,
  map,
  markerClusterGroup,
  CircleMarker,
  control,
  geoJSON,
  layerGroup,
  featureGroup
} from "leaflet/dist/leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

export default {
  name: "LeafletMap",
  props: {
    markers: {
      type: Array
    },
    siteMarkers: {
      type: Array
    },
    areas: {
      type: Array
    }
  },
  data() {
    return {
      map: null,
      maps: [
        {
          name: "CartoDB",
          leafletObject: tileLayer(
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
          leafletObject: tileLayer(
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
          leafletObject: tileLayer(
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
          leafletObject: tileLayer(
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
          leafletObject: tileLayer(
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
          leafletObject: tileLayer(
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
        },
        {
          name: "Estonian bedrock",
          leafletObject: tileLayer.wms(
            "https://gis.geocollections.info/geoserver/wms",
            {
              attribution: `<a href='https://ttu.ee/geoloogia-instituut' target='MapReferenceWindow'>&copy; Geoloogia instituut</a>`,
              layers: "geocollections:bedrock400k",
              format: "image/png",
              transparent: true,
              tiled: true,
              detectRetina: true,
              updateWhenIdle: true
            }
          )
        }
      ]
    };
  },
  mounted() {
    this.setupLeafletMap();
  },
  methods: {
    setupLeafletMap() {
      const mapDiv = map(this.$refs["mapElement"], {
        layers: [this.maps[0].leafletObject]
      }).setView([58.5, 25.5], 1);

      let baseMaps = {};
      let overlayMaps = {};
      this.maps.forEach(
        provider => (baseMaps[provider.name] = provider.leafletObject)
      );
      this.overlayMaps.forEach(
        provider => (overlayMaps[provider.name] = provider.leafletObject)
      );

      control.layers(baseMaps, overlayMaps).addTo(mapDiv);

      const markerClusters = markerClusterGroup({ maxClusterRadius: 30 });
      let markers = [];
      for (const m of this.markers) {
        const markerObj = new CircleMarker(m.coordinates, {
          title: m.title,
          radius: 3
        });
        markers.push(markerObj);
        if (m.popup) markerObj.bindPopup(m.popup);

        markerClusters.addLayer(markerObj);
      }

      for (const m of this.siteMarkers) {
        const markerObj = new CircleMarker(m.coordinates, {
          title: m.title,
          radius: 3,
          color: "red"
        });
        markers.push(markerObj);
        if (m.popup) markerObj.bindPopup(m.popup);

        markerClusters.addLayer(markerObj);
      }

      for (const a of this.areas) {
        const geoJSONObj = new geoJSON(JSON.parse(a.area.polygon)).addTo(
          mapDiv
        );
        geoJSONObj.bindPopup(
          `<a href="https://geoloogia.info/area/${a.area.id}" target="_blank">${
            this.$i18n.locale === "ee" ? a.area.name : a.area.name_en
          }</a>`
        );
        mapDiv.fitBounds(geoJSONObj.getBounds(), { maxZoom: 8 });
      }

      if (markers.length > 0) {
        if (markers.length > 100) mapDiv.addLayer(markerClusters);
        else mapDiv.addLayer(layerGroup(markers));

        let bounds = new featureGroup(markers).getBounds();
        if (bounds.isValid()) mapDiv.fitBounds(bounds, { maxZoom: 10 });
      }

      this.map = mapDiv;
    }
  }
};
</script>

<style scoped>
.map {
  height: 400px;
  z-index: 0;
}
</style>
