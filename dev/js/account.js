(function($) {
  var $document = $(document),
    body = $('body'),
    accountWrap = $('.account'),
    genderData = $('.form-personal-data-gender'),
    genderRadio = genderData.find('input'),
    businessToggle = $('#business-toggle');

  accountWrap.on('click', '[data-toggle="modal"]', function(event) {
    var id = $(this).attr('href');
    event.preventDefault();

    if ($(this).hasClass('delete')) {
      swal({
        title: "Confirmar exclusão?",
        text: "",
        type: "error",
        confirmButtonColor: "#ef1b27",
        confirmButtonText: "Excluir",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        closeOnConfirm: true,
        html: true,
        showLoaderOnConfirm: true
      }, function(confirm) {
        if (confirm) {
          $('#address-delete').trigger('click');
        }
      });
    } else {
      body.addClass('no-scroll');
      $(id).toggleClass('hide').fadeIn(200);
    }
  });

  accountWrap.on('click', '.close, [data-dismiss="modal"]', function(event) {
    var modal = $(this).closest('.modal');
    event.preventDefault();
    body.removeClass('no-scroll');
    modal.addClass('hide').fadeOut(200);
  });

  /*genderRadio.each(function(index, el) {
    if ($(this).is(':checked')) {
      $(this).parent().addClass('checked');
    }
  });

  genderData.on('change', 'input', function(event) {
    $(this).parent().addClass('checked').siblings().removeClass('checked');
  });*/

  businessToggle.on('click', function(event) {
    event.preventDefault();
  });

  $('.address-form-address-type, .address-form-state').find('.controls').append('<i class="dropdown-icon"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="15" viewBox="0 0 10 15"><path d="M4.998 0L.002 6h9.996zM5.002 15l4.996-6H.002z" fill="#444" fill-rule="evenodd" /></svg></i>');
})(jQuery);
