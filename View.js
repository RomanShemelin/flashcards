const { EventEmitter } = require('events');
const readlineSync = require('readline-sync');
const fs = require('fs');
const path = require('path');

const pathTopic = path.join(__dirname, 'topics');

class View extends EventEmitter {
  #model;

  constructor(model, score = 0) {
    super();
    this.#model = model;
    this.score = score

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
    console.log(`Общий результат: ${this.score} баллов!`);
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
    questions.map((el, i) => {
      console.clear();
      console.log(el);
      let answerFromUser = readlineSync.question('');
      answerFromUser = answerFromUser.toLowerCase();
      if (answerFromUser === answers[i]) {
        console.log('Неплохо\n');
        this.score += 1;
      } else {
        console.log(`Стыдно такое не знать, но ответ ${answers[i]}`);
}
      if (i === answers.length - 1) {
        console.log(`Результат теста: ${this.score} баллов!`)

        readlineSync.question('Дальше =>');
      }

    });

    this.emit('stop');
  }
}

module.exports = View;
