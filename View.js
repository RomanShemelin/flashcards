const { EventEmitter } = require('events');
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

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
    switch (this.#model.getPage()) {
      case 'start':
        return this.#renderStartPage();
      case 'quest':
        return this.#renderQuest();
      // case 'questions':
      //   return this.#renderQuestionsPage();
      default:
        throw new Error('Wrong page');
    }
  }

  #renderStartPage() {
    console.clear();
    const themes = fs.readdirSync(pathTopic);
    let str = themes.map((el, index) => (`${index + 1}) ${el}`));
    str = str.join('\n').replace(/.txt/gi, '');
    console.log(`Выберите тему:\n${str}\n`);
    this.emit('topicChosen');
  }

  #renderQuest() {
    const index = readlineSync.question('> ');
    console.clear();
    const nameTopic = fs.readdirSync(pathTopic)[index - 1];
    // Считывание содержимого файла
    let strTopic = fs.readFileSync(`${pathTopic}/${nameTopic}`, 'utf8');
    strTopic = strTopic.split('\n');
    // Вопросы
    const questions = strTopic.filter((el, i) => i % 3 === 0);
    // Ответы
    const answers = strTopic.filter((el, i) => ((i - 1) % 3) === 0);

    // Цикл
    let counter = 0;
    questions.map((el, i) => {
      console.clear();
      console.log(el);
      let answerFromUser = readlineSync.question('');
      answerFromUser = answerFromUser.toLowerCase();
      if (answerFromUser === answers[i]) {
        counter += 1;
        console.log('Неплохо\n');
      } else {
        console.log(`Стыдно такое не знать, но ответ ${answers[i]}`);
        readlineSync.question('Дальше =>');
      }
      if (i === (answers.length - 1)) {
        console.clear();
        console.log(`Ты ответил на ${counter} вопросов правильно из ${answers.length}`);
        readlineSync.question('');
      }
    });

    this.emit('stop');
  }
}

module.exports = View;
