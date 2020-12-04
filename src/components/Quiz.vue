<template>
  <section class="quiz">
    <header class="app-header">
      <div class="counter-container">
         <div class="quiz-counter" >{{stage === 'results' ? 5 : currentQuestion||0}} / {{questions.length}}</div>
        <h2 v-html="tagline"></h2>
      </div>
      <div class="brand">
        <img src=../assets/images/jti-logo.png alt="">
      </div>
    </header>
    <div class="quiz-anim">
      <lottie class="lottie" :options="defaultOptions"  v-on:animCreated="handleAnimation"/>
    </div>
    <transition name="fade" mode="out-in" v-if="!loading">
      <div :key="currentQuestion" class="quiz-section">

        <div v-if="stage === 'welcome'" class="quiz-home">
          <h1 class="quiz-heading" v-html="title"></h1>
          <a
            href="#start-quiz"
            class="quiz-button"
            @click.prevent="initLegalStage"
            v-if="stage === 'welcome'"
          >Indítás</a>
        </div>

        <div v-if="stage === 'legal'" class="quiz-home">
          <h1 class="quiz-heading quiz-heading--legal">
            A jelen kereskedelmi tájékoztató kizárólag a dohánytermék forgalmazóinak szóló szakmai  célú reklám. <b>Ezért kérjük, ne tegye a fogyasztók számára elérhetővé!</b>
          </h1>
          <a
            href="#start-quiz"
            class="quiz-button"
            @click.prevent="initQuizStage"
          >Megértettem</a>
        </div>

        <div v-if="stage === 'results'">
          <div class="quiz-home">
            <!--
            <Picture class="quiz-img" :url="img"/>
            -->

            <h1 class="quiz-heading">Gratulálunk, Ön nyert! Vegye át a sorsjegyeket a képviselőnktől!</h1>
            <!--p class="quiz-result" v-html="title"></p-->
            <a
              href="#restart-quiz"
              class="quiz-button"
              @click.prevent="initWelcomeStage"
            >Átveszem a sorsjegyeket</a>
          </div>
        </div>

        <div class="quiz-content">

          <div v-if="stage === 'quiz'" class="quiz-game">
            <h1 class="quiz-heading" v-html="questions[currentQuestion-1].question"></h1>

            <ul class="quiz-questions">
              <li
                class="quiz-question"
                v-for="(answer, i) in questions[currentQuestion-1].answers"
                :key="i"
              >
                <button
                  class="quiz-question-button"
                  :class="{'correct': usersAnswer === i && i === questions[currentQuestion-1].correct , 'wrong': usersAnswer === i && usersAnswer !== questions[currentQuestion-1].correct}"
                  @click="handleAnswer(i)"
                > {{answer}} </button>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </transition>
    <div class="loader" v-else>
      <span></span>
    </div>

    <div class="footer">
      <span></span>
    </div>
  </section>
</template>

<script>
import { store, mutations, actions } from "../store";
import { version as appVersion } from "../../package.json";
import Lottie from './lottie.vue';
import * as animationData from '../assets/lottie/JTI_All_v01.json';

const welcomeImg =
  "https://media0.giphy.com/media/Bh3YfliwBZNwk/giphy.gif?cid=3640f6095c852266776c6f746fb2fc67";

export default {
  name: "Quiz",
  components: {
    'lottie': Lottie
  },
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
      defaultOptions: {animationData: animationData.default},
    };
  },
  computed: {
    stage: () => store.stage,
    title: () => store.title,
    tagline: () => store.tagline,
    question: () => store.question,
    questions: () => store.questions,
    currentQuestion: () => store.currentQuestion,
    answers: () => store.answers,
    correctAnswers() {
      let count = 0;
      this.questions.forEach((q, i) => {
        if (q.correct === this.answers[i]) count++;
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
    handleAnimation: function (anim) {
      this.anim = anim;
    },
    play: function () {
      this.anim.play();
    },
    stop: function () {
      this.anim.stop();
    },

    pause: function () {
      this.anim.pause();
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
        this.initResultsStage(this.correctAnswers);
      }
    },
    initWelcomeStage() {
      mutations.setStage("welcome");
      mutations.setTagline("A játék indítása");
      mutations.setTitle("Válaszoljon a Compact termékeinkkel kapcsolatos kérdéseinkre és nyerjen!");
      mutations.setImg(welcomeImg);
      mutations.setCurrentQuestion(0);
      mutations.resetAnswers();

      localStorage.appVersion = appVersion;
      localStorage.quizVersion = store.quizVersion;
      this.anim.playSegments([0,1],true)

      this.loading = false;
    },
    initQuizStage(currentQuestion) {
      mutations.setStage("quiz");
      mutations.setTagline("Válaszoljon a kérdésekre");
      this.anim.goToAndStop(0);
      mutations.setAnswers(
        localStorage.answers ? localStorage.answers.split(",") : []
      );

      this.goToQuestion(+currentQuestion || 1);
      this.loading = false;
    },
    initLegalStage() {
      mutations.setStage("legal");
      this.loading = false;
    },
    initResultsStage() {
      var correctAnswers = this.correctAnswers;


      mutations.setStage("results");
      mutations.setTagline("Vége a játéknak");
      mutations.setAnswers(localStorage.answers.split(","));
      mutations.setTitle(
        `Your Score: ${correctAnswers} out of ${this.questions.length}`
      );
      mutations.setCurrentQuestion(null);
      this.loading = false;
      setTimeout( () => {
        this.anim.playSegments([493, 528], true );
      }, 700)

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


      mutations.setCurrentQuestion(i);
      const frame = this.questions[i-1].frame;

      setTimeout(() => {
        this.anim.playSegments([frame[0], frame[1]], true );
      }, 0)
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
