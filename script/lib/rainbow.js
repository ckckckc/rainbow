(function(){

  var RS = window.RS = window.RS || {}, Rainbow;

  if (RS.Rainbow) return;

  Rainbow = RS.Rainbow = function(canvas) {
    if (!canvas) throw new Error("must specify canvas element at first");
    
    this.can = canvas;

    this.ctx = canvas.getContext("2d");

    this.image;

    this.imageData;

    this.RGB;

    this.RGBLength;
  };

  Rainbow.prototype.setImageSmoothingEnabled = function(boolean) {
    this.ctx.imageSmoothingEnabled    = boolean;
    this.ctx.mozImageSmoothingEnabled = boolean;
    this.ctx.msImageSmoothingEnabled  = boolean;
  };

  Rainbow.prototype.resizeCanvas = function(size) {
    this.can.width = size.width;

    this.can.height = size.height;
  };

  Rainbow.prototype.drawImage = function drawImage(opts) {

    if(!opts.image) throw("target is required");

    var canvas  = opts.canvas  || this.can,
        context = opts.context || this.ctx,
        image   = opts.image,

        srcx = opts.srcx || 0,
        srcy = opts.srcy || 0,
        srcw = opts.srcw || image.naturalWidth,
        srch = opts.srch || image.naturalHeight,
        desx = opts.desx || srcx,
        desy = opts.desy || srcy,
        desw = opts.desw || srcw,
        desh = opts.desh || srch,
        mode = opts.mode || 2,
        auto = opts.auto,

        devicePixelRatio  = window.devicePixelRatio || 1,
        backingStoreRatio = context.webkitBackingStorePixelRatio ||
                            context.mozBackingStorePixelRatio ||
                            context.msBackingStorePixelRatio ||
                            context.oBackingStorePixelRatio ||
                            context.backingStorePixelRatio || 1,

        ratio = devicePixelRatio / backingStoreRatio;

    if (typeof auto === 'undefined') {
      auto = true;
    }

    if (auto && devicePixelRatio !== backingStoreRatio) {

      var oldWidth = canvas.width;
      var oldHeight = canvas.height;

      context.save();

      canvas.width = oldWidth * ratio;
      canvas.height = oldHeight * ratio;

      canvas.style.width = oldWidth + 'px';
      canvas.style.height = oldHeight + 'px';

      context.scale(ratio, ratio);

      context.restore();
    }

    if (opts.mode === 1) {
      context.drawImage(image, srcx, srcy);
    } else if (opts.mode === 2) {
      context.drawImage(image, srcx, srcy, srcw, srch);
    } else if (opts.mode === 3) {
      context.drawImage(image, srcx, srcy, srcw, srch, desx, desy, desw, desh);
    }
  };

  Rainbow.prototype.getResizeSize =function (imageSize, maxSize){
    var showWidth, showHeight;

    if (imageSize.gradient >= 1 && imageSize.height > maxSize.maxHeight) {
      showHeight = maxSize.maxHeight;
      showWidth  = (imageSize.width / imageSize.height) * showHeight;
    } else if (imageSize.gradient < 1 && imageSize.width > maxSize.maxWidth) {
      showWidth  = maxSize.maxWidth;
      showHeight = (imageSize.height / imageSize.width) * showWidth;
    } else {
      showWidth  = imageSize.width;
      showHeight = imageSize.height;
    }

    return {
      "width" : showWidth, 
      "height" : showHeight,
      "gradient" : imageSize.gradient
    };
  };

  Rainbow.prototype.applyRainbow = function() {};


})();