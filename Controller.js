class Controller {
  #model;

  #view;

  constructor(model, view) {
    this.#model = model;
    this.#view = view;

    // здесь будем ловить события View и соответственно изменять Model
    this.#view.on('topicChosen', () => this.#model.startChosen());
    this.#view.on('stop', () => this.#model.stopTopic());
  }

  run() {
    // попросим View отобразить первоначальный экран
    this.#view.render();
  }
}

module.exports = Controller;
