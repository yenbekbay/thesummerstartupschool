;(function(window, document, $){
  $(document).ready(function(){
    $('.app-icon-image img').on('ab-color-found', function(e, data){
      console.log("test");
      $(this).parents('.app-icon-image-wrapper').css({ background: data.color });
    });
    $.adaptiveBackground.run();
  });
})(window, document, jQuery)
