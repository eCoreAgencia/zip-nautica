(function($) {
	'use strict';

	var settings = {
		effect: 'overlay'
	};

	var cart = null;

	var helper = {
		openCart : function(){
			var width = $(cart).width() * -1;

			if(settings.effect == "push"){
				$(settings.wrapper).animate({
					marginLeft:width
				});
			}

			$(cart).animate({
				right:0
			});

			$('.sta-cart-overlay').fadeIn();
		},
		closeCart : function(){
			var width = $(cart).width() * -1;

			if(settings.effect == "push"){
				$(settings.wrapper).animate({
					marginLeft:0
				});
			}

			$(cart).animate({
				right:width
			});

			$('.sta-cart-overlay').fadeOut();
		},
		fillCart : function(){ //
			setTimeout(function() {
				vtexjs.checkout.getOrderForm().done(function(orderForm) {

					var items = orderForm.items;
					var i;

					$(cart).find('.sta-cart-total strong').html('R$ ' + helper.toReal(orderForm.value));

					console.log(orderForm)

					$('.sta-cart .openCart > span').html('R$ ' + helper.toReal(orderForm.value));
					$('.openCart').html('<a href="#" class="link-cart"><i class="ico-cart"></i> <i class="cart-qty"> ' + orderForm.items.length + '</i> <span>R$ ' + helper.toReal(orderForm.value) + ' </span></a>');

					$(cart).find('ul').html('');

					if(items.length > 0){
						$('.sta-cart-resume a').removeClass('disabled');

						for(i = 0; i < items.length; i++){
							$(cart).find('ul').append('<li> <div class="sta-cart-pdt-image"><img src="'+items[i].imageUrl+'" /><span class="sta-cart-pdt-qtd-item">' + items[i].quantity + '</span></div> <div class="sta-cart-pdt-info"> <h4>'+items[i].name+'</h4> <button class="remove-item" data-index="'+i+'"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 100 125" enable-background="new 0 0 100 100" xml:space="preserve"><polygon fill="#000" points="88.711,86.588 52.121,50 88.709,13.412 86.588,11.291 50,47.878 13.41,11.291 11.289,13.412   47.878,50 11.289,86.588 13.41,88.709 50,52.12 86.59,88.709 "/></svg><span>remover</span></button> <div class="sta-cart-pdt-qtd"></div> <p>R$: ' + helper.toReal(items[i].listPrice) + '</p> </div> </li>');
						}
					}else{
						$('.sta-cart-resume a').addClass('disabled');
						helper.closeCart();
					}
				});
			}, 500);
		},
		addItem: function(el) {
			var urlTest = ["javascript",":","alert('Por favor, selecione o modelo desejado.');"].join('');
			var url = $(el).attr('href');

			if(url == urlTest){
				alert('Por favor, selecione o modelo desejado.');
				return false;
			} else {

				var cart = "/checkout/cart/add?sku=" + url.split('sku')[1].split('&')[0].split('=')[1] + "&seller=1&redirect=true&sc=1";

				$.ajax({
					url: cart.replace("https://www.kroton.com.br", "").replace("true", "false"),
					type: 'GET',
					crossDomain: true,
					dataType: 'html',
					success: function(){
						helper.openCart();
						helper.fillCart();
					}
				});
			}
		},
		removeItem : function(index){
            vtexjs.checkout.getOrderForm().then(function (orderForm) {
                var item = orderForm.items[index];
                item.index = index;
                return vtexjs.checkout.removeItems([item]);
            }).done(function (orderForm) {
                helper.fillCart();
            });
		},
		toReal : function(val){
			val = val / 100;
			val = val.toFixed(2).toString().replace('.',',');
			val = val.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");

			return val;
		},
		selectSku: function(){
			// #Click add produto vitrine
			$('.product-actions .btn.comprar-product').on('click', function(event) {
				event.preventDefault();
				var idSku = $(this).parent().parent().find('.product-content .content-select-sku > ul > li.active').attr('data-sku');
				var qty = $(this).prev().find('.list-count .result input').val();
				if(idSku == undefined){
					alert('Selecione tamanho ou cor');
				}else{
					var cart = "/checkout/cart/add?sku=" + idSku + "&seller=1&redirect=true&sc=1";

					$.ajax({
						url: cart.replace("https://www.kroton.com.br", "").replace("true", "false"),
						type: 'GET',
						crossDomain: true,
						dataType: 'html',
						success: function(){
							helper.openCart();
							helper.fillCart();
						}
					});
				}
			});

			// Click aumenta quantidade
			$('.list-count .qty-more').on('click', function(event) {
				event.preventDefault();
				var $qty = parseInt($(this).parent().parent().find('.result input').val());
				$(this).parent().parent().find('.result input').attr('value', $qty + 1);
			});

			// Click diminui quantidade
			$('.list-count .qty-less').on('click', function(event) {
				event.preventDefault();
				var $qty = parseInt($(this).parent().parent().find('.result input').val());

				if($qty <= 1) {
					$(this).parent().parent().find('.result input').attr('value', '1');
				}else{
					$(this).parent().parent().find('.result input').attr('value', $qty - 1);
				}
			});

			// Add id sku
			$('.product-insertsku > fieldset > ul > li').each(function (index, item) {
				$(this).parents('.product-insertsku').parent().parent().parent().find('.product-content .content-select-sku > ul').append('<li data-sku="' + $(this).find('.insert-sku-checkbox').attr('rel') + '">' + $(this).find('.insert-sku-quantity').attr('title').split(" ")[0]) + '<li>';
			});

			// Deixa sku ativo
			$('.content-select-sku > ul > li').on('click', function(event) {
				$('.content-select-sku > ul > li').removeClass('active');
				$(this).addClass('active');
			});
		}
	};

	$.fn.vtexcart = function(parameters) {
		var el = this;
		settings = $.extend(settings, parameters);
		var cartHtml = '<div class="sta-cart-overlay"></div><div class="sta-cart-container"> <div class="sta-cart-title"> <button class="sta-cart-close"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47.971 47.971" ><path d="M28.228 23.986L47.092 5.122a2.998 2.998 0 0 0 0-4.242 2.998 2.998 0 0 0-4.242 0L23.986 19.744 5.121.88a2.998 2.998 0 0 0-4.242 0 2.998 2.998 0 0 0 0 4.242l18.865 18.864L.879 42.85a2.998 2.998 0 1 0 4.242 4.241l18.865-18.864L42.85 47.091c.586.586 1.354.879 2.121.879s1.535-.293 2.121-.879a2.998 2.998 0 0 0 0-4.242L28.228 23.986z"/></svg></button> <h3>Minha Compra<span class="qtd-cart"></span></h3> </div> <div class="sta-cart-items"> <ul></ul> </div> <div class="sta-cart-resume"> <span class="sta-cart-sub">Subtotal<strong>R$ 0,00</strong></span> <span class="sta-cart-freight">Frete<strong style="display:none">0</strong><button>Calcular</button><input type="text" /></span> <span class="sta-cart-total">Total: <strong>R$ 0,00</strong></span> <a href="/checkout/#/cart"><span>Finalizar Pedido</span></a> </div> </div>';
		var miniCartHtml = '<a href="#" class="openCart link-cart"><span></span></a>';

		$(el).append(cartHtml);

		if(settings.cartButton){
			if($('.sta-cart .openCart').length == 0){
				$(settings.cartButton).append(miniCartHtml);
			}
		}

		cart = $(el).find('.sta-cart-container');

		helper.fillCart();

		//DIRECTIVES
		$('body').delegate('.comprarNow a','click', function(event){
			helper.addItem($(this));
			event.preventDefault();
		});

		$(settings.buyButton).on('click', function(event){
			helper.addItem($(this));
			event.preventDefault();
		});

		$('.openCart').on('click', function(event){
			helper.openCart();
			event.preventDefault();
		});

		$('.sta-cart-close, .sta-cart-overlay').on('click', function(){
			helper.closeCart();
		});

		$('.sta-cart-container').on('click','.remove-item', function(){
			var index = $(this).data('index');
			helper.removeItem(index);
		});

		$('.sta-cart-resume a').on('click', function(){
			if($(this).hasClass('disabled')){
				return false;
			} else {
				return true;
			}
		});

		$('.sta-cart-freight button').click(function(){
			$(this).hide();
			$('.sta-cart-freight input').show();
		});

		helper.selectSku();

		//Delegate ajax paginação
		$('body.categoria').on('click', '.pager.bottom .pages > li', function(event) {
			var interval = setInterval(function(){
				if ($('.content-select-sku > ul > li').length == 0) {
					helper.selectSku();
					clearInterval(interval);
				}
			},500);
		});
	};

} (jQuery));

$(function() {
    $("body").vtexcart({
        buyButton: $(".buy-button"),
        wrapper: $(".container"),
        effect: "overlay",
        cartButton: $(".sta-cart")
    })
    $('header #mini-cart').click(function(){
    	$('.sta-cart-overlay').show();
    	$('.sta-cart-container').animate({right: 0},300);
    });
});
