<template>
  <div id="test">
    <v-menu transition="slide-y-transition" offset-y bottom right>
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="mx-3 tourButton" text dark v-bind="attrs" v-on="on">
          {{ $t("common.tour") }}
        </v-btn>
      </template>
      <v-list color="#F6EDDF">
        <v-list-item @click="startSearchTour">
          {{ $t("common.tourSearch") }}
        </v-list-item>
        <v-list-item @click="startViewTour">
          {{ $t("common.tourView") }}
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: "Tour",
  methods: {
    next(tour) {
      return {
        action() {
          return tour.next();
        },
        text: this.$t("common.next")
      };
    },
    back(tour) {
      return {
        action() {
          return tour.back();
        },
        classes: "shepherd-button-secondary",
        text: this.$t("common.back")
      };
    },
    complete(tour) {
      return {
        action() {
          return this.complete();
        },
        classes: "shepherd-button-secondary",
        text: this.$t("common.close")
      };
    },
    startViewTour() {
      const tour = this.$shepherd({
        useModalOverlay: true,

        defaultStepOptions: {
          classes: "step-body",
          cancelIcon: {
            enabled: true
          },
          scrollTo: { behavior: "smooth", block: "center" }
        }
      });

      const vm = this;

      tour.addStep({
        attachTo: {
          element: document.querySelector(".data-viewer"),
          on: "top"
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 12,
        title: this.$t("tour.view.stepViewerTitle"),
        text: this.$t("tour.view.stepViewerText"),
        buttons: [this.next(tour)],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      });

      tour.addStep({
        attachTo: {
          element: document.querySelector("#tabs"),
          on: "top"
        },
        showOn: () => {
          return (
            vm.$route.name === "searchReference" ||
            vm.$route.name === "searchLibrary"
          );
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 4,
        title: this.$t("tour.view.stepTabsTitle"),
        text: this.$t("tour.view.stepTabsText"),
        buttons: [this.back(tour), this.next(tour)],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      });

      tour.addStep({
        attachTo: {
          element: document.querySelector("#viewChanger"),
          on: "bottom-start"
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        title: this.$t("tour.view.stepChangeViewTitle"),
        text: this.$t("tour.view.stepChangeViewText"),
        buttons: [this.back(tour), this.next(tour)],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      });

      tour.addStep({
        attachTo: {
          element: document.querySelector("#fieldSelect"),
          on: "bottom-start"
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        title: this.$t("tour.view.stepFieldSelectTitle"),
        text: this.$t("tour.view.stepFieldSelectText"),
        showOn: () => {
          return vm.$store.state.settings.view === "table";
        },
        buttons: [this.back(tour), this.next(tour)],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      });

      tour.addStep({
        attachTo: {
          element: document.querySelector("#viewerCopyButton"),
          on: "bottom-start"
        },
        showOn: () => {
          return (
            vm.$route.name === "searchReference" || vm.$route.name === "library"
          );
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        title: this.$t("tour.view.stepCopyTitle"),
        text: this.$t("tour.view.stepCopyText"),
        buttons: [this.back(tour), this.complete(tour)],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      });

      tour.start();
    },
    startSearchTour() {
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
          element: document.querySelector("#searchField"),
          on: "right"
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 0,
        title: this.$t("tour.search.stepSearchTitle"),
        text: this.$t("tour.search.stepSearchText"),
        buttons: [this.next(tour)],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      });

      tour.addStep({
        attachTo: {
          element: document.querySelector("#searchButton"),
          on: "right"
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 4,
        title: this.$t("tour.search.stepSearchButtonTitle"),
        text: this.$t("tour.search.stepSearchButtonText"),
        buttons: [this.back(tour), this.next(tour)],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 12] } }]
        }
      });

      tour.addStep({
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
        buttons: [this.back(tour), this.next(tour)],
        popperOptions: {
          modifiers: [{ name: "offset", options: { offset: [0, 5] } }]
        }
      });

      tour.addStep({
        attachTo: {
          element: document.querySelector("#searchHelpButton"),
          on: "right"
        },
        title: this.$t("tour.search.stepSearchHelpTitle"),
        text: this.$t("tour.search.stepSearchHelpText"),
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        buttons: [this.back(tour), this.next(tour)],
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
        buttons: [this.back(tour), this.next(tour)],
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
          element: document.querySelector("#deleteSearchButton"),
          on: "right"
        },
        modalOverlayOpeningRadius: 5,
        modalOverlayOpeningPadding: 2,
        title: this.$t("tour.search.stepDeleteTitle"),
        text: this.$t("tour.search.stepDeleteText"),
        buttons: [this.back(tour), this.next(tour)],
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
        buttons: [this.back(tour), this.next(tour)],
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
        buttons: [this.back(tour), this.complete(tour)],
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
