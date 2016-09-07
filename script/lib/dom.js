(function(){

  var RS = window.RS = window.RS || {};

  if (RS.bindElements) return;

  RS.bindElements  = function(elementList, dist){
    var existVarNames = [];

    for (var i = 0, len = elementList.length ; i < len ; i ++ ) {
      var e = elementList[i];

      if (inArray(elementList[i].name, existVarNames)) {
        throw new Error("\"" + elementList[i].name + "\" already set in the element list.");
      }

      if (e.method === "id" || !e.method) {
        dist[e.name] = document.getElementById(e.selector);
        existVarNames.push(elementList[i].name);
        continue;
      }

      if (e.method === "qs") {
        dist[e.name] = document.querySelector(e.selector);
        existVarNames.push(elementList[i].name);
        continue;
      }

      if (e.method === "qsa") {
        dist[e.name] = document.querySelectorAll(e.selector);
        existVarNames.push(elementList[i].name);
        continue;
      }
    }
  };

  function inArray(name, nameArray) {
    return nameArray.indexOf(name) !== -1;
  }

})();