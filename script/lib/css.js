(function(){

  var RS = window.RS = window.RS || {}, css;

  if (RS.css) return;

  css = RS.css = {};

  css.display = function(target, display) {
    target.style.display = display;
  };

})();
