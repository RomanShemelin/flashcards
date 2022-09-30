const { EventEmitter } = require('events');
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');

const pathTopic = path.join(__dirname, 'topics');

class View extends EventEmitter {
  #model;

  constructor(model) {
    super();
    this.#model = model;

    // каждый раз когда модель изменяется обновляем отображение
    this.#model.on(
      'update',
      () => this.render()
    );
  }

  render() {
    // Стираем с экрана весь предыдущий текст
    console.clear();
    // отображаем ту страницу, на которой мы сейчас находимся
    switch (this.#model.getPage()) {
      case 'start':
        return this.#renderStartPage();
      // case 'topic':
      //   return this.#renderTopicPage();
      // case 'questions':
      //   return this.#renderQuestionsPage();
      default:
        throw new Error('Wrong page');
    }
  }

  #renderStartPage() {
    // здесь попросим у модели список тем и предоставим пользователю выбор
    // ...
    // теперь уведомим контроллер о том что пользователь выбрал тему
    const themes = fs.readdirSync(pathTopic);
    const str = themes.map((el, index) => (`${index + 1}) ${el}`));
    console.log(`Выберите тему:\n${str.join('\n')}\n`);
    const numberOfTopic = readlineSync.question('> ');

    this.emit('topicChosen', numberOfTopic);
  }
}

module.exports = View;
