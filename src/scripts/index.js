import { Calculator } from './calculator';
import $ from 'jquery';
import 'jquery-ui/ui/widgets/sortable';


$(() => {

  (function( $ ) {

    $.support.touch = typeof Touch === 'object';

    if (!$.support.touch) {
      return;
    }

    var proto =  $.ui.mouse.prototype,
      _mouseInit = proto._mouseInit;

    $.extend( proto, {
      _mouseInit: function() {
        this.element
          .bind( "touchstart." + this.widgetName, $.proxy( this, "_touchStart" ) );
        _mouseInit.apply( this, arguments );
      },

      _touchStart: function( event ) {
        if ( event.originalEvent.targetTouches.length != 1 ) {
          return false;
        }

        this.element
          .bind( "touchmove." + this.widgetName, $.proxy( this, "_touchMove" ) )
          .bind( "touchend." + this.widgetName, $.proxy( this, "_touchEnd" ) );

        this._modifyEvent( event );

        $( document ).trigger($.Event("mouseup")); //reset mouseHandled flag in ui.mouse
        this._mouseDown( event );

        return false;
      },

      _touchMove: function( event ) {
        this._modifyEvent( event );
        this._mouseMove( event );
      },

      _touchEnd: function( event ) {
        this.element
          .unbind( "touchmove." + this.widgetName )
          .unbind( "touchend." + this.widgetName );
        this._mouseUp( event );
      },

      _modifyEvent: function( event ) {
        event.which = 1;
        var target = event.originalEvent.targetTouches[0];
        event.pageX = target.clientX;
        event.pageY = target.clientY;
      }

    });

  })($);


  let $fontSwitch = $('.js-font-switch');
  let $font = $('.js-font');

  let $answers = $('.js-option');
  let $form = $('.js-question-form');
  let $submit = $('.js-question-submit');

  let $aside = $('.js-aside');
  let $calculator = $('.js-calculator');

  let $sortContainer = $('.js-sort');

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

  $sortContainer.length && $sortContainer.sortable({
    stop: (event, ui) => {
      let $counts = $('.js-sort-count', $sortContainer);
      console.log($counts);
      $counts.each((index, item) => $(item).text(index + 1));
    }
  });

  $fontSwitch.on('click', '.font-switch__option', event => {
    let $target = $(event.target);
    let size = $target.data('size')

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


