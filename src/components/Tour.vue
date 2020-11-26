<template>
  <div id="test">
    <v-btn class="mx-3 tourButton" text dark @click="startTour">
      {{ $t("common.tour") }}
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "Tour",
  data() {
    return {
      tourOptions: {
        useModalOverlay: true,

        defaultStepOptions: {
          classes: "step-body",
          cancelIcon: {
            enabled: true
          },
          scrollTo: { behavior: "smooth", block: "center" }
        }
      }
    };
  },
  computed: {
    next() {
      return {
        action() {
          return this.next();
        },
        text: this.$t("common.next")
      };
    },
    back() {
      return {
        action() {
          return this.back();
        },
        classes: "shepherd-button-secondary",
        text: this.$t("common.back")
      };
    },
    complete() {
      return {
        action() {
          return this.complete();
        },
        classes: "shepherd-button-secondary",
        text: this.$t("common.close")
      };
    }
  },
  methods: {
    buildTour() {
      const tour = this.$shepherd(this.tourOptions);

      tour.addSteps([
        this.stepDataViewer(),
        this.stepTabs(),
        this.stepViewChange(),
        this.stepFieldSelect(),
        this.stepCopyButton(),
        this.stepSearchField(),
        this.stepSearchButton(),
        this.stepLibraryAlert(),
        this.stepHelpButton(),
        this.stepShareButton(),
        this.stepDeleteSearch(),
        this.stepCitationSelect(),
        this.stepAdvancedSearch()
      ]);
      return tour;
    },
    startTour() {
      const tour = this.buildTour();

      tour.start();
    },
    stepDataViewer() {
      return {
        beforeShowPromise: () => {
          return new Promise(resolve => {
            console.log(document.querySelector("#dataViewer"));
            if (document.querySelector("#dataViewer")) {
              resolve();
            }
          });
        },
        attachTo: {
          element: document.querySelector("#dataViewer"),
          on: "top"
        },
        showOn: () => this.$route.name !== "reference",
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 12,
        title: this.$t("tour.view.stepViewerTitle"),
        text: this.$t("tour.view.stepViewerText"),
        buttons: [this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      };
    },
    stepTabs() {
      return {
        attachTo: {
          element: document.querySelector("#tabs"),
          on: "top"
        },
        showOn: () =>
          this.$route.name === "searchReference" ||
          this.$route.name === "searchLibrary",
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 4,
        title: this.$t("tour.view.stepTabsTitle"),
        text: this.$t("tour.view.stepTabsText"),
        buttons: [this.back, this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      };
    },
    stepViewChange() {
      return {
        attachTo: {
          element: document.querySelector("#viewChanger"),
          on: "bottom-start"
        },

        showOn: () => this.$route.name !== "reference",
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        title: this.$t("tour.view.stepChangeViewTitle"),
        text: this.$t("tour.view.stepChangeViewText"),
        buttons: [this.back, this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      };
    },
    stepFieldSelect() {
      return {
        beforeShowPromise: () => {
          return new Promise(resolve => {
            if (document.querySelector("#fieldSelect")) {
              resolve();
            }
          });
        },
        attachTo: {
          element: document.querySelector("#fieldSelect"),
          on: "bottom-start"
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        title: this.$t("tour.view.stepFieldSelectTitle"),
        text: this.$t("tour.view.stepFieldSelectText"),
        showOn: () => {
          return (
            this.$route.name !== "reference" &&
            this.$store.state.settings.view === "table"
          );
        },
        buttons: [this.back, this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      };
    },
    stepCopyButton() {
      return {
        attachTo: {
          element: document.querySelector("#viewerCopyButton"),
          on: "bottom-start"
        },
        showOn: () => {
          return (
            this.$route.name === "searchReference" ||
            this.$route.name === "library"
          );
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        title: this.$t("tour.view.stepCopyTitle"),
        text: this.$t("tour.view.stepCopyText"),
        buttons: [this.back, this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      };
    },
    stepSearchField() {
      return {
        attachTo: {
          element: document.querySelector("#searchField"),
          on: "right"
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 0,
        title: this.$t("tour.search.stepSearchTitle"),
        text: this.$t("tour.search.stepSearchText"),
        buttons: [this.back, this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      };
    },
    stepLibraryAlert() {
      return {
        attachTo: {
          element: document.querySelector("#libraryAlert"),
          on: "right"
        },
        showOn: () => {
          return document.querySelector("#libraryAlert");
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        title: this.$t("tour.search.stepLibraryAlertTitle"),
        text: this.$t("tour.search.stepLibraryAlertText"),
        buttons: [this.back, this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      };
    },
    stepSearchButton() {
      return {
        attachTo: {
          element: document.querySelector("#searchButton"),
          on: "right"
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 4,
        title: this.$t("tour.search.stepSearchButtonTitle"),
        text: this.$t("tour.search.stepSearchButtonText"),
        buttons: [this.back, this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      };
    },
    stepHelpButton() {
      return {
        attachTo: {
          element: document.querySelector("#searchHelpButton"),
          on: "right"
        },
        title: this.$t("tour.search.stepSearchHelpTitle"),
        text: this.$t("tour.search.stepSearchHelpText"),
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        buttons: [this.back, this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      };
    },
    stepShareButton() {
      return {
        attachTo: {
          element: document.querySelector("#shareButton"),
          on: "right"
        },
        title: this.$t("tour.search.stepShareTitle"),
        text: this.$t("tour.search.stepShareText"),
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        buttons: [this.back, this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      };
    },
    stepDeleteSearch() {
      return {
        attachTo: {
          element: document.querySelector("#deleteSearchButton"),
          on: "right"
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        title: this.$t("tour.search.stepDeleteTitle"),
        text: this.$t("tour.search.stepDeleteText"),
        buttons: [this.back, this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      };
    },
    stepCitationSelect() {
      return {
        attachTo: {
          element: document.querySelector("#citationSelect"),
          on: "right"
        },
        title: this.$t("tour.search.stepCitationTitle"),
        text: this.$t("tour.search.stepCitationText"),
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 4,
        buttons: [this.back, this.next],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      };
    },
    stepAdvancedSearch() {
      return {
        attachTo: {
          element: document.querySelector("#advancedSearch"),
          on: "right"
        },
        title: this.$t("tour.search.stepFiltersTitle"),
        text: this.$t("tour.search.stepFiltersText"),
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 4,
        buttons: [this.back, this.complete],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      };
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
.tourButton {
  backdrop-filter: blur(1px);
}
.tourButton::before {
  opacity: 0.1 !important;
}
.tourButton:hover::before {
  opacity: 0.22 !important;
}
</style>
