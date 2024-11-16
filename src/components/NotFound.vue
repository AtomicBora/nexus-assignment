<script lang="ts" setup>
import IconNexus from './icons/IconNexus.vue'
</script>

<template>
  <div class="not-found">
    <IconNexus fill="#000" />
    <h1>404 Not Found</h1>
    <h3 class="intent">
      This is intentional, as it is a placeholder for a future feature and to demonstrate the use of
      Vue Router.
    </h3>
    <p>The page you are looking for does not exist.</p>
    <router-link to="/vehicle">Return to Select Vehicle Attributes page</router-link>
  </div>
</template>

<style lang="css" scoped>
.intent {
  color: #f7270e;
}
</style>
