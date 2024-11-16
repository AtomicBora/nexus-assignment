<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <h1 class="green">{{ msg }}</h1>
  <h2 class="green">Welcome to the task solution!</h2>
  <div class="greetings">
    I have created two routes, one is using pinia and the other is using only refs on the component.
    Not found route is handled as well.
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
