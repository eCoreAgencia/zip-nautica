var userFavorites = {
	config: {
		max: 20,
		entity: 'FV',
		storeName: 'zipnautica',
		thumbSize:{
			width: 230,
			height: 240
		},
		messages:{
			add: 'Produto adicionado com sucesso!',
			remove: 'Produto removido com sucesso!',
			limit: 'Você atingiu o limite de produtos em sua lista de desejos!',
			error: 'Um erro ocorreu, por favor tente novamente mais tarde!',
			loggedOut: 'É necessário logar para adicionar produtos a sua lista de desejos.',
			oLimit: 'Não foi possível adicionar o produto, você já atingiu o limite de produtos em sua lista de desejos!',
		}
	},
	user: {
		list: [],
		email: null,
		listId: null,
		logged: false,
	},
	currentProduct: $('#___rc-p-id').attr('value'),
	entityUrl: '//api.vtexcrm.com.br/zipnautica/dataentities/FV',
	init: function(customFn, self = this){
		if(!$('#popup-wrapper').length){
			$('body').append('<div id="popup-wrapper"></div>');
		}
		vtexjs.checkout.getOrderForm().done(function(orderForm){
			self.user.logged = orderForm.loggedIn;
			self.user.email = orderForm.clientProfileData.email;
			self.getFavList();
			self.render();
			customFn();
		});

	},
	getProducts : function(items,self = this){
		var search = '';
		if(items.length){
			$.each(items,function(i){
				if(i){
					search += '&fq=productId:';
				}
				search += items[i];
			});
			$.ajax({
				url: '/api/catalog_system/pub/products/search?fq=productId:'+search,
			    Accept: 'application/vnd.vtex.ds.v10+json',
			    'Content-Type': 'application/json',
			    success: function(data){
			    	self.renderProducts(data);
			    },
			    error: function(data){
			    	console.log(data);
			    }
			});
		}
	},
	getFavList : function(self = this){
		if(self.user.logged){
			$.ajax({
				url: self.entityUrl+'/search?userEmail='+self.user.email+'&_fields=id,userEmail,favList',
			    Accept: 'application/vnd.vtex.ds.v10+json',
			    'Content-Type': 'application/json',
			    async: false,
			    success: function(data){
			    	if(data.length){
				    	self.user.listId = data[0].id;
						self.user.list = JSON.parse(data[0].favList);
						if($('#favList').length){
							self.getProducts(self.user.list);
						}
					}
			    }
			});
		}
	},
	render: function(self = this){
		$('div#favToggle').each(function(){
			$(this).each(function(){
				var $class = $(this).attr('class');
				if(self.user.logged){
					if(self.user.list.indexOf(parseInt(self.currentProduct)) > -1){
						$class += ' remove';
					}
				}
				$(this).replaceWith('<button name="favToggle" class="'+$class+'" id="favToggle"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 455 455" width="28" height="28"><path d="M326.632 10.346c-38.733 0-74.991 17.537-99.132 46.92-24.141-29.384-60.398-46.92-99.132-46.92C57.586 10.346 0 67.931 0 138.714 0 194.14 33.05 258.249 98.23 329.26c50.161 54.647 104.728 96.959 120.257 108.626l9.01 6.769 9.01-6.768c15.529-11.667 70.098-53.978 120.26-108.625C421.949 258.251 455 194.141 455 138.714c0-70.783-57.586-128.368-128.368-128.368zm8.034 298.628c-41.259 44.948-85.648 81.283-107.169 98.029-21.52-16.746-65.907-53.082-107.166-98.03C61.236 244.592 30 185.717 30 138.714c0-54.24 44.128-98.368 98.368-98.368 35.694 0 68.652 19.454 86.013 50.771l13.119 23.666 13.119-23.666c17.36-31.316 50.318-50.771 86.013-50.771 54.24 0 98.368 44.127 98.368 98.368 0 47.005-31.237 105.88-90.334 170.26z" fill="#FFF"/></svg></button>');
			});
			$('#favToggle').click(function(){
				if(self.user.logged){
					if($(this).hasClass('remove')){
						self.remove();
					}else{
						if(self.user.list.length < 20){
							self.add();
						}else{
							self.popup('oLimit');
						}
					}
				}else{
					self.popup('loggedOut');
				}
			});
		});
		if(self.user.logged){
			$('div#favList').each(function(){
				$(this).replaceWith('<ul id="favList"></ul>');
				if(!self.user.list.length){
					$('#favList').append('<li class="mssg-noProduct">Nenhum produto foi encontrado em sua lista de desejos.</li>');
				}
			});
		}
	},
	add: function(self = this){
		self.user.list.push(parseInt(self.currentProduct));
		self.update('add');
	},
	remove: function(id=0,self = this){
		if(!id){
			id = self.currentProduct;
		}
		for(var i = 0; i < self.user.list.length; i++){
			if(self.user.list[i] == id){
				self.user.list.splice(i,1);
			}
		}
		self.update('remove',id);
	},
	update: function(type, prodId, self = this){
		var list = JSON.stringify(self.user.list);
		var jsonup = {"favList": list};
		var jtype = 'PATCH';
		var url = self.entityUrl+'/documents';
		if(!self.user.listId){
			jsonup['userEmail'] = self.user.email;
		}else{
			url += '/'+self.user.listId;
		}
		$.ajax({
			url: url,
        	type: jtype,
		    data: JSON.stringify(jsonup),
		    headers:{
		    	'Content-Type': 'application/json',
		    	Accept: 'application/vnd.vtex.ds.v10+json',
		    },
			success: function(data){
				console.log(data);
				$('#favToggle').each(function(){
					if($(this).hasClass('remove')){
						$(this).removeClass('remove');
					}else{
						$(this).addClass('remove');
					}
				});
				$('#favList').find('li#'+prodId).fadeOut(300, function(){$(this).remove();});
				self.popup(type);

				// geek 10 //
					if(userFavorites.user.list.length){
						$('.favorite-fixed').each(function(){
							$(this).find('a').attr('href', '/Account/favoritos');
							$(this).fadeIn();
						});
					}else{
						$('.favorite-fixed').fadeOut();
					}
				// geek 10 //

			},
			error: function(){
				self.popup('error');
			}
		});
	},
	renderProducts: function(data, self = this){
		$.each(data,function(index){
			if(index > self.config.max - 1){
				return false;
			}
			var $url = this.link;
			var $id = this.productId;
			var $name = this.productName;
			var $bestPrice = String(this.items[0].sellers[0].commertialOffer.Price.toFixed(2)).replace('.',',').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
			var $listPrice = String(this.items[0].sellers[0].commertialOffer.PriceWithoutDiscount.toFixed(2)).replace('.',',').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
			var $imgId = this.items[0].images[0].imageId;
			var $imgUrl = this.items[0].images[0].imageUrl.replace($imgId, ($imgId+'-'+self.config.thumbSize.width+'-'+self.config.thumbSize.height));
			var $img = '<img src="'+$imgUrl+'" alt="'+this.items[0].images[0].imageText+'" />';

			var prod = '<li id="'+$id+'"><a title="'+$name+'" href="'+$url+'" class="productShelf"><span class="prod-image">'+$img+'</span><article><h3>'+$name+'</h3>';
			if(this.items[0].sellers[0].commertialOffer.AvailableQuantity > 0){
				if ($bestPrice < $listPrice ){
					'<span class="oldPrice">de: <em>R$ '+$listPrice+'</em></span>';
				}
				prod += '<span class="bestPrice">R$ '+$bestPrice+'</span>';
				prod += '<span class="btn look-product">Comprar</span>';
			}else{
				prod += '<span class="outOfStock">Produto Esgotado</span><div class="opacity"></div>';
			}
			prod += '</article></a><button name="remove" class="remove" data-id="'+$id+'"><span>Remover</span></button></li>';
			$('#favList').append(prod);
		});
		$('#favList').find('button.remove').click(function(){
			self.remove($(this).attr('data-id'));
		});
	},
	popup: function(type, self = this){
		var popup = '<div class="popup"><button name="close-popup">Fechar</button>';
		popup += '<p class="message col-xs-12">'+self.config.messages[type]+'</p>';
		if(type == 'loggedOut'){
			popup += '<a class="logIn" href="/login?ReturnUrl='+window.location.pathname+'">Entrar</a>';
		}
		popup += '</div>';
		$('#popup-wrapper').append(popup);
		$('#popup-wrapper').css('display', 'flex').animate({'opacity': '1'}, 300);
		$('#popup-wrapper').click(function(){
			$(this).animate({'opacity': '0'}, 300).css('display', 'none');
			$(this).find('.popup').remove();
		});
		$('button[name=close-popup').click(function(){
			$('#popup-wrapper').animate({'opacity': '0'}, 300).css('display', 'none');
			$('#popup-wrapper').find('.popup').remove();
		});
		$('#popup-wrapper .popup').click(function(e){
			e.stopPropagation();
		});
	}
};
userFavorites.init(function(){
	if(userFavorites.user.list.length){
		$('.favorite-fixed').each(function(){
			$(this).find('a').attr('href', '/Account/favoritos');
			$(this).fadeIn();
		});
	}
});