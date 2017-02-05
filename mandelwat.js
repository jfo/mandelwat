(function() {
    function Mandelbrot(canvasId) {
        var canvas = document.getElementById(canvasId);
        var ctx = canvas.getContext("2d");
        var imageData = ctx.createImageData(canvas.width, canvas.height);
        var aspectRatio = canvas.height / canvas.width

        this.iterations = 200;
        this.r = 4
        this.center = {
            x: 0,
            y: 0
        };

        var indexToCoord = function(index) {
            index /= 4;
            coord =  {
                x: index % canvas.width,
                y: Math.floor(index / canvas.width)
            }
            coord.x = (((coord.x * this.r / canvas.width) - this.r / 2) + (this.center.x * aspectRatio)) / aspectRatio;
            coord.y = ((((coord.y * this.r / canvas.height) - this.r / 2) * -1) + this.center.y);
            return coord;
        }.bind(this)

        var ismandlebrot = function(coord) {
            var cr = coord.x
            var ci = coord.y
            var zr = coord.x
            var zi = coord.y

            var i;
            for (i = 0; i < this.iterations; i++) {
                if (zr**2 + zi**2 > 4) {
                    return [false, i];
                }

                newzr = (zr * zr) - (zi * zi) + cr;
                newzi = ((zr * zi) *2) + ci
                zr = newzr
                zi = newzi
            }
            return [true, i];
        }.bind(this);

        this.render = function() {
            for (var i = 0; i < canvas.width * canvas.height * 4; i += 4) {
                thing = ismandlebrot(indexToCoord(i))
                set =  thing[0] ?  0: (thing[1] / this.iterations) * 0xffffff;
                imageData.data[i]     = (set & 0xff0000) >> 16;
                imageData.data[i + 1] = (set & 0x00ff00) >> 8;
                imageData.data[i + 2] = set & 0x0000ff;
                imageData.data[i + 3] = 255;
            }
            ctx.putImageData(imageData, 0, 0);
        }.bind(this)
    }

    var mb = new Mandelbrot("mandelwat");
    mb.center = { x:  0.25001, y: 0  };
    mb.r = 0.00047
    mb.iterations = 1000;
    mb.render();
    // setInterval(function() {
    //     mb.iterations += 10;
    //     mb.render();
    // }, 1000)
})();
