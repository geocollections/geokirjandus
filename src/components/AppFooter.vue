<template>
  <v-footer color="#ffb85a" class="d-flex pa-0 flex-grow-1 flex-column">
    <div class="spacer2 layer2" />
    <div class="text-center py-4">
      <a href="https://kik.ee" target="_blank" rel="noopener">
        <img
          src="https://files.geocollections.info/img/kik_valge.png"
          alt="KIK"
          title="KIK"
          class="footerLogo"
        />
      </a>
      <a href="https://natarc.ut.ee" target="_blank" rel="noopener">
        <img
          src="https://files.geocollections.info/img/natarclogovalge1.png"
          alt="NATARC"
          title="NATARC"
          class="footerLogo"
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
          title="TalTech geoloogia instituut"
          class="footerLogo"
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
          title="TÜ Loodusmuuseumi geokogud"
          class="footerLogo"
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
          title="Eesti Loodusmuuseumi geoloogia osakond"
          class="footerLogo"
        />
      </a>
    </div>
    <small v-if="$i18n.locale === 'ee'" class="text-center pt-4 footerText">
      Siin leiduvad materjalid on enamasti kasutamiseks
      <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank">
        CC BY-SA</a
      >
      litsentsi alusel, kui pole näidatud teisiti.
      <br />
      Portaal on osaks
      <a href="https://natarc.ut.ee" target="_blank">NATARC</a>
      teadustaristust ning infosüsteemist
      <a href="https://geocollections.info" target="_blank">SARV</a>, majutab
      <a href="https://taltech.ee/geoloogia-instituut" target="_blank">
        TalTech</a
      >.
      <br />
      Tarkvara on loodud kasutades
      <a href="https://vuejs.org/" target="_blank">Vue.js</a>, raamistikku ning
      kättesaadav
      <a href="https://github.com/geocollections/geokirjandus" target="_blank">
        GitHubis</a
      >.
    </small>
    <small v-if="$i18n.locale === 'en'" class="text-center pt-4 footerText">
      All materials in the portal are for free usage according to
      <a href="https://creativecommons.org/licenses/by-sa/3.0/" target="_blank"
        >CC BY-SA</a
      >
      licence, unless indicated otherwise.
      <br />
      Portal is part of
      <a href="https://natarc.ut.ee" target="_blank">NATARC</a>
      national research infrastructure and geoscience data platform
      <a href="https://geocollections.info" target="_blank">SARV</a>, hosted by
      <a href="https://taltech.ee/geoloogia-instituut" target="_blank"
        >TalTech</a
      >.
      <br />
      Built using <a href="https://vuejs.org/" target="_blank">Vue.js</a>,
      available on
      <a href="https://github.com/geocollections/geokirjandus" target="_blank">
        GitHub</a
      >.
    </small>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter"
};
</script>

<style scoped>
.footerLogo {
  height: 60px;
  width: auto;
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

.layer2 {
  background-image: url("../assets/stacked-steps-haikei (2).svg");
}
</style>
