<template>
  <div class="grid grid-cols-6 gap-8">
    <div class="col-span-full md:col-span-3 xl:col-span-2">
      <div class="mb-3 text-2xl font-medium">
        <i18n-t keypath="title.about">
          <template #site>
            <SiteLogo />
          </template>
        </i18n-t>
      </div>
      <div
        class="hyphens-auto rounded text-justify text-gray-900 dark:text-gray-300"
      >
        <p>
          {{ t("text.about.p1") }}
        </p>
        <br />
        <p>
          {{ t("text.about.p2") }}
        </p>
      </div>
    </div>

    <div class="col-span-full md:col-span-3 xl:col-span-2">
      <div class="mb-3 text-2xl font-medium">{{ t("title.project") }}</div>
      <div
        class="hyphens-auto rounded text-justify text-gray-900 dark:text-gray-300"
      >
        <i18n-t keypath="text.project.p1" tag="p">
          <template #natarc>
            <NuxtLink class="hover:underline" to="https://natarc.ut.ee/">{{
              t("natarc")
            }}</NuxtLink>
          </template>
          <template #sarv>
            <NuxtLink class="hover:underline" to="https://geoloogia.info/"
              >SARV</NuxtLink
            >
          </template>
          <template #taltech>
            <NuxtLink
              class="hover:underline"
              to="https://taltech.ee/geoloogia-instituut"
              >{{ t("taltechGeology") }}</NuxtLink
            >
          </template>
        </i18n-t>
        <br />
        <i18n-t keypath="text.project.p2" tag="p">
          <template #kik>
            <NuxtLink class="hover:underline" to="https://kik.ee">{{
              t("kik")
            }}</NuxtLink>
          </template>
        </i18n-t>
      </div>
    </div>
    <div class="col-span-full xl:col-span-2">
      <div class="mb-3 text-2xl font-medium">{{ t("title.contact") }}</div>
      <div
        class="hyphens-auto rounded text-justify text-gray-900 dark:text-gray-300"
      >
        <i18n-t keypath="text.contact" tag="p">
          <template #mail>
            <NuxtLink
              class="hover:underline"
              href="mailto:olle.hints@taltech.ee"
            >
              olle.hints@taltech.ee
            </NuxtLink>
          </template>
        </i18n-t>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n({ useScope: "local" });
</script>

<i18n lang="yaml">
et:
  title:
    about: "Mis on {site}?"
    project: "Projekt"
    contact: "Kontakt"
  text:
    about:
      p1: "GEOkirjandus on portaal, mis koondab andmeid Eesti geoloogia, maapõue, maavarade ja mäenduse-alaste trükiste ning muude allikmaterjalide kohta"
      p2: "Lisaks leidub portaalis teavet ka teiste regioonide ja üldiste geoloogia teemade kohta. Virtuaalsed kirjanduse kogumikud sisaldavad allikmaterjalide nimestikke mõne konkreetse teema, persooni või piirkonna kohta."
    project:
      p1: "Kirjanduse andmebaas on osa geoloogia infosüsteemist {sarv}, mida
        arendatakse Eesti teadustaristu teekaardi {natarc} raames {taltech}."
      p2: 'Eesti geoloogia-alaste trükiste süstematiseerimist, digiteerimist ning annoteerimist toetasid {kik} projektid nr 16633 ja 17805 "Eesti maapõue trükiste andmebaas (I ja II etapp)".'
    contact: "Andmete lisamiseks ja parandamiseks on vajalik kasutajakonto olemasolu maapõue infosüsteemis SARV, liitumiseks saada kiri: {mail}"
  natarc: "Loodusteaduslikud arhiivid ja andmevõrgustik (NATARC)"
  taltechGeology: "Tallinna Tehnikaülikooli geoloogia instituudis"
  kik: "Keskkonnainvesteeringute Keskuse"
en:
  title:
    about: "What is {site}?"
    project: "Project"
    contact: "Contact"
  text:
    about:
      p1: "The portal is a gateway to publications, technical reports and other information on geology and georesources of Estonia or by Estonian authors."
      p2: "Additionally, it holds data on various general geological topics and fossil groups from all over the world. References may be organised into virtual libraries – thematic collections on particular regions, persons or topics."
    project:
      p1: "The literature database is part of the {sarv} geological information system, which is developed within the framework of the {natarc} at {taltech}."
      p2: "The systematization, digitization and annotation of Estonian geological literature was supported by the {kik} projects No. 16633 and 17805."
    contact: "To add and correct data, you need to have a user account in the SARV geological information system, to join, send a letter: {mail}"
  natarc: "NATARC research infrastructure"
  taltechGeology: "TalTech Department of Geology"
  kik: "Enviromental Investments Center"
</i18n>
