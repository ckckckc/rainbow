(function(){
  var RS = window.RS = window.RS || {}, config;

  if (RS.config) return;

  config = RS.config = RS.config || {};

  config.defaultSize = {
    "maxWidth": 550,
    "maxHeight": 450
  };

  config.hiddenClass = "none";

})();