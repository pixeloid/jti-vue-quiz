<template>
  <div class="app">
    <Quiz url="https://api.jsonbin.io/b/5fc678aa045eb86f1f89b1b1"/>
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
