(function(){
  var RS, Rainbow, doms = {}, fullSizeRainbow, css,
      elementList = [
        {"name" : "can", "selector" : "rainbow"},
        {"name" : "rainbowContainer", "selector" : "rainbow-container"},
        {"name" : "btnUpload", "selector" : "btn-upload"},
        {"name" : "file", "selector" : "file"},
        {"name" : "btnDownload", "selector" : "btn-download"},
        {"name" : "modalBackground", "selector" : "modal-background"},
        {"name" : "downloadImage", "selector" : "download-image"},
        {"name" : "downloadLink", "selector" : "download-link"},
        {"name" : "closeModal", "selector" : "close-modal"},
        {"name" : "typeError", "selector" : "type-error"},

      ];

  var isDonwloadAvailable = "download" in document.createElement("a");;
  var URL = window.URL = window.URL || window.webkitURL;

  function uploadFile() {
    doms.file.click();
  }

  function checkFile() {
    var file,
        imageType = /^image\//;

    if (event.target.files.length == 0) return;

    file = event.target.files[0];

    if (!imageType.test(file.type)) {
      revokeCurrentFile();
      
      showTypeError();
      return;
    }

    drawFileToCanvas(file);
  }

  function showTypeError() {
    doms.typeError.classList.add("animating");

    setTimeout(function(){
      doms.typeError.classList.remove("animating");
    }, 4000);
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
          resizeSize = RS.Rainbow
                         .prototype
                         .getResizeSize(imageSize, RS.config.defaultSize);

      img.width = resizeSize.width;
      img.height = resizeSize.height;

      Rainbow.resizeCanvas(resizeSize);

      Rainbow.setImage(img);

      Rainbow.drawImage({
        "image" : img,
        "srcx"  : 0,
        "srcy"  : 0,
        "srcw"  : resizeSize.width,
        "srch"  : resizeSize.height,
        "mode"  : 2
      });

      Rainbow.applyRainbow();

      revokeCurrentFile();

      revokeURL(img.src);

      css.display(doms.can, "block");

      downloadInit();

    }.bind(img, file);

    img.src = src;
  }

  function revokeCurrentFile() {
    doms.file.value = null;
  }

  function revokeURL(url) {
    URL.revokeObjectURL(url);
  }

  function rainbowInit() {
    Rainbow = new RS.Rainbow(doms.can);

    Rainbow.setImageSmoothingEnabled(false);
  }

  function fullSizeRainbowInit() {
    fullSizeRainbow = new RS.Rainbow(document.createElement("canvas"));

    fullSizeRainbow.setImageSmoothingEnabled(false);
  }

  function downloadInit() {
    var imageType,
        img  = Rainbow.getImage(),
        naturalWidth  = img.naturalWidth,
        naturalHeight = img.naturalHeight,
        downloadInfo = {"quality" : 0.92, "mime" : "image/jpeg", "extension" : "jpeg"};

    fullSizeRainbow.resizeCanvas({
      "width"  : naturalWidth,
      "height" : naturalHeight
    });

    fullSizeRainbow.ctx.drawImage(img, 0, 0, naturalWidth, naturalHeight);

    fullSizeRainbow.applyRainbow(false);

    fullSizeRainbow.can.toBlob(function(blob){
      var imageURL = URL.createObjectURL(blob);

      doms.downloadImage.src = imageURL;

      if (isDonwloadAvailable) {
        doms.downloadLink.href = imageURL;

        doms.downloadLink.download  = "Rainbow" + "." + downloadInfo.extension;
      } else {
        doms.downloadLink.onclick = openDownloadModal;
      }

      css.display(doms.btnDownload, "block");
    }, downloadInfo.mime, downloadInfo.quality);
  }

  function openDownloadModal() {
    if (doms.downloadLink.href) css.display(doms.modalBackground, "block");
  }

  function closeDownloadModal() {
    css.display(doms.modalBackground, "none");
  }

  document.addEventListener("DOMContentLoaded", function(){
    RS = window.RS;

    css = RS.css;

    RS.bindElements(elementList, doms);

    rainbowInit();

    fullSizeRainbowInit();

    doms.btnUpload.addEventListener("click", uploadFile, false);

    doms.file.addEventListener("change", checkFile, false);

    doms.closeModal.addEventListener("click", closeDownloadModal, false);

    doms.can.addEventListener("click", openDownloadModal, false);
  });

})();