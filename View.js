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

  #randomGood() {
    const good = ['Что за лев этот тигр?', 'ЕЕЕЕЕЕЕ, это правильно!!!', 'Неплохо', 'Эу, ПАЛЕХЧЕ!', 'Правильно!', 'Волчара!', '+100500 очков Гриффиндору'];
    const randomGood = Math.floor(Math.random() * good.length);
    return good[randomGood];
  }

  #randomBad() {
    const bad = ['УУУууууУуУуУу, ПАнятнА, но ответ:', 'Такое стыдно не знать! Смотри, какой ответ правильный:', 'Как ты дожил(-а) до своих лет? Правильный ответ:', 'Это прикол? Правильный ответ:', '-100500 очков Слизерину! Правильный ответ:'];
    const randomBad = Math.floor(Math.random() * bad.length);
    return bad[randomBad];
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
  //Score
    console.log(`Общий результат: ${this.score} баллов!`);
    console.log(`Выберите тему:\n${str}\n`);
    this.emit('topicChosen');
  }

  #renderQuest() {
    const index = readlineSync.question('> ');

    if (!index) {
      console.log('ПАКА');
      return;
    }

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
      answers[i] = answers[i].toLowerCase();
      if (answerFromUser === answers[i]) {

        counter += 1;
        console.log(chalk.red(`${this.#randomGood()}\n`));
        this.score += 1;
        readlineSync.question('Дальше =>');
      } else {
        console.log(chalk.green(`${this.#randomBad()} ${answers[i]}`));
        readlineSync.question('Дальше =>');
      }
      if (i === (answers.length - 1)) {
        console.clear();
        console.log(`Ты ответил(-а) на ${counter} вопрос(-а,-ов) правильно из ${answers.length}\nА набрал в итоге: ${this.score} балл(-а, -ов)`);
        readlineSync.question('');
      }

    });

    this.emit('stop');
  }
}

module.exports = View;
