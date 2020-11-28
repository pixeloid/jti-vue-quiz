<template>
  <div class="app">
    <header class="app-header">
      <span class="app-header-text">
        Show on
        <a href="https://github.com/dmtrbrl/hp-quiz">Github</a>
      </span>
      <h1 class="app-heading">
        <svg
          width="60"
          height="60"
          viewBox="0 0 60 60"
          xmlns="http://www.w3.org/2000/svg"
          class="app-heading-icon"
        >
          <path
            d="M28.745 57.76a3.116 3.116 0 1 0 5.68-2.565L24.203 32.559l16.332 2.085a3.065 3.065 0 0 0 2.895-1.229 3.117 3.117 0 0 0 .347-3.126L31.315 2.252a3.115 3.115 0 0 0-5.692 2.531l10.213 22.98-16.37-2.09a3.085 3.085 0 0 0-2.901 1.236 3.117 3.117 0 0 0-.335 3.136L28.745 57.76z"
          ></path>
        </svg>
        <span>Harry Potter</span>
        <span>Movies Quiz</span>
      </h1>
      <span class="app-header-text">
        Thanks
        <a href="https://giphy.com/" target="_blank">GIPHY</a> for the gifs
      </span>
    </header>
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
