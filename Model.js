const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');

const pathTopic = path.join(__dirname, 'topics');

class Model extends EventEmitter {
  // сначала приложение находится на стартовой странице (выбор темы)
  // подумай, какие ещё страницы будут в твоём приложении?
  #page = 'start';

  #topic = 'topic';

  #questions = 'questions';

  #answers = 'answers';

  getPage() {
    return this.#page;
  }

  getPageTopic() {
    return this.#topic;
  }

  getPageAllQuestion() {
    return (this.#questions);
  }

  // Стартовая страница с темами
  startChosen() {
    this.#page = 'chose-Topic'; // Страница выбора темы
    this.#topic = fs.readdirSync(pathTopic); // Массив тем
    this.emit('update');
  }

  get t() { return this.#topic; }

  // Страница с выборанной темой
  chooseTopic(topic) {
    // Обработка выбранного файла
    const nameTopic = this.#topic[topic];
    // Считывание содержимого файла
    let strTopic = fs.readFileSync(`${pathTopic}/${nameTopic}`, 'utf8');
    strTopic = strTopic.split('\n');
    // Вопросы
    this.#questions = strTopic.filter((el, index) => index % 3 === 0);
    // Ответы
    this.#answers = strTopic.filter((el, index) => ((index - 1) % 3) === 0);
    this.emit('update');
  }

  // Финальная страница
  stopTopic() {
    this.#page = 'start';
    this.emit('update');
  }
}
// console.log(Model.pushArray());

// console.log(fs.readdirSync(pathTopic));
// const a = fs.readdirSync(pathTopic);

// let str = fs.readFileSync(`${pathTopic}/${a[1]}`, 'utf8');
// str = str.split('\n');

// const questionStr = str.filter((el, index) => index % 3 === 0);
// const answerStr = str.filter((el, index) => ((index - 1) % 3) === 0);

// console.log(questionStr);
// console.log(answerStr);

module.exports = Model;
