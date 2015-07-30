;(function(window, document, $){
  $(document).ready(function(){
    $('.app-image img').on('ab-color-found', function(e, data){
      $(this).parents('.app-info').css({ background: data.color });
      var contrastingColor = getContrastingColor(data.color);
      $('.app-image .app-store-link').css({ color: 'white' });
      $('.app-description h1').css({ color: contrastingColor });
      $('.app-description p').css({ color: contrastingColor });
      $('.app-description a').css({ color: contrastingColor });
    });
    $.adaptiveBackground.run();
  });
})(window, document, jQuery)

function getContrastingColor(hexcolor){
	var r = parseInt(hexcolor.substr(0,2),16);
	var g = parseInt(hexcolor.substr(2,2),16);
	var b = parseInt(hexcolor.substr(4,2),16);
	var yiq = ((r*299)+(g*587)+(b*114))/1000;
	return (yiq >= 128) ? 'black' : 'white';
}
