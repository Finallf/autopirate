// ==UserScript==
// @name			Ikariam AutoPirate
// @version			1.1
// @namespace		http://reloaded.com.br/ikariam/iap
// @description		AutoPirate automatiza a captura na fortaleza pirata no Ikariam
// $icon			http://reloaded.com.br/ikariam/iap/icon.png
// @include			http://s*.ikariam.gameforge.com/*
// @include			http://m*.ikariam.gameforge.com/*
// @exclude			http://support.*.ikariam.gameforge.com/*
// @run-at			document-start
// @copyright		2015 ReloadeD by Finallf
// @license			GPL version 3; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

function resolve_captcha(){
	var captcha=document.evaluate("//img[contains(@class,'captchaImage')]", document.body, null, 9, null).singleNodeValue;
	if ( captcha ){ delay = getRandomInt (1000, 2000); alarm(); }
}

function click_townView(){
	var townView=document.evaluate("//a[@title='Inspecionar a cidade selecionada']", document.body, null, 9, null).singleNodeValue;   
	if ( townView ){ delay = getRandomInt (1000, 2000); townView.click(); }
}

function click_pirateFort(){
	var pirateFort=document.evaluate("//a[contains(@title,'Fortaleza dos Piratas')]", document.body, null, 9, null).singleNodeValue;   
	if ( pirateFort ){ pirateFort.click(); }
	else{ delay = getRandomInt (1000, 2000); click_townView(); }
}

/* click_captureBtn() é a função que clica no botão "Capturar" a cada 2.5 minutos.
   Se por algum motivo sair da fortaleza pirata, temos que voltar para a visão da cidade,
   e depois para a fortaleza pirata, por isso temos também click_townView() e click_pirateFort().
*/

function click_captureBtn(){
	var captureBtn=document.evaluate("//a[contains(@class,'button capture')]", document.body, null, 9, null).singleNodeValue;
	if ( captureBtn  ){ captureBtn.click();
	//setTimeout( clickBtn, 1500 );  // Ir para a próxima cidade.
	window.clearInterval(int1);
	setTimeout( myPause, 151000 ); // pausa por 2.5 minutos e 1 segundo.
}
	else{ delay = getRandomInt (1000, 2000); click_pirateFort(); }
}

function alarm(){
	var times = 1;
	var loop = setInterval(repeat, 7000);
	
	function repeat() {
		times--;
		if (times === 0){
			clearInterval(loop);
		}
		var audioElement = document.createElement('audio');
		audioElement.setAttribute('src', 'alert.ogg');
	
		audioElement.play()
	}
	repeat();
}

var delay = getRandomInt (1000, 3000);

function myPause(){  int1=setInterval( click_captureBtn, delay); }

var int1=setInterval( click_captureBtn, delay);

//************ calcular delays aleatórios **************
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}