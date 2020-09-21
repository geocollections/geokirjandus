<template>
  <div class="detail">
    <app-header />
    <router-view />
  </div>
</template>

<script>
import AppHeader from "@/components/AppHeader";
export default {
  name: "Detail",
  components: {
    AppHeader
  }
};
</script>
