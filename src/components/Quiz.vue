<template>
  <section class="quiz">
    <header class="app-header">
      <div class="counter-container">
         <div class="quiz-counter" v-if="stage === 'quiz'">{{currentQuestion}} / {{questions.length}}</div>
        <h2>A játék indítása</h2>
      </div>
      <div class="brand">
        <img src=../assets/images/jti-logo.png alt="">
      </div>
    </header>
    <div class="quiz-anim">
      <lottie :options="defaultOptions" :height="400" :width="400" v-on:animCreated="handleAnimation"/>
    </div>
    <transition name="fade" mode="out-in" v-if="!loading">
      <div :key="currentQuestion" class="quiz-section">

        <div v-if="stage === 'welcome'" class="quiz-home">
          <h1 class="quiz-heading" v-html="title"></h1>
          <a
            href="#start-quiz"
            class="quiz-button"
            @click.prevent="initQuizStage"
            v-if="stage === 'welcome'"
          >Indítás</a>
        </div>

        <div v-if="stage === 'results'">
          <div class="quiz-home">
            <!--
            <Picture class="quiz-img" :url="img"/>
            -->

            <h1 class="quiz-heading" v-html="resultsInfo.text"></h1>
            <p class="quiz-result" v-if="stage === 'results'" v-html="title"></p>
            <a
              href="#restart-quiz"
              class="quiz-button"
              @click.prevent="initWelcomeStage"
            >Újra</a>
          </div>
        </div>

        <div class="quiz-content">

          <div v-if="stage === 'quiz'" class="quiz-game">
            <h1 class="quiz-heading" v-html="title"></h1>

            <ul class="quiz-questions">
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

        </div>
      </div>
    </transition>
    <div class="loader" v-else>
      <span></span>
    </div>

    <div class="footer">
      <span>* az NDN Zrt. 2019. szeptember és 2020. szeptember közti adatai alapján</span>
    </div>
  </section>
</template>

<script>
import { store, mutations, actions } from "../store";
import { version as appVersion } from "../../package.json";
import Lottie from './lottie.vue';
import * as animationData from '../assets/lottie/sample.json';

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
    console.log(this.correctAnswers);
    return {
      loading: true,
      usersAnswer: null,
      defaultOptions: {animationData: animationData.default},
      moviesTitles: [
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
        this.initResultsStage();
      }
    },
    initWelcomeStage() {
      mutations.setStage("welcome");
      mutations.setTitle("Válaszoljon a Compact termékeinkkel kapcsolatos kérdéseinkre és nyerjen!");
      mutations.setImg(welcomeImg);
      mutations.setCurrentQuestion(0);
      mutations.resetAnswers();

      localStorage.appVersion = appVersion;
      localStorage.quizVersion = store.quizVersion;

      this.loading = false;
    },
    initQuizStage(currentQuestion) {
      mutations.setStage("quiz");
      mutations.setTitle("Ez a kérdés?");
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
      
      console.log(this.correctAnswers);

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
      this.anim.playSegments([i*10, i*20], true );
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
