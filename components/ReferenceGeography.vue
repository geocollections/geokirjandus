<template>
  <div class="grid grid-cols-2 gap-x-4 gap-y-4">
    <div class="col-span-full lg:col-span-1">
      <div class="z-0 h-96 w-full rounded border bg-stone-200" id="map" />
    </div>
    <UTabs class="col-span-full lg:col-span-1" :items="tabs">
      <template #default="{ item }">
        <span>{{ item.label }}</span>
        <UBadge class="ml-2 rounded-full">{{ item.count }}</UBadge>
      </template>
      <template #localities>
        <ol
          class="col-span-1 list-inside list-disc marker:text-gray-500 lg:h-96 lg:overflow-y-auto"
        >
          <li v-for="referenceLocality in referenceLocalities?.results ?? []">
            <NuxtLink
              :to="`https://geoloogia.info/locality/${referenceLocality.locality.id}`"
              target="_blank"
            >
              {{
                $translate({
                  et: referenceLocality.locality.name,
                  en: referenceLocality.locality.name_en,
                })
              }}
            </NuxtLink>
          </li>
        </ol>
      </template>
      <template #areas>
        <ol
          class="col-span-1 list-inside list-disc marker:text-gray-500 lg:h-96 lg:overflow-y-auto"
        >
          <li v-for="referenceArea in referenceAreas?.results ?? []">
            <NuxtLink
              :to="`https://geoloogia.info/area/${referenceArea.area.id}`"
              target="_blank"
            >
              {{
                $translate({
                  et: referenceArea.area.name,
                  en: referenceArea.area.name_en,
                })
              }}
            </NuxtLink>
          </li>
        </ol>
      </template>
      <template #sites>
        <ol
          class="col-span-1 list-inside list-disc marker:text-gray-500 lg:h-96 lg:overflow-y-auto"
        >
          <li v-for="referenceSite in referenceSites?.results ?? []">
            <NuxtLink
              :to="`https://geoloogia.info/site/${referenceSite.site.id}`"
              target="_blank"
            >
              {{
                $translate({
                  et: referenceSite.site.name,
                  en: referenceSite.site.name_en,
                })
              }}
            </NuxtLink>
          </li>
        </ol>
      </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
let L: typeof import("leaflet");

if (process.client) {
  L = await import("leaflet");
  import("leaflet-gesture-handling");
  import("leaflet/dist/leaflet.css");
  import("leaflet-gesture-handling/dist/leaflet-gesture-handling.css");
}
const props = defineProps<{
  localityUrl: string;
  localityCount: number;
  areaUrl: string;
  areaCount: number;
  siteUrl: string;
  siteCount: number;
}>();
const { locale, t } = useI18n({ useScope: "local" });
const map = ref();

const baseMaps = computed(() => {
  return {
    CartoDB: L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        minZoom: 1,
        maxZoom: 18,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      },
    ),
    OpenStreetMap: L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        minZoom: 1,
        maxZoom: 18,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    ),
    OpenTopoMap: L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        minZoom: 1,
        maxZoom: 18,
        attribution:
          'Map data: &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
      },
    ),
    "Estonian satellite": L.tileLayer(
      "https://tiles.maaamet.ee/tm/tms/1.0.0/foto@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
      {
        minZoom: 6,
        maxZoom: 18,
        attribution:
          "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
        tms: true,
        worldCopyJump: true,
        detectRetina: true,
        zIndex: 1,
        updateWhenIdle: true,
        continuousWorld: true,
      },
    ),
    "Estonian map": L.tileLayer(
      "https://tiles.maaamet.ee/tm/tms/1.0.0/kaart@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
      {
        minZoom: 6,
        maxZoom: 18,
        attribution:
          "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
        tms: true,
        worldCopyJump: true,
        detectRetina: true,
        zIndex: 1,
        updateWhenIdle: true,
        continuousWorld: true,
      },
    ),
  };
});
const overlayMaps = computed(() => {
  return {
    "Estonian hybrid": L.tileLayer(
      "https://tiles.maaamet.ee/tm/tms/1.0.0/hybriid@GMC/{z}/{x}/{-y}.png&ASUTUS=TALTECH&KESKKOND=LIVE&IS=SARV",
      {
        attribution:
          "Estonian maps: <a  href='http://www.maaamet.ee/'>Republic of Estonia Land Board</a>",
        tms: true,
        worldCopyJump: true,
        detectRetina: true,
        zIndex: 2,
        updateWhenIdle: true,
        continuousWorld: true,
        minZoom: 6,
        maxZoom: 18,
      },
    ),
    "Estonian bedrock": L.tileLayer.wms(
      "https://gis.geocollections.info/geoserver/wms",
      {
        attribution: `<a href='https://ttu.ee/geoloogia-instituut' target='MapReferenceWindow'>&copy; Geoloogia instituut</a>`,
        layers: "geocollections:bedrock400k",
        format: "image/png",
        transparent: true,
        tiled: true,
        detectRetina: true,
        updateWhenIdle: true,
      },
    ),
    "Estonian basement": L.tileLayer.wms(
      "https://gis.geoloogia.info/geoserver/sarv/wms",
      {
        attribution: `<a href='https://ttu.ee/geoloogia-instituut' target='MapReferenceWindow'>&copy; Geoloogia instituut</a>`,
        layers: "sarv:basement",
        format: "image/png",
        transparent: true,
        tiled: true,
        detectRetina: true,
        updateWhenIdle: true,
      },
    ),
  };
});

const localityOrdering = computed(() => {
  if (locale.value === "et") return ["locality__locality"];
  if (locale.value === "en") return ["locality__locality_en"];
  return [];
});
const { data: referenceLocalities, refresh: refreshLocalities } =
  await useNewApiFetch(props.localityUrl, {
    query: {
      limit: props.localityCount,
      expand: ["locality"],
      fields: [
        "locality.id",
        "locality.name",
        "locality.name_en",
        "locality.latitude",
        "locality.longitude",
      ],
      ordering: localityOrdering.value,
    },
    watch: false,
    immediate: false,
  });

const areaOrdering = computed(() => {
  if (locale.value === "et") return ["area__name"];
  if (locale.value === "en") return ["area__name_en"];
  return [];
});
const { data: referenceAreas, refresh: refreshAreas } = await useNewApiFetch(
  props.areaUrl,
  {
    query: {
      limit: props.areaCount,
      expand: ["area"],
      fields: ["area.id", "area.name", "area.name_en", "area.polygon"],
      ordering: areaOrdering.value,
    },
    watch: false,
    immediate: false,
  },
);

const siteOrdering = computed(() => {
  if (locale.value === "et") return ["site__name"];
  if (locale.value === "en") return ["site__name_en"];
  return [];
});
const { data: referenceSites, refresh: refreshSites } = await useNewApiFetch(
  props.siteUrl,
  {
    query: {
      limit: props.siteCount,
      expand: ["site"],
      fields: [
        "site.id",
        "site.name",
        "site.name_en",
        "site.latitude",
        "site.longitude",
      ],
      ordering: siteOrdering.value,
    },
    watch: false,
    immediate: false,
  },
);

if (props.localityCount > 0) await refreshLocalities();
if (props.areaCount > 0) await refreshAreas();
if (props.siteCount > 0) await refreshSites();

const { width } = useWindowSize();
const isMobile = ref();

watchPostEffect(() => {
  const prev = isMobile.value;
  isMobile.value = width.value < 1024;
  if (prev !== isMobile.value && map.value) {
    if (isMobile.value) map.value.gestureHandling.enable();
    else map.value.gestureHandling.disable();
    L.Util.setOptions(map.value, { gestureHandling: isMobile });
  }
});
onMounted(() => {
  const mobile = width.value < 1024;
  map.value = L.map("map", {
    center: [0, 0],
    zoom: 1,
    layers: [baseMaps.value.CartoDB],
    //@ts-ignore
    gestureHandling: mobile,
    gestureHandlingOptions: {
      text: {
        touch: t("gestureHandling.touch"),
        scroll: t("gestureHandling.scroll"),
        scrollMac: t("gestureHandling.scrollMac"),
      },
      duration: 1000,
    },
  });
  L.control.layers(baseMaps.value, overlayMaps.value).addTo(map.value);

  let bounds;
  const localityMarkers = getLocalityMarkers();
  const areaPolygons = getAreaPolygons();
  const siteMarkers = getSiteMarkers();
  if (localityMarkers.length > 0) {
    const localityMarkersGroup = L.featureGroup(localityMarkers).addTo(
      map.value,
    );
    const localityBounds = localityMarkersGroup.getBounds();
    bounds = localityBounds;
  }
  if (areaPolygons.length > 0) {
    const areaPolygonGroup = L.featureGroup(areaPolygons).addTo(map.value);
    const areaBounds = areaPolygonGroup.getBounds();
    if (bounds) {
      bounds.extend(areaBounds);
    } else {
      bounds = areaBounds;
    }
  }
  if (siteMarkers.length > 0) {
    const siteMarkersGroup = L.featureGroup(siteMarkers).addTo(map.value);
    const siteBounds = siteMarkersGroup.getBounds();
    if (bounds) {
      bounds.extend(siteBounds);
    } else {
      bounds = siteBounds;
    }
  }

  if (bounds) {
    map.value.fitBounds(bounds, { maxZoom: 10, padding: [1, 1] });
  }
});

const tabs = computed(() => {
  const res = [];
  if (props.localityCount > 0) {
    res.push({
      label: t("localities"),
      slot: "localities",
      count: props.localityCount,
    });
  }
  if (props.areaCount > 0) {
    res.push({ label: t("areas"), slot: "areas", count: props.areaCount });
  }
  if (props.siteCount > 0) {
    res.push({ label: t("sites"), slot: "sites", count: props.siteCount });
  }
  return res;
});

function getLocalityMarkers() {
  const localityIcon = L.divIcon({
    className: "i-heroicons-map-pin-solid text-blue-500",
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });
  return (
    referenceLocalities.value?.results
      .filter((item) => item.locality.latitude && item.locality.longitude)
      .map((item) => {
        return L.marker([item.locality.latitude, item.locality.longitude], {
          icon: localityIcon,
        }).bindPopup(
          `<a href="https://geoloogia.info/locality/
              ${item.locality.id}" target="_blank">
            ${
              locale.value === "et" ? item.locality.name : item.locality.name_en
            }
          </a>`,
        );
      }) ?? []
  );
}
function getAreaPolygons() {
  return (
    referenceAreas.value?.results
      .filter((item) => item.area.polygon)
      .map((item) =>
        L.geoJSON(JSON.parse(item.area.polygon)).bindPopup(
          `<a href="https://geoloogia.info/area/
              ${item.area.id}" target="_blank">
            ${locale.value === "et" ? item.area.name : item.area.name_en}
          </a>`,
        ),
      ) ?? []
  );
}
function getSiteMarkers() {
  const siteIcon = L.divIcon({
    className: "i-heroicons-map-pin-solid text-red-500",
    iconSize: [20, 20],
    iconAnchor: [10, 20],
  });
  return (
    referenceSites.value?.results
      .filter((item) => item.site.latitude && item.site.longitude)
      .map((item) =>
        L.marker([item.site.latitude, item.site.longitude], {
          icon: siteIcon,
        }).bindPopup(
          `<a href="https://geoloogia.info/site/
              ${item.site.id}" target="_blank">
            ${locale.value === "et" ? item.site.name : item.site.name_en}
          </a>`,
        ),
      ) ?? []
  );
}
</script>

<i18n lang="yaml">
et:
  localities: "Lokaliteedid"
  areas: "Alad"
  sites: "Uuringupunktid"
  gestureHandling:
    touch: "Kasuta kahte näppu kaardi liigutamiseks"
    scroll: "Kasuta ctrl + scroll kaardi suumimiseks"
    scrollMac: 'Kasuta \u2318 + scroll kaardi suumimiseks'
en:
  localities: "Localities"
  areas: "Areas"
  sites: "Sites"
  gestureHandling:
    touch: "Use two fingers to move the map"
    scroll: "Use ctrl + scroll to zoom the map"
    scrollMac: 'Use \u2318 + scroll to zoom the map'
</i18n>
