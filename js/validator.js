class validator {
  status = true;
  errors = [];
  via = "http";
  validators = {
    minLength: 3,
    maxLength: 255,
  };
  msg = {
    required: `Este campo es requerido`,
    minLength: `Longitud no válida. Mínimo __minLength__ caracteres`,
    maxLength: `Longitud no válida. Máximo __maxLength__ caracteres`,
    email: `El campo de email no es válido`,
    integer: `El campo debe ser de tipo entero`,
    alphanumeric: `Solo se permiten letras y numeros sin espacios`,
    url: `El campo debe ser una URL válida`,
  };

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

  setAjax() {
    this.via = "ajax";
    return this;
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
      } else {
        if (this.via == "ajax") {
          e.preventDefault();
          this.submitHandler();
          this.form.reset();
        } else {
        }
      }
    });
  }

  validateInputs() {
    this.inputs.forEach((input) => {
      input.addEventListener("input", () => {
        this.resetValidation();
        this.validateInput(input);
      });
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

  submitHandler() {
    let data = new FormData(this.form);
    fetch(this.form.action, {
      method: this.form.method,
      body: data,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  init() {
    this.validateForm();
    this.validateInputs();
    return this;
  }
}

validator.prototype._required = function (input) {
  if (input.value.trim() === "" || input.value.length < 1) {
    this.setError(input, this.msg.required);
  }
};

validator.prototype._length = function (input) {
  let minLength =
    input.dataset.validators_minlength !== undefined
      ? Number(input.dataset.validators_minlength)
      : this.validators.minLength;
  let maxLength =
    input.dataset.validators_maxlength !== undefined
      ? Number(input.dataset.validators_maxlength)
      : this.validators.maxLength;
  let msg;
  if (input.value.length < minLength) {
    msg = this.msg.minLength.replace("__minLength__", minLength);
    this.setError(input, msg);
  }
  if (input.value.length > maxLength) {
    msg = this.msg.maxLength.replace("__maxLength__", maxLength);
    this.setError(input, msg);
  }
};

validator.prototype._email = function (input) {
  let value = input.value;
  let pattern = new RegExp(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i
  );
  if (!pattern.test(value) && value.trim() != "") {
    this.setError(input, this.msg.email);
  }
};

validator.prototype._integer = function (input) {
  let value = input.value;
  let msg = this.msg.integer;
  let pattern = new RegExp(/^[0-9]+$/);
  if (!pattern.test(value) && value.trim() !== "") {
    this.setError(input, msg);
  }
};

validator.prototype._alphanumeric = function (input) {
  let value = input.value;
  let pattern = new RegExp(/^[a-zA-Z0-9]+$/);
  if (!pattern.test(value) && value.trim() !== "") {
    this.setError(input, this.msg.alphanumeric);
  }
};

validator.prototype._url = function (input) {
  let value = input.value;
  let pattern = new RegExp(
    /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i
  );
  if (!pattern.test(value) && value.trim() != "") {
    this.setError(input, this.msg.url);
  }
};
