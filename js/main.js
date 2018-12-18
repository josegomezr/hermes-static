(function (jQuery) {
  var matched, browser;

  // Use of jQuery.browser is frowned upon.
  // More details: http://api.jquery.com/jQuery.browser
  // jQuery.uaMatch maintained for back-compat
  jQuery.uaMatch = function (ua) {
    ua = ua.toLowerCase();

    var match = /(chrome)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

    return {
      browser: match[1] || "",
      version: match[2] || "0"
    };
  };

  matched = jQuery.uaMatch(navigator.userAgent);
  browser = {};

  if (navigator.userAgent.indexOf("Trident") !== -1 && navigator.userAgent.indexOf("rv:11") !== -1) {
    matched.browser = 'msie';
    matched.version = 11;
  }

  if (matched.browser) {
    browser[matched.browser] = true;
    browser.version = matched.version;
  }

  // Chrome is Webkit, but Webkit is also Safari.
  if (browser.chrome) {
    browser.webkit = true;
  } else if (browser.webkit) {
    browser.safari = true;
  }

  jQuery.browser = browser;
})(jQuery);

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
  var timeout = null;
  var callbackArgs = null;

  var later = function () {
    callback.apply(context, callbackArgs);
    timeout = null;
  };

  return function () {
    if (!timeout) {
      callbackArgs = arguments;
      timeout = setTimeout(later, wait);
    }
  };
}

$.fn.popoverHermes = function (config) {
  config.trigger = 'manual';

  var activePopover = null;

  $(this).each(function (k, i) {
    var self = $(this);
    var target = $(i).attr('data-popover-target');
    var $el = $(target).first().clone(true);
    $el.removeClass('d-none');
    var currconfig = $.extend({}, config, {
      content: config.content || $el
    });
    $(this).popover(currconfig);
    $(this).on('shown.bs.popover', function () {
      activePopover = self;
      if (!$el) {
        return;
      }
      $el.find('.nav-tabs-hover li:first-child a').tab('show');
    });
    $(this).on('click', function () {
      if (!isSM()) {
        self.popover('toggle');
      }
    });
    $(this).on('show.bs.popover', function () {
      if (activePopover) {
        activePopover.popover('hide');
      }
    });
  });
  var clickbox = $(config.container || 'body').get(0);
  window.addEventListener('click', function (e) {
    if (activePopover && !clickbox.contains(e.target)) {
      activePopover.popover('hide');
    }
  });
};

$('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
  if (!$(this).next().hasClass('show')) {
    $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
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
}, 300);

$(window).on('resize', resizeHandler);

$(".carousel-item[data-background-image]").each(function () {
  var $el = $(this);
  console.log($el);
  var $img = $(this).find('img');

  var bgImg = $img.attr('src');
  var extraBgArgs = ($el.attr('data-background-image') || '') + '';

  $img.addClass('d-none');

  if (/holderjs/ig.test(bgImg)) {
    bgImg = '?' + bgImg;
  }

  $el.css('backgroundImage', 'url(' + bgImg + ')');
  // $el.css('backgroundPosition', 'center');
  // $el.css('backgroundSize', '100% 100%')
  // $el.css('backgroundRepeat', 'no-repeat');

  $el.addClass('holderjs');
});

Holder.run();

$(".show-search-bar").on('click', function (e) {
  var $self = $(e.target).closest('button');
  var selector = $self.attr('data-target');
  $(selector).toggleClass('d-none');
  $self.toggleClass('d-none');
});

$(".hide-search-bar").on('click', function (e) {
  var $self = $(e.target).closest('button');
  var selector = $self.attr('data-target');
  $(selector).toggleClass('d-none');
  $(".show-search-bar").toggleClass('d-none');
});

function cambiarTituloForm(title) {
  if (!title) {
    title = $('#titulo-cambiante').attr('data-default-title');
  }

  $('#titulo-cambiante').html(title);
}

function cambiarDireccionForm(direccion) {
  if (!direccion) {
    direccion = 'right';
  }

  var classname = 'justify-content-end';

  if (direccion != 'right') {
    classname = 'justify-content-start';
  }

  $("#floatingFormContainer > .d-flex").removeClass('justify-content-start justify-content-end').addClass(classname);
}

$('#carouselPrincipal').on('slide.bs.carousel', function (e) {
  var $slide = $(e.relatedTarget);

  cambiarTituloForm($slide.find('[data-is-form-title]').html());
  cambiarDireccionForm($slide.attr('data-form-direction'));
});

var $slide = $(".carousel-item").first();
cambiarTituloForm($slide.find('[data-is-form-title]').html());
cambiarDireccionForm($slide.attr('data-form-direction'));

// $('#carouselPrincipal').carousel('pause');

/* UGLY UGLY UGLY HACK FOR IE */

$('[data-popover-target="#valores-popover"]').on('click', function () {
  if (jQuery.browser.msie) {
    var patchedcss = $('#style-fix-valores-popover').text();
    $("#patcher-styles").text(patchedcss);
  }
});
$('[data-popover-target="#canales-popover"]').on('click', function () {
  if (jQuery.browser.msie) {
    var patchedcss = $('#style-fix-canales-popover').text();
    $("#patcher-styles").text(patchedcss);
  }
});
$('[data-popover-target="#documentos-popover"]').on('click', function () {
  if (jQuery.browser.msie) {
    var patchedcss = $('#style-fix-documentos-popover').text();
    $("#patcher-styles").text(patchedcss);
  }
});
$('[data-popover-target="#acerca-hermes-popover"]').on('click', function () {
  if (jQuery.browser.msie) {
    var patchedcss = $('#style-fix-acerca-hermes-popover').text();
    $("#patcher-styles").text(patchedcss);
  }
});
$('[data-popover-target="#zona-clientes-popover"]').on('click', function () {
  if (jQuery.browser.msie) {
    var patchedcss = $('#style-fix-zona-clientes-popover').text();
    $("#patcher-styles").text(patchedcss);
  }
});

if ($.validator) {
  $.validator.messages.required = 'Verifique';
  var ValidatorDefaults = {
    highlight: function(element) {
      $(element).closest('.form-control').addClass('is-invalid');
    },
    unhighlight: function(element) {
      $(element).closest('.form-control').removeClass('is-invalid');
    },
    errorElement: 'div',
    errorClass: 'help-block text-danger',
    errorPlacement: function(error, element) {
      // $form.addClass('was-validated')
      if (element.parent('.input-group').length) {
        error.insertAfter(element.parent());
      } else {
        error.insertAfter(element);
      }
    },
  }

  var formCFG = $.extend({}, ValidatorDefaults, {
    rules:{
      tipo_doc: {
        required: true,
      },
      documento: {
        required: true,
      },
      nombres: {
        required: true,
      },
      apellido_paterno: {
        required: true,
      },
      apellido_materno: {
        required: true,
      },
      departamento: {
        required: true,
      },
      provincia: {
        required: true,
      },
      distrito: {
        required: true,
      },
      domicilio: {
        required: true,
      },
      telefono: {
        required: true,
      },
      email: {
        required: true,
      },
      empresa: {
        required: true,
      },
      detalle: {
        required: true,
      }
    },
    submitHandler: function(){
      grecaptcha.execute();
    }
  })

  $("#form-consulta-sugerencia").validate(formCFG);
}

$("#provincia").slaveSelect({
  fetchUrl: "/assets/provincias.json",
  dependsOn: $('#departamento').eq(0),
  mapRow: function(row){
    return {
      pk: row.prov_id,
      label: row.provincia
    }
  },
  filterRow: function(row){
    return $("#departamento").val() == row.dep_id;
  }
})

$("#distrito").slaveSelect({
  fetchUrl: "/assets/distritos.json",
  dependsOn: $('#provincia').eq(0),
  mapRow: function(row){
    return {
      pk: row.prov_id,
      label: row.distrito
    }
  },
  filterRow: function(row){
    return $("#provincia").val() == row.prov_id;
  }
})

function onAfterSugerenciasSubmit() {
  $("#form-consulta-sugerencia")[0].submit();
}