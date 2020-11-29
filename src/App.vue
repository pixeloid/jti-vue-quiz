<template>
  <div class="app">
    <Quiz url="https://api.jsonbin.io/b/5cdd1762dbffad51f8aa85a5"/>
  </div>
</template>

<script>
import Quiz from "./components/Quiz.vue";

export default {
  name: "app",
  components: {
    Quiz
  }
};
</script>
