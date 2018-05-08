$(window).load(function(){
	var fbApp = document.getElementById('fb-comments-app');  
	fbApp.innerHTML = "<fb:comments href='" + document.location.href + "' num_posts='5' width='100%'></fb:comments>"; 
	FB.XFBML.parse(fbApp);
});