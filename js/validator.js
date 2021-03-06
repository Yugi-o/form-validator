class validator {
  status = true;
  errors = [];

  constructor(formId) {
    this.setForm(formId);
    this.setInputs();
    this.parseInputs();
  }

  setForm(formId) {
    this.form = document.getElementById(formId);
  }

  setInputs() {
    this.inputs = document.querySelectorAll(`#${this.form.id} .validator`);
  }

  parseInputs() {
    this.inputs.forEach((input) => {
      this.appendErrorsTag(input);
    });
  }

  appendErrorsTag(input) {
    let parent = input.parentNode;
    let span = document.createElement("SPAN");
    span.setAttribute("class", "error-msg");
    parent.appendChild(span);
  }

  validateForm() {
    this.form.addEventListener("submit", (e) => {
      this.resetValidation();
      this.inputs.forEach((input) => {
        this.validateInput(input);
      });
      if (!this.status) {
        e.preventDefault();
        console.log("Ha ocurrido un error de validación");
      } else {
        e.preventDefault();
        console.log("El formulario se ha enviado");
      }
    });
  }

  validateInput(input) {
    let validators = input.dataset.validators;
    if (validators !== undefined) {
      validators = validators.split(" ");
      validators.forEach((validator) => {
        this[`_${validator}`](input);
      });
    }
  }

  setError(input, msg) {
    this.status = false;
    this.setStackError(input, msg);
    this.setErrorMessage(input, msg);
  }

  setStackError(input, msg) {
    this.errors.push({
      input,
      msg,
    });
  }

  setErrorMessage(input, msg) {
    let span = input.nextElementSibling;
    span.innerHTML += `${msg}<br>`;
  }

  resetValidation() {
    this.status = true;
    this.resetStackError();
    this.resetErrorMessages();
  }

  resetStackError() {
    this.errors = [];
  }

  resetErrorMessages() {
    let spans = document.querySelectorAll(`#${this.form.id} .error-msg`);
    spans.forEach((span) => {
      span.innerHTML = "";
    });
  }

  init() {
    this.validateForm();
    return this;
  }
}

validator.prototype._required = function (input) {
  let value = input.value;
  let msg = "Este campo es requerido";
  if (value.trim() === "" || value.length < 1) {
    this.setError(input, msg);
  }
};

validator.prototype._length = function (input) {};
