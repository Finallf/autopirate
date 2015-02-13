// ==UserScript==
// @name			AutoPirate
// @version			1.8
// @description		AutoPirate automatiza a captura na fortaleza pirata no Ikariam
// @downloadURL		http://ikariam.reloaded.com.br/autopirate/autopirate.user.js
// @updateURL		http://ikariam.reloaded.com.br/autopirate/autopirate.meta.js
// @icon			http://ikariam.reloaded.com.br/autopirate/autopirate.png
// @namespace		http://ikariam.reloaded.com.br/
//
// @include			http://s*.ikariam.gameforge.com/*
// @include			http://m*.ikariam.gameforge.com/*
// @exclude			http://support.*.ikariam.gameforge.com/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @require			https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js
// @run-at			document-start
// @grant			GM_addStyle
// @copyright		2015 ReloadeD by Finallf
// @license			GPL version 3; http://www.gnu.org/copyleft/gpl.html
// ==/UserScript==

/* Histórico de versões:
// @history		1.8		Bugfix:	A Captura não mais se auto inicia assim que instala o plugin.
// @history		1.8		Feature: Captura pode ser iniciada por qualquer visão pelo menu do plugin.
// @history		1.8		Feature: Adicionado Suporte a Pausar e Iniciar a captura pirata no menu do plugin.
// @history		1.8		Feature: Adicionado o tempo aproximado para o termino da captura pirata no menu.
// @history		1.8		Feature: Menu persistente, mesmo que mude para outra visão como mostrar mundo ou ilha.
// @history		1.8		Feature: Som de Alerta retirado do codigo em modo data, agora esta na web.
// @history		1.8		Feature: Plugin agora utiliza localStorage para guardar suas variaveis.
// @history		1.8		Feature: Além de abrir o menu pela barra esquerda, agora pode-se fechá-lo também.
//
// @history		1.7		Bugfix: Corrigido o erro em que voltava na tela do mundo e parava o script.
//
// @history		1.6		Feature: Menu melhorado.
// @history		1.6		Feature: Codigo atualizado para retirar deprecariedade (legado).
// @history		1.6		Feature: Funções do menu melhoradas, agora funcionam em qualquer janela.
// @history		1.6		Feature: Update para utilizar a ultima versão do JQuery e JQuery UI.
//
// @history		1.5		Feature: Feita a otimização total das funções.
// @history		1.5		Feature: Adicionado menu para as futuras opções.
//
// @history		1.4		Feature: Alterado nome do script para facilitar atualizações.
// @history		1.4		Feature: Modificado o nome de Ikariam AutoPirate para AutoPirate.
// @history		1.4		Feature: Adicionado a possibilidade de atualizações.
//
// @history		1.3		Bugfix: Tentava abrir a Fortaleza dos Piratas, com a mesma já aberta.
// @history		1.3		Bugfix: Função click_pirateFort entrava em loop infinito, travando o Firefox.
// @history		1.3		Feature: Som do Alerta modificado, pois o mesmo estava muito estridente.
// @history		1.3		Feature: Som do Alerta agora esta em modo data/base64.
//
// @history		1.2		Feature: Adicionado a checagem de existência do captcha.
// @history		1.2		Feature: Após checar o captcha, toca um som de aviso.
// @history		1.2		Feature: Som de Alerta incluido no codigo em modo data.
//
// @history		1.1		Bugfix: Alterado o RegEx das funções click_townView e click_pirateFort.
//
// @history		1.0		Primeira versão funcional.*/

var pauseAP = '';
var timeAP = '';
var menuPermAP = '';
var httpAP = 'http://ikariam.reloaded.com.br/autopirate/';

if ( localStorage.getItem('pauseAP') ){ pauseAP = localStorage.getItem('pauseAP'); }
else { pauseAP = localStorage.setItem('pauseAP', '0'); }
if ( localStorage.getItem('timeAP') ){ timeAP = localStorage.getItem('timeAP'); }
else { timeAP = localStorage.setItem('timeAP', '0'); }
if ( localStorage.getItem('menuPermAP') ){ menuPermAP = localStorage.getItem('menuPermAP'); }
else { menuPermAP = localStorage.setItem('menuPermAP', '0'); }

setTimeout ( function() {						// Verifica a existencia do menu esquerdo.
	if ( $("#leftMenu").length == 0 ) {			// não existe.
		$("body div#container").append('<div id="leftMenu"><div id="js_viewCityMenu" class="slot_menu city_menu" style="z-index:65;"><ul class="menu_slots"><li class="expandable slotAP" style="display: inline-block; width: 53px;" onclick=""><div class="image image_friends" style="background:url('+httpAP+'autopirate.png);"></div><div class="name"><span class="namebox">Auto Pirate</br><small>Configurações</small></span></div></li></ul></div></div>');
		hoverAP();
	} else {									// existe.
		if ( $(".slotAP").length == 0 ) {
			$("div#leftMenu div ul").append('<li class="expandable slotAP" style="display: inline-block; width: 53px;" onclick=""><div class="image image_friends" style="background:url('+httpAP+'autopirate.png);"></div><div class="name"><span class="namebox">Auto Pirate</br><small>Configurações</small></span></div></li>');
			hoverAP();
		}
	}
	function hoverAP() {
		$(".slotAP").hover( function() {
			$(this).stop().animate({width:"199px"}, 300, "swing").parent().parent().css('z-index','120000');
		}, function() {
			$(this).stop().animate({width:"53px"}, 300, "swing").parent().parent().css('z-index','65');
		}).click(  function(){
			menuPermAP = localStorage.getItem('menuPermAP');
			if ( menuPermAP == 0 ){ localStorage.setItem('menuPermAP', '1'); menuAP(); }
			if ( menuPermAP == 1 ){ localStorage.setItem('menuPermAP', '0'); $('#menuAP').remove(); }
		});
	}
	function menuAP() {
		if ( ($('.slotAP').length == 1) && ($('#menuAP').length == 0) ) {
			$('body div#container').append('<div id="menuAP" class="popupMessage focusable focus"><div id="headerAP"><div class="header headerLeft"></div><div class="header headerMiddle"><p>Auto Pirate<span><img class="close_img" src="skin/layout/notes_close.png"></span></p></div><div class="header headerRight"></div></div></div>');
			$('#menuAP .headerMiddle span').css('display', 'block').css('margin', '-15px 0 0').css('text-align', 'right');
			$('#menuAP .headerMiddle p').css('color', '#811709').css('font-weight', 'bold').css('padding', '12px 0 0').css('text-align', 'center');
			$('#menuAP .headerLeft').css('background', 'url('+httpAP+'logotop.png)');
			$('#menuAP .header').css('cursor', '-moz-grab').mouseup( function(){ $(this).css('cursor', '-moz-grab'); } ).mousedown( function(){ $(this).css('cursor', '-moz-grabbing'); } );
			$('#menuAP img').css('cursor', 'pointer').click( function(){ $('#menuAP').remove(); localStorage.setItem('menuPermAP', '0'); } );
			$('#menuAP').append("<div id='contentAP' class='popupContent'><div class='configAP moldAP'></div></div>");
			$('#menuAP').css('margin-top', '30px').draggable({cancel: '#contentAP'}, {opacity: 0.5}, {containment:[-1000,0,4000,1000]}).show();
			$('.moldAP').css('border', '1px dotted #d2ac61').css('margin', '-5px').css('padding', '5px');
			$('.configAP').append("<div id='timeAP' title='Tempo aproximado para o término da captura.'></div>");
			$('#timeAP').css('height', '15px').css('text-align', 'center').css('width', '50px');
			$('.configAP').append("<a class='playAP' title='Inicia a captura automática da Fortaleza dos Piratas.'>Iniciar</a>");
			$('.configAP').append("<a class='stopAP' title='Pausa a captura automática da Fortaleza dos Piratas.'>Pausar</a>");
			$('.configAP a').css('cursor', 'pointer').css('display', 'block').css('padding-top', '35px').css('text-align', 'center').css('text-decoration', 'none').css('width', '50px');
			$('.playAP').css('background', 'url('+httpAP+'play.png)no-repeat center 0');
			$('.stopAP').css('background', 'url('+httpAP+'stop.png)no-repeat center 0');
			if ( pauseAP == 0 ){ $('.stopAP').hide(); }
			if ( pauseAP == 1 ){ $('.playAP').hide(); }
			$('.configAP a').click( function(){
				pauseAP = localStorage.getItem('pauseAP');
				if ( pauseAP == 0 ){
					localStorage.setItem('pauseAP', '1');
					$('.playAP').hide(); $('.stopAP').show(); AutoPirate();
				}
				if ( pauseAP == 1 ){
					localStorage.setItem('pauseAP', '0');
					$('.stopAP').hide(); $('.playAP').show();
				}
			});
		}/* else {
			$('#menuAP').remove();
		}*/
	}
	menuPermAP = localStorage.getItem('menuPermAP');
	if ( menuPermAP == 1 ){ menuAP(); }
}, 500 );

setInterval ( function startCountdown(){
	timeAP = localStorage.getItem('timeAP');
	if( (timeAP - 1) >= 0 ){					// Se o tempo não for zerado
		var time = Math.floor(timeAP / 1000);
		var min = Math.floor(time / 60);		// Pega a parte inteira dos minutos
		var seg = time % 60;					// Calcula os segundos restantes
		min = min <= 9 ? "0"+min : min;
		seg = seg <= 9 ? "0"+seg : seg;
		printTimeAP = min +'m '+ seg+'s';			
		$('#timeAP').html(printTimeAP);			
		localStorage.setItem('timeAP', localStorage.getItem('timeAP') - 1000);	// diminui o tempo
	} else {
		$('#timeAP').html('Capturar');			// Quando o contador chegar a zero faz esta ação
	}
}, 1000 );										// Define que a função será executada novamente em 1000ms = 1 segundo

function AutoPirate() {

	function click_captureBtn(){				// Função que clica no botão "Capturar".
		pauseAP = localStorage.getItem('pauseAP');
		if ( ($('a.capture').length == 1) && ($('a.button_disabled').length == 0) && ( pauseAP == 1 ) ){
			setTimeout( "$('a.capture').click();", delay );
			localStorage.setItem('timeAP', '150000');
			clearInterval( int1 );
			setTimeout( myPause, 151000 );		// pausa por 2.5 minutos e 1 segundo.
			setTimeout( function(){				// Verifica se o captcha esta ativo.
				if ( $("img.captchaImage").length){ alarm(); }
			}, 3000 );
		} else {
			click_pirateFort();
		}
	}
	function click_pirateFort(){				// Função que clica na Fortaleza dos Pirata se a mesma não estiver aberta.
		pauseAP = localStorage.getItem('pauseAP');
		if ( ($(".pirateFortress a").length == 1) && ($("#pirateFortress_c").length == 0) && ( pauseAP == 1 ) ){
			$(".pirateFortress a").click();
		} else {
			click_townView();
		}
	}
	function click_townView(){					// Função que clica em Mostrar Cidade caso não esteja na visão da cidade.
		pauseAP = localStorage.getItem('pauseAP');
		if ( ($("#worldmap_iso").length == 1) || ($("#island").length == 1) && ($("#city").length == 0) && ( pauseAP == 1 ) ){
			$("#js_cityLink a").click();
		}
	}
	function alarm(){
		var times = 2;							// Quantidade de vezes em que o som irá tocar.
		var loop = setInterval( repeat, 7000 );	// Tempo entre os toque.
		function repeat() {
			times--;
			if ( times === 0 ){
				clearInterval(loop);
			}									// O audio a ser tocado em formato DATA: http://software.hixie.ch/utilities/cgi/data/data
			var audioElement = document.createElement('audio');
			audioElement.setAttribute('src', httpAP+'alert.ogg');
			audioElement.play()
		}
		repeat();
	}
	var delay = getRandomInt( 500, 2000 );
	function myPause(){ int1=setInterval( click_captureBtn, delay ); }
	var int1=setInterval( click_captureBtn, delay );
	function getRandomInt( min, max ) {			// Calcular delays aleatórios.
		return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
	}
}
if ( pauseAP == 1 ){ AutoPirate(); }