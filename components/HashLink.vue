<template>
  <h2 id="hash" class="mb-2">
    <NuxtLink
      class="group flex items-center text-xl font-semibold text-black dark:text-white"
      :to="`#${hash}`"
    >
      <slot />
      <UIcon
        class="ml-2 hidden group-hover:inline-block"
        name="i-heroicons-hashtag"
      />
    </NuxtLink>
  </h2>
</template>

<script setup lang="ts">
defineProps<{ hash: string }>();
</script>
