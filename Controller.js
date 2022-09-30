class Controller {
  #model;

  #view;

  constructor(model, view) {
    this.#model = model;
    this.#view = view;

    // здесь будем ловить события View и соответственно изменять Model
    this.#view.on('topicChosen', (numberOfTopic) => this.#model.chooseTopic(Number(numberOfTopic)));

    // this.#view.on('')
    // ...
  }

  run() {
    // попросим View отобразить первоначальный экран
    this.#view.render();
  }
}

module.exports = Controller;
