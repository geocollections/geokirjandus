<template>
  <div id="test">
    <v-btn class="mx-3" text dark @click="startTour">{{
      $t("common.tour")
    }}</v-btn>
  </div>
</template>

<script>
export default {
  name: "Tour",
  methods: {
    startTour() {
      const tour = this.$shepherd({
        useModalOverlay: true,

        defaultStepOptions: {
          classes: "step-body",
          cancelIcon: {
            enabled: true
          }
        }
      });

      tour.addStep({
        attachTo: {
          element: document.querySelector("#deleteSearchButton"),
          on: "right"
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        title: this.$t("tour.search.stepDeleteTitle"),
        text: this.$t("tour.search.stepDeleteText"),
        buttons: [
          {
            action() {
              return this.next();
            },
            text: this.$t("common.next")
          }
        ],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      });

      tour.addStep({
        attachTo: {
          element: document.querySelector("#shareButton"),
          on: "right"
        },
        title: this.$t("tour.search.stepShareTitle"),
        text: this.$t("tour.search.stepShareText"),
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: "shepherd-button-secondary",
            text: this.$t("common.back")
          },
          {
            action() {
              return this.next();
            },
            text: this.$t("common.next")
          }
        ],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      });

      /*tour.addStep({
        attachTo: {
          element: document.querySelector("#shareHelp"),
          on: "top"
        },
        title: "Share button",
        text:
          "Pressing this button opens a modal, where you can share current search link or export a file",
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: "shepherd-button-secondary",
            text: "Back"
          },
          {
            action() {
              return this.next();
            },
            text: "Next"
          }
        ],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 100] } }]
        },
        showOn: () => shareClicked
      });*/

      tour.addStep({
        attachTo: {
          element: document.querySelector("#searchHelpButton"),
          on: "right"
        },
        title: this.$t("tour.search.stepSearchHelpTitle"),
        text: this.$t("tour.search.stepSearchHelpText"),
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: "shepherd-button-secondary",
            text: this.$t("common.back")
          },
          {
            action() {
              return this.next();
            },
            text: this.$t("common.next")
          }
        ],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      });

      tour.addStep({
        attachTo: {
          element: document.querySelector("#citationSelect"),
          on: "right"
        },
        title: this.$t("tour.search.stepCitationTitle"),
        text: this.$t("tour.search.stepCitationText"),
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 4,
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: "shepherd-button-secondary",
            text: this.$t("common.back")
          },
          {
            action() {
              return this.next();
            },
            text: this.$t("common.next")
          }
        ],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      });

      tour.addStep({
        attachTo: {
          element: document.querySelector("#advancedSearch"),
          on: "right"
        },
        title: this.$t("tour.search.stepFiltersTitle"),
        text: this.$t("tour.search.stepFiltersText"),
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 4,
        buttons: [
          {
            action() {
              return this.back();
            },
            classes: "shepherd-button-secondary",
            text: this.$t("common.back")
          },
          {
            action() {
              return this.complete();
            },
            classes: "shepherd-button-secondary",
            text: this.$t("common.close")
          }
        ],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      });

      tour.start();
    }
  }
};
</script>

<style>
.step-body {
  font-family: Roboto, sans-serif;
}

.shepherd-title {
  font-size: large;
}

.tour-exit {
  background-color: #fe5f55;
}

.tour-exit:hover {
  background-color: red !important;
}
</style>
