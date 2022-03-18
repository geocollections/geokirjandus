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
      { name: "theme-color", content: "#FF9F1C" },
      { name: "apple-mobile-web-app-status-bar-sytle", content: "#FF9F1C" }
    ],
    link: [
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;700;900&family=Roboto:wght@400;500;700;900&display=swap"
      }
    ]
  }
};
</script>
