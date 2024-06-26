<template>
  <header
    class="sticky top-0 z-10 border-b bg-stone-50/75 px-2 backdrop-blur transition-shadow dark:border-gray-800 dark:bg-gray-900/75"
    :class="{ 'shadow-lg': state.scroll }"
  >
    <div class="container mx-auto">
      <nav class="flex h-14 items-center gap-x-2 py-2">
        <NuxtLinkLocale class="mr-4 md:text-lg" to="/">
          <SiteLogo />
        </NuxtLinkLocale>
        <UButton
          :label="$t('tabs.references')"
          size="md"
          color="white"
          variant="ghost"
          class="relative hidden font-semibold sm:inline-flex hover:text-primary-500 dark:hover:text-primary-400"
          :to="localePath(`/reference`)"
          icon="i-heroicons-book-open"
          exact
          active-class="after:h-1 after:bg-carrot-orange-500 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-b bg-carrot-orange-500/10"
        />
        <UButton
          :label="$t('tabs.libraries')"
          size="md"
          color="white"
          variant="ghost"
          class="relative hidden font-semibold sm:inline-flex hover:text-primary-500 dark:hover:text-primary-400"
          :to="localePath(`/library`)"
          icon="i-heroicons-building-library"
          exact
          active-class="after:h-1 after:bg-carrot-orange-500 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-b bg-carrot-orange-500/10"
        />
        <div class="ml-auto hidden space-x-2 lg:flex">
        <UButton
          :label="t('geocollections')"
          size="md"
          color="white"
          variant="ghost"
          class="relative hidden font-semibold sm:inline-flex hover:text-primary-500 dark:hover:text-primary-400"
          to="https://geoloogia.info"
          icon="i-geocollections-emaapou"
          exact
          active-class="after:h-1 after:bg-carrot-orange-500 after:absolute after:w-full after:bottom-0 after:left-0 after:rounded-b bg-carrot-orange-500/10"
        />
          <USelect
            :modelValue="locale"
            size="md"
            :options="langOptions"
            id="lang-switcher"
            :aria-label="t('header.lang')"
            icon="i-heroicons-language-20-solid"
            @update:model-value="handleLocaleChange"
          />
          <ColorModeSwitch />
        </div>
        <UButton
          class="ml-auto lg:hidden"
          size="md"
          variant="ghost"
          color="gray"
          trailing-icon="i-heroicons-bars-3"
          @click="state.isOpen = true"
        ></UButton>
        <USlideover v-model="state.isOpen">
          <div class="flex flex-col space-y-2 p-4">
            <UButton
              class="ml-auto lg:hidden"
              size="md"
              variant="ghost"
              color="gray"
              trailing-icon="i-heroicons-x-mark"
              @click="state.isOpen = false"
            ></UButton>
            <UDivider />
            <div class="grid grid-cols-2 gap-x-2">
              <USelect
                class="col-span-1"
                :modelValue="locale"
                size="md"
                id="lang-switcher"
                :options="langOptions"
                icon="i-heroicons-language-20-solid"
                :aria-label="t('header.lang')"
                @update:model-value="handleLocaleChange"
              />
              <div class="ml-auto">
                <ColorModeSwitch />
              </div>
            </div>
            <UDivider />
            <UVerticalNavigation :links="pageItems[0]" />
          </div>
        </USlideover>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
const state = reactive({
  scroll: false,
  searchResults: [],
  isLoading: false,
  selectedTaxon: null,
  isOpen: false,
});
const { setLocale, locale, t } = useI18n();
const localePath = useLocalePath();

const langOptions = computed(() => [
  {
    label: "EST",
    value: "et",
  },
  {
    label: "ENG",
    value: "en",
  },
]);

const pageItems = computed(() => [
  [
    { label: t("tabs.references"), to: localePath("/reference"), exact: true, icon: "i-heroicons-book-open" },
    { label: t("tabs.libraries"), to: localePath("/library"), exact: true, icon: "i-heroicons-building-library" },
    { label: t("geocollections"), to: "https://geoloogia.info", icon: "i-geocollections-emaapou",  },
  ],
]);

function handleLocaleChange(locale: string) {
  setLocale(locale);
}

</script>

<style>
.test {
  color: transparent;
  background-image: linear-gradient(90deg, yellow 50%, green 50%);
  background-position: 100%;
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;

  transition: background-position steps(12, end) ease;
}
.test:hover {
  background-position: 0;
}
</style>
