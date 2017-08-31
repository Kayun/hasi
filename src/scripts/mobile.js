import $ from 'jquery';

$(() => {
  let $toggles = $('.js-toggle');

  $toggles.on('touchstart', function(event) {
    event.stopPropagation();

    $(this).toggleClass('_open');
  })
})
