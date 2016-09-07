(function(){
  var RS, Rainbow, doms = {}, donwloadRainbow,
      elementList = [
        {"name" : "can", "selector" : "rainbow"},
        {"name" : "uploadBtn", "selector" : "btn-upload"},
        {"name" : "file", "selector" : "file"},
      ];
  var URL = window.URL = window.URL || window.webkitURL;

  function uploadFile() {
    doms.file.click();
  }

  function checkFile() {
    var file,
        imageType = /^image\//;
console.log(event.target.files);
    if (event.target.files.length == 0) return;

    file = event.target.files[0];

    if (!imageType.test(file.type)) {
      RS.error.showUploadTypeError();
      doms.file.value = null;
      return;
    }

    drawFileToCanvas(file);
  }

  function drawFileToCanvas(file) {
    var img = document.createElement("img"),
        src = URL.createObjectURL(file);

    img.src = src;

    img.onload =function(file){
      var img = this,
          imageSize = {
            "width"    : img.width, 
            "height"   : img.height, 
            "gradient" : img.height / img.width
          },
          resizeSize = RS.Rainbow.prototype.getResizeSize(imageSize, RS.config.defaultSize);

      img.width = resizeSize.width;
      img.height = resizeSize.height;

      Rainbow.resizeCanvas(resizeSize);

      Rainbow.drawImage({
        "image" : img,
        "srcx"  : 0,
        "srcy"  : 0,
        "srcw"  : resizeSize.width,
        "srch"  : resizeSize.height,
        "mode"  : 2
      });

      Rainbow.applyRainbow();

      clearFile(file);

      revokeURL(img.src);

    }.bind(img, file);

    img.src = src;
  }

  function clearFile(file) {
    console.log(file);
  }

  function revokeURL(url) {
    URL.revokeObjectURL(url);
  }

  function rainbowInit() {
    Rainbow = new RS.Rainbow(doms.can);

    Rainbow.setImageSmoothingEnabled(false);
  }

  function downloadInit() {
    doms.donwloadCanvas = document.createElement("canvas");

    donwloadRainbow = new RS.Rainbow(doms.donwloadCanvas);

    donwloadRainbow.setImageSmoothingEnabled(false);
  }

  document.addEventListener("DOMContentLoaded", function(){
    RS = window.RS;

    RS.bindElements(elementList, doms);

    rainbowInit();

    downloadInit();

    doms.uploadBtn.addEventListener("click", uploadFile, false);

    doms.file.addEventListener("change", checkFile, false);
  });

})();