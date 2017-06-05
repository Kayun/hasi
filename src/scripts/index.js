import { Calculator } from './calculator';

let answers = Array.prototype.slice.apply(document.querySelectorAll('.js-radio'));
let form = document.querySelector('.js-question-form');
let submit = form.querySelector('.js-question-submit');
let aside = document.querySelector('.js-aside');
let calculator = aside.querySelector('.js-calculator');

let calcInstance;

function submitForm(event) {
  event.preventDefault();

  answers.forEach(answer => {
    if (answer.checked) {
      event.target.submit();
      return false;
    }
  });
}

aside.addEventListener('click', event => {
  let target = event.target;

  if (!target.closest('.js-calc-mode')) return;

  target.classList.toggle('_active');
  aside.classList.toggle('counter_mode_calc');

  if (target.classList.contains('_active')) {
    target.innerHTML = target.dataset.hideText;
    calcInstance = new Calculator(calculator);
  } else {
    target.innerHTML = target.dataset.showText;
    if (calcInstance) {
      calcInstance.destroy();
      calcInstance = null;
    }
  }
})

form.addEventListener('submit', submitForm);
submit.addEventListener('click', () => {
  let event = new Event('submit');
  form.dispatchEvent(event);
});

document.addEventListener('keypress', event => {
  let code = event.keyCode;
  let char = String.fromCharCode(code).toUpperCase();

  if (code === 13) {
    let event = new Event('submit');
    form.dispatchEvent(event);
    return false;
  }

  answers.forEach(answer => {
    let data = answer.dataset.letter;
    if (data === char) {
      answer.checked = true;
      return false;
    }
  })
})
