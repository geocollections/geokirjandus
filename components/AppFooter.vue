<template>
  <footer
    class="relative border-t bg-stone-100 py-5 text-center dark:border-gray-800 dark:bg-gray-900"
  >
    <div class="mx-2 mb-4 flex justify-center space-x-2">
      <a href="https://kik.ee" target="_blank" rel="noopener">
        <img
          src="https://files.geocollections.info/img/kik_valge.png"
          alt="KIK"
          height="60"
          width="53"
          title="KIK"
          class="invert dark:filter-none"
        />
      </a>
      <a href="https://natarc.ut.ee" target="_blank" rel="noopener">
        <img
          src="https://files.geocollections.info/img/natarclogovalge1.png"
          alt="NATARC"
          height="60"
          width="59"
          title="NATARC"
          class="invert dark:filter-none"
        />
      </a>
      <a
        href="https://taltech.ee/geoloogia-instituut"
        target="_blank"
        rel="noopener"
      >
        <img
          src="https://files.geocollections.info/img/tutaltech2.png"
          alt="SARV"
          height="60"
          width="105"
          title="TalTech geoloogia instituut"
          class="invert dark:filter-none"
        />
      </a>
      <a
        href="http://www.natmuseum.ut.ee/et/content/geoloogiakogud"
        target="_blank"
        rel="noopener"
      >
        <img
          src="https://files.geocollections.info/img/TY_logo_ring_jooneta_valge.png"
          alt="TÜ Loodusmuuseumi geokogud"
          height="60"
          width="59"
          title="TÜ Loodusmuuseumi geokogud"
          class="invert dark:filter-none"
        />
      </a>
      <a
        href="https://loodusmuuseum.ee/geoloogilised-kogud"
        target="_blank"
        rel="noopener"
      >
        <img
          src="https://files.geocollections.info/img/ELM_logo_white1.png"
          alt="Eesti Loodusmuuseumi geoloogia osakond"
          height="60"
          width="126"
          title="Eesti Loodusmuuseumi geoloogia osakond"
          class="invert dark:filter-none"
        />
      </a>
    </div>
    <div class="text-sm">
      <i18n-t keypath="licence" tag="div">
        <template #licence>
          <a
            class="hover:underline"
            href="https://creativecommons.org/licenses/by-sa/3.0/"
            target="_blank"
          >
            CC BY-SA
          </a>
        </template>
        <template #natarc>
          <a class="hover:underline" href="https://natarc.ut.ee" target="_blank"
            >NATARC</a
          >
        </template>
      </i18n-t>
      <i18n-t keypath="development" tag="div">
        <template #sarv>
          <a
            class="hover:underline"
            href="https://geocollections.info"
            target="_blank"
            >SARV</a
          >
        </template>
        <template #taltech>
          <a
            class="hover:underline"
            href="https://taltech.ee/geoloogia-instituut"
            target="_blank"
          >
            TalTech</a
          >
        </template>
      </i18n-t>
      <i18n-t keypath="icons8" tag="div">
        <template #openBook>
          <a
            target="_blank"
            class="hover:underline"
            href="https://icons8.com/icon/NJKARrx4jLfJ/open-book"
            >Open Book</a
          >
        </template>
        <template #icons8>
          <a target="_blank" class="hover:underline" href="https://icons8.com"
            >Icons8</a
          >
        </template>
      </i18n-t>
    </div>
    <UButton
      class="mt-2"
      icon="i-simple-icons-github"
      aria-label="GitHub"
      size="xl"
      :padded="false"
      color="gray"
      href="https://github.com/geocollections/geokirjandus"
      variant="link"
    />
  </footer>
</template>

<script setup lang="ts">
useI18n();
</script>

<style scoped>
.footerLogo {
  height: 60px;
  padding: 0 10px;
}

.footerText {
  max-width: 800px;
}
.spacer2 {
  aspect-ratio: 1920/210;
  width: 100%;
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
}
</style>

<i18n lang="yaml">
et:
  licence: "Leheküljel leiduvad materjalid on enamasti kasutamiseks {licence} litsensi alusel, kui pole teisiti määratud."
  development: "Portaal on osaks {natarc} teadustaristust ning infosüsteemist {sarv}, majutab {taltech}."
  icons8: "{openBook} ikooni autor {icons8}."
en:
  licence: "All materials in the portal are for free usage according to {licence}, unless indiated otherwise."
  development: "Portal is part of {natarc} natianal research infrastructure and geoscience data platform {sarv}, hosted by {taltech}."
  icons8: "{openBook} icon by {icons8}."
</i18n>
