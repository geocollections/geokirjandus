<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
  metaInfo: {
    titleTemplate: "%s | Geokirjandus: Eesti maapõue kirjanduse andmebaas",
    meta: [
      {
        name: "description",
        content:
          "Eesti maapõue-alase kirjanduse portaal tugineb infosüsteemi SARV andmemudelil ja API liidesel. 2020. aasta lõpuks digiteeritakse ja tehakse siin kättesaadavaks kõigi olulisemate trükiste metaandmed koos märksõnadega."
      },
      {
        property: "og:title",
        content: "Avaleht",
        template: "%s | Geokirjandus: Eesti maapõue kirjanduse andmebaas",
        vmid: "og:title"
      },
      {
        name: "og:description",
        content:
          "Eesti maapõue-alase kirjanduse portaal tugineb infosüsteemi SARV andmemudelil ja API liidesel. 2020. aasta lõpuks digiteeritakse ja tehakse siin kättesaadavaks kõigi olulisemate trükiste metaandmed koos märksõnadega."
      },
      {
        name: "og:image",
        content:
          "https://files.geocollections.info/img/geokirjandus/geokirjandus.jpg"
      },
      { name: "og:image:alt", content: "TalTech" },
      { name: "theme-color", content: "#924F11" },
      { name: "apple-mobile-web-app-status-bar-sytle", content: "#924F11" }
    ]
  }
};
</script>
