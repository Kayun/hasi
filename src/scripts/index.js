import { Calculator } from './calculator';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';
import 'imports-loader?jQuery=jquery!jquery-ui-touch-punch';

$(() => {
  let $fontSwitch = $('.js-font-switch');
  let $font = $('.js-font');

  let $answers = $('.js-option');
  let $form = $('.js-question-form');
  let $submit = $('.js-question-submit');

  let $aside = $('.js-aside');
  let $calculator = $('.js-calculator');

  let $sortContainer = $('.js-sort');
  let $tooltip = $('.js-answer');

  let calcInstance;

  function submitForm(event) {
    event.preventDefault();

    if (!$answers.length) {
      event.target.submit();
      return false;
    }

    $answers.each((index, answer) => {
      if (answer.checked) {
        event.target.submit();
        return false;
      }
    })
  }

  $tooltip.on('click', event => {
    event.stopPropagation();

    if ($(window).width() <= 640) {
      $tooltip.toggleClass('_active');
      $(window).one('click', () => $tooltip.removeClass('_active'))
    }
  })

  $answers.not(':last-child').each((index, answer) => {
    let $row = $(answer).parent();

    if ($row.height() === 14) {
      $row.css('margin-bottom', '8px')
    }
  })

  $sortContainer.length && $sortContainer.sortable({
    stop: (event, ui) => {
      let $counts = $('.js-sort-count', $sortContainer);
      $counts.each((index, item) => $(item).text(index + 1));
    }
  });

  $fontSwitch.on('click', '.font-switch__option', event => {
    let $target = $(event.target);
    let size = $(window).width() <= 768 ? $target.data('mobileSize') : $target.data('size')

    $target.siblings().removeClass('_active')

    $font.css('fontSize', `${size}px`);
    $target.addClass('_active');
  })

  $aside.on('click', '.js-calc-mode', event => {
    let $target = $(event.target);

    $target.toggleClass('_active');
    $aside.toggleClass('counter_mode_calc');

    if ($target.hasClass('_active')) {
      $target.text($target.data('hideText'));
      calcInstance = new Calculator($calculator.get(0));
    } else {
      $target.text($target.data('showText'));
      if (calcInstance) {
        calcInstance.destroy();
        calcInstance = null;
      }
    }
  })

  $form.on('submit', submitForm);

  $submit.on('click', () => $form.trigger('submit'));

  $(document).on('keypress', event => {
    let code = event.which;
    let char = String.fromCharCode(code).toUpperCase();

    if (code === 13) {
      $form.trigger('submit')
      return false;
    }

    $answers.each((index, answer) => {
      let $target = $(answer)
      let data = $target.data('letter');

      if (data === char) {
        $target.prop('checked', !$target.prop('checked'));
        return false;
      }
    })
  })
})


