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

    this.devicePixelRatio = window.devicePixelRatio || 1;

    this.backingStoreRatio = this.ctx.webkitBackingStorePixelRatio ||
                             this.ctx.mozBackingStorePixelRatio ||
                             this.ctx.msBackingStorePixelRatio ||
                             this.ctx.oBackingStorePixelRatio ||
                             this.ctx.backingStorePixelRatio || 1;

    this.ratio = this.devicePixelRatio / this.backingStoreRatio;

    this.autoScaled = false;
  };

  Rainbow.prototype.rainbowSteps = [
    'rgba(227,  27,   0, 0.5)',
    'rgba(255, 142,   0, 0.5)',
    'rgba(255, 236,   0, 0.5)',
    'rgba( 20, 127,  28, 0.5)',
    'rgba(  0,  80, 255, 0.5)',
    'rgba(115,  18, 138, 0.5)'
  ];

  Rainbow.prototype.setImageSmoothingEnabled = function(boolean) {
    this.ctx.imageSmoothingEnabled    = boolean;
    this.ctx.mozImageSmoothingEnabled = boolean;
    this.ctx.msImageSmoothingEnabled  = boolean;
  };

  Rainbow.prototype.resizeCanvas = function(size) {
    this.can.width = size.width;

    this.can.height = size.height;
  };

  Rainbow.prototype.setImage = function(image) {
    this.image = image;
  };

  Rainbow.prototype.getImage = function() {
    return this.image;
  }

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
        ratio = this.ratio;

    this.autoScaled = opts.auto

    if (typeof this.autoScaled === 'undefined') {
      this.autoScaled = true;
    }

    if (this.autoScaled && this.devicePixelRatio !== this.backingStoreRatio) {

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

  Rainbow.prototype.resizeByDevice = function() {
    if (this.devicePixelRatio !== this.backingStoreRatio) {

      var can = this.can;
      var oldWidth = can.width;
      var oldHeight = can.height;

      can.width = oldWidth * ratio;
      can.height = oldHeight * ratio;

      can.style.width = oldWidth + 'px';
      can.style.height = oldHeight + 'px';

      this.ctx.scale(ratio, ratio);
    }
  };

  Rainbow.prototype.restoreByDevice = function() {
    if (this.devicePixelRatio !== this.backingStoreRatio) {

      var can = this.can;
      var oldWidth = can.width;
      var oldHeight = can.height;

      can.width = oldWidth / ratio;
      can.height = oldHeight / ratio;

      can.style.width = 'auto';
      can.style.height = 'auto';

      this.ctx.scale(1 / ratio, 1 / ratio);
    }
  };

  Rainbow.prototype.applyRainbow = function() {
    var ctx = this.ctx,
        width = this.can.width,
        height = this.can.height,
        rainbowSteps = Rainbow.prototype.rainbowSteps
        len = rainbowSteps.length,
        pieceHeight = Math.round(height/len),
        ratio = this.ratio;

    ctx.save();

    for (var i = 0 ; i < len ; i++ ) {
      var deltaY = this.autoScaled ? pieceHeight / ratio : pieceHeight;
      ctx.fillStyle = rainbowSteps[i];
      ctx.fillRect(0, i * deltaY, width, pieceHeight);
    }

    ctx.restore();
  };


})();