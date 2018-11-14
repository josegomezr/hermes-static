$(".carousel").carousel();

function isSM() {
  var $el = $("<div></div>").addClass("d-block d-sm-block d-md-none");
  $el.appendTo('body');
  var visible = $el.is(':visible');
  $el.remove();

  return visible;
}


function throttle(callback, wait, context) {
  context = context || this;
  let timeout = null
  let callbackArgs = null

  const later = function () {
    callback.apply(context, callbackArgs)
    timeout = null
  }

  return function () {
    if (!timeout) {
      callbackArgs = arguments
      timeout = setTimeout(later, wait)
    }
  }
}

$.fn.popoverHermes = function (config) {
  config.trigger = 'manual';

  var activePopover = null;

  $(this).each(function (k, i) {
    var self = $(this);
    var target = $(i).attr('data-popover-target');
    var $el = $(target).first().clone(true);
    $el.removeClass('d-none');
    var currconfig = Object.assign({}, config, {
      content: config.content || $el,
    })
    $(this).popover(currconfig);
    $(this).on('shown.bs.popover', function () {
      activePopover = self;
      if (!$el) {
        return;
      }
      $el
        .find('.nav-tabs-hover li:first-child a')
        .tab('show');
    });
    $(this).on('click', function () {
      if (!isSM()) {
        self.popover('toggle');
      }
    })
    $(this).on('show.bs.popover', function () {
      if (activePopover) {
        activePopover.popover('hide')
      }
    })
  });
  var clickbox = $(config.container || 'body').get(0)
  window.addEventListener('click', function (e) {
    if (activePopover && !clickbox.contains(e.target)) {
      activePopover.popover('hide')
    }
  });
}
$('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
  if (!$(this).next().hasClass('show')) {
    $(this)
      .parents('.dropdown-menu')
      .first()
      .find('.show')
      .removeClass("show");
  }
  var $subMenu = $(this).next(".dropdown-menu");
  $subMenu.toggleClass('show');

  $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
    $('.dropdown-submenu .show').removeClass("show");
  });

  return false;
});

$('.popover-main-hermes').popoverHermes({
  // container: $("#here")[0],
  boundary: $("#here")[0],
  offset: 100,
  placement: "bottom",
  // fallbackPlacement: 'flip',
  html: true,
  trigger: 'manual',
  template: '<div class="popover popover-fullwidth popover-adjust" role="tooltip"><div class="arrow"></div><h3 class="popover-header"></h3><div class="popover-body"></div></div>'
});

var resizeHandler = throttle(function () {
  if (isSM()) {
    $('.popover-main-hermes').popover('hide');
  }
}, 300)

$(window).on('resize', resizeHandler);


$(".carousel-item[data-background-image]").each(function () {
  var $el = $(this);
  console.log($el);
  var $img = $(this).find('img');

  var bgImg = $img.attr('src');
  var extraBgArgs = ($el.attr('data-background-image') || '') + '';

  var cssRule =  + extraBgArgs + ';';

  $img.addClass('d-none');
  
  if (/holderjs/ig.test(bgImg)) {
    bgImg = '?'+bgImg
  }

  $el.css('backgroundImage', 'url(' + bgImg + ')');
  // $el.css('backgroundPosition', 'center');
  // $el.css('backgroundSize', '100% 100%')
  // $el.css('backgroundRepeat', 'no-repeat');

  $el.addClass('holderjs');
});


Holder.run();


$(".show-search-bar").on('click', function(e){
  var $self = $(e.target).closest('button')
  var selector = $self.attr('data-target');
  $(selector).toggleClass('d-none');
  $self.toggleClass('d-none');
})

$(".hide-search-bar").on('click', function(e){
  var $self = $(e.target).closest('button')
  var selector = $self.attr('data-target');
  $(selector).toggleClass('d-none');
  $(".show-search-bar").toggleClass('d-none');
})

function cambiarTituloForm(title) {
  if(!title){
    title = $('#titulo-cambiante').attr('data-default-title');
  }

  $('#titulo-cambiante').html(title);
}

function cambiarDireccionForm(direccion) {
  if(!direccion){
    direccion = 'right'
  }

  var classname = 'justify-content-end'

  if (direccion != 'right') {
    classname = 'justify-content-start'
  }

  $("#floatingFormContainer > .d-flex")
    .removeClass('justify-content-start justify-content-end')
    .addClass(classname);
}

$('#carouselPrincipal').on('slide.bs.carousel', function (e) {
  var $slide = $(e.relatedTarget);

  cambiarTituloForm($slide.find('[data-is-form-title]').html())
  cambiarDireccionForm($slide.attr('data-form-direction'))
})

var $slide = $(".carousel-item").first();
cambiarTituloForm($slide.find('[data-is-form-title]').html());
cambiarDireccionForm($slide.attr('data-form-direction'))

$('#carouselPrincipal').carousel('pause');