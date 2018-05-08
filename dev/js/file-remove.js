$(document).ready(function(){
	function removejscssfile(filename, filetype){
	    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"
	    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"
	    var allsuspects=document.getElementsByTagName(targetelement)
	    for (var i=allsuspects.length; i>=0; i--){
	    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
	        allsuspects[i].parentNode.removeChild(allsuspects[i])
	    }
	}
	removejscssfile("style.css","css") 
	removejscssfile("somescript.js", "js") // Caso seja necessario remover alguma ocorrencia de script
	removejscssfile("bootstrap.min.css", "css") // Remove o bootstrap da pagina de meus pedidos e minha conta
});