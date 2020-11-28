<template>
  <section class="quiz">
    <transition name="fade" mode="out-in" v-if="!loading">
      <div :key="currentQuestion">
        <div class="quiz-counter" v-if="stage === 'quiz'">{{currentQuestion}} / {{questions.length}}</div>
        <Picture class="quiz-img" :url="img"/>
        <h1 class="quiz-heading" v-html="title"></h1>
        <a
          href="#start-quiz"
          class="quiz-button"
          @click.prevent="initQuizStage"
          v-if="stage === 'welcome'"
        >Start Quiz</a>
        <p class="quiz-result" v-if="stage === 'results'" v-html="resultsInfo.text"></p>
        <a
          href="#restart-quiz"
          class="quiz-button"
          @click.prevent="initWelcomeStage"
          v-if="stage === 'results'"
        >Try again</a>

        <ul class="quiz-questions" v-if="stage === 'quiz'">
          <li
            class="quiz-question"
            v-for="(answer, i) in questions[currentQuestion-1].answers"
            :key="i"
          >
            <button
              class="quiz-question-button"
              :class="{'correct': usersAnswer === answer && answer === questions[currentQuestion-1].correct , 'wrong': usersAnswer === answer && usersAnswer !== questions[currentQuestion-1].correct}"
              @click="handleAnswer(answer)"
            >{{moviesTitles[answer-1]}}</button>
          </li>
        </ul>
      </div>
    </transition>
    <div class="loader" v-else>
      <span></span>
    </div>
  </section>
</template>

<script>
import { store, mutations, actions } from "../store";
import { version as appVersion } from "../../package.json";
import Picture from "./Picture";

const welcomeImg =
  "https://media0.giphy.com/media/Bh3YfliwBZNwk/giphy.gif?cid=3640f6095c852266776c6f746fb2fc67";

export default {
  name: "Quiz",
  components: { Picture },
  props: {
    url: {
      required: true,
      type: String
    }
  },
  data() {
    return {
      loading: true,
      usersAnswer: null,
      moviesTitles: [
        "Harry Potter and the Philosopher's Stone",
        "Harry Potter and the Chamber of Secrets",
        "Harry Potter and the Prisoner of Azkaban",
        "Harry Potter and the Goblet of Fire",
        "Harry Potter and the Order of the Phoenix",
        "Harry Potter and the Half-Blood Prince",
        "Harry Potter and the Deathly Hallows – Part 1",
        "Harry Potter and the Deathly Hallows – Part 2"
      ]
    };
  },
  computed: {
    stage: () => store.stage,
    title: () => store.title,
    img: () => store.img,
    questions: () => store.questions,
    currentQuestion: () => store.currentQuestion,
    answers: () => store.answers,
    correctAnswers() {
      let count = 0;
      this.questions.forEach((q, i) => {
        if (q.correct == this.answers[i]) count++;
      });
      return count;
    },
    resultsInfo() {
      if (this.correctAnswers < 10) {
        return {
          text:
            "Practice, practice, practice! <br>You'll be a clever as Dumbledore in no time!",
          img:
            "https://media0.giphy.com/media/720g7C1jz13wI/giphy.gif?cid=3640f6095c869951776a4a7a5110b5dc"
        };
      }
      if (this.correctAnswers < 15) {
        return {
          text:
            "Not too shabby! <br>Have a Harry Potter movie marathon and then try again!",
          img:
            "https://media2.giphy.com/media/UeeJAeey9GJjO/giphy.gif?cid=3640f6095c869e703631634241b759c1"
        };
      }
      if (this.correctAnswers < 20) {
        return {
          text:
            "Very good! <br>Have another go and you'll be getting full marks!",
          img: "https://media.giphy.com/media/TGLLaCKWwxUVq/giphy.gif"
        };
      }
      if (this.correctAnswers === 20) {
        return {
          text:
            "TOP MARKS! Nice work! <br>You have some serious wizard wisdom!",
          img: "https://media.giphy.com/media/9H279yb0blggo/giphy.gif"
        };
      }

      return false;
    }
  },
  methods: {
    async fetchData() {
      await actions.fetchData(this.url);
    },
    async init() {
      await this.fetchData();
      if (
        !localStorage.stage ||
        localStorage.stage === "welcome" ||
        localStorage.appVersion !== appVersion ||
        localStorage.quizVersion !== store.quizVersion
      ) {
        this.initWelcomeStage();
      } else if (localStorage.stage === "quiz") {
        this.initQuizStage(localStorage.currentQuestion || 1);
      } else {
        this.initResultsStage();
      }
    },
    initWelcomeStage() {
      mutations.setStage("welcome");
      mutations.setTitle("How Well Do You Know <br>the Harry Potter Movies?");
      mutations.setImg(welcomeImg);
      mutations.setCurrentQuestion(0);
      mutations.resetAnswers();

      localStorage.appVersion = appVersion;
      localStorage.quizVersion = store.quizVersion;

      this.loading = false;
    },
    initQuizStage(currentQuestion) {
      mutations.setStage("quiz");
      mutations.setTitle("Which movie is this?");
      mutations.setAnswers(
        localStorage.answers ? localStorage.answers.split(",") : []
      );

      this.goToQuestion(+currentQuestion || 1);

      this.loading = false;
    },
    initResultsStage() {
      mutations.setStage("results");
      mutations.setAnswers(localStorage.answers.split(","));
      mutations.setTitle(
        `Your Score: ${this.correctAnswers} out of ${this.questions.length}`
      );
      mutations.setImg(this.resultsInfo.img);
      mutations.setCurrentQuestion(null);

      this.loading = false;
    },
    handleAnswer(answer) {
      if (this.usersAnswer !== null) return;
      this.usersAnswer = answer;
      mutations.addAnswer(answer);
      const nextQuestion = +this.currentQuestion + 1;

      setTimeout(() => {
        if (nextQuestion <= this.questions.length) {
          this.goToQuestion(nextQuestion);
        } else {
          this.initResultsStage();
        }
      }, 500);
    },
    goToQuestion(i) {
      this.usersAnswer = null;

      const img = this.questions[i - 1].img;
      mutations.setImg(img);
      mutations.setCurrentQuestion(i);
    }
  },
  watch: {
    stage(val) {
      localStorage.stage = val;
    },
    answers(val) {
      localStorage.answers = val;
    },
    currentQuestion(val) {
      localStorage.currentQuestion = val;
    }
  },
  async mounted() {
    await this.init();
  }
};
</script>
