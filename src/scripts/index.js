var answers = Array.prototype.slice.apply(document.querySelectorAll('.js-radio'));

document.addEventListener('keypress', function (event) {
  var char = String.fromCharCode(event.keyCode).toUpperCase();
  answers.forEach(function (answer) {
    var data = answer.dataset.letter;
    if (data === char) {
      answer.checked = true;
      return false;
    }
  })
})
