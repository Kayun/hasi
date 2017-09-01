import $ from 'jquery';

$(() => {
  let $toggles = $('.js-toggle');
  let $togglesOption = $('');

  $toggles.on('touchstart', function(event) {
    event.stopPropagation();

    $(this)
      .toggleClass('_open')
      .next('.js-toggle-container').toggle();
  })
})
