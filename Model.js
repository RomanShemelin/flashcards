const { EventEmitter } = require('events');
const fs = require('fs');
const path = require('path');

const pathTopic = path.join(__dirname, 'topics');

class Model extends EventEmitter {
  // сначала приложение находится на стартовой странице (выбор темы)
  // подумай, какие ещё страницы будут в твоём приложении?
  #page = 'start';

  #topic = 'topic';

  #quest = 'quest';

  #questions = 'questions';

  #answers = 'answers';

  getPage() {
    return this.#page;
  }

  getPageTopic() {
    return this.#topic;
  }

  getPageAllQuestion() {
    return this.#questions;
  }

  // Стартовая страница с темами
  startChosen() {
    this.#page = 'quest'; // Страница выбора темы
    this.emit('update');
  }

  quest() {
    this.emit('update');
  }

  // Финальная страница
  stopTopic() {
    this.#page = 'start';
    this.emit('update');
  }
}

module.exports = Model;
