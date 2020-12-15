import Vue from "vue";

export const store = Vue.observable({
  quizVersion: null,
  stage: null,
  title: null,
  question: null,
  img: null,
  questions: [],
  currentQuestion: null,
  answers: []
});

export const mutations = {
  setQuizVersion(version) {
    store.quizVersion = version;
  },
  setStage(stage) {
    store.stage = stage;
  },
  setTitle(title) {
    store.title = title;
  },
  setTagline(tagline) {
    store.tagline = tagline;
  },
  setQuestion(question) {
    store.question = question;
  },
  setImg(img) {
    store.img = img;
  },
  setQuestions(questions) {
    store.questions = questions;
  },
  setCurrentQuestion(n) {
    store.currentQuestion = n;
  },
  addAnswer(answer) {
    store.answers.push(answer);
  },
  setAnswers(answers) {
    store.answers = answers;
  },
  resetAnswers() {
    store.answers = [];
  }
};

export const actions = {

  async fetchData() {
    let res = {"questions":[{"correct":0,frame:[0,100],"answers":["Igen","Nem"],"question":"A JTI a dinamikusan növekvő compact szegmens leggyorsabban növekvő szereplője?","note":"* az NDN Zrt. 2019. szeptember és 2020. szeptember közti adatai alapján"},{"correct":2,frame:[100,215],"answers":["Kicsi, de erős","Könnyed és laza","Modern és minőségi"],"question":"Melyik szavakkal foglalhatóak össze a JTI compact termékei?","note":""},{"correct":0,frame:[215,278],"answers":["Winston blue compact","LD blue compact","Camel blue compact"],"question":"Felismeri az alábbi JTI terméket logó nélkül is?","note":""},{"correct":2,frame:[278,373],"answers":["Winston blue compact","LD blue compact","Camel blue compact"],"question":"Melyik termék rendelkezik parafa filterpapírral?","note":""},{"correct":0,frame:[373,493],"answers":["Winston blue compact","LD blue compact","Camel blue compact"],"question":"Felismeri a terméket a jellemzői alapján?","note":""}],"version":"0.1.0"}
    mutations.setQuizVersion(res.version);
    mutations.setQuestions(res.questions);
  }
};
