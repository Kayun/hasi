var answers = Array.prototype.slice.apply(document.querySelectorAll('.js-radio'));
var form = document.querySelector('.js-question-form');
var submit = form.querySelector('.js-question-submit');

function submitForm(event) {
  event.preventDefault();
  console.log(event);
  answers.forEach(function (answer) {
    if (answer.checked) {
      event.target.submit();
      return false;
    }
  });
}

form.addEventListener('submit', submitForm);
submit.addEventListener('click', function () {
  var event = new Event('submit');
  form.dispatchEvent(event);
});

document.addEventListener('keypress', function (event) {
  var code = event.keyCode;
  var char = String.fromCharCode(code).toUpperCase();

  if (code === 13) {
    var event = new Event('submit');
    form.dispatchEvent(event);
    return false;
  }

  answers.forEach(function (answer) {
    var data = answer.dataset.letter;
    if (data === char) {
      answer.checked = true;
      return false;
    }
  })
})
