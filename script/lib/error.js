(function(){
  var RS = window.RS = window.RS || {}, error;

  if (RS.error) return;

  var templates = {
    "typeError" : {"name" : "typeError", "URL" : "/script/template/typeError.html"},
  };

  error = RS.error = RS.error || {};

  error.showUploadTypeError = function() {
    var typeError = templates.typeError;

    document.body.appendChild(typeError);

    typeError.classList.add("animating");

    setTimeout(function(){
      typeError.classList.remove("animating");
      templates.typeError = typeError;
    }, 4000);
  };

  (function getTemplates() {
    var link,
        parser = new DOMParser();

    for (var type in templates) {
      link = new XMLHttpRequest();
      link.open("GET", templates[type].URL, true);

      link.onload = function(type) {
        var name = templates[type].name;
        templates[name] = parser.parseFromString(this.responseText, "text/xml").documentElement;
      }.bind(link, type);

      link.send();
    }
  })();

})();