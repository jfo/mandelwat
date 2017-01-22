(function() {
    function Graph(canvasId) {
        var canvas = document.getElementById(canvasId);
        var ctx = canvas.getContext("2d");
        this.r = 1
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
            coord.x = ((coord.x * this.r / canvas.height) - this.r / 2) + this.center.x;
            coord.y = (((coord.y * this.r / canvas.width) - this.r / 2) * -1) + this.center.y ;
            return coord;
        }.bind(this)

        var imageData = ctx.createImageData(canvas.width, canvas.height);
        this.render = function(predicate) {
            for (var i = 0; i < canvas.width * canvas.height * 4; i += 4) {
                var thing = predicate(indexToCoord(i));
                set = thing[0] ? 0 : (thing[1] / 200) * 0xffffff;

                if (!thing[0] && set == 0) {
                    set = 0xffffff;
                }

                imageData.data[i]     = (set & 0xff0000) >> 16;
                imageData.data[i + 1] = (set & 0x00ff00) >> 8;
                imageData.data[i + 2] = set & 0x0000ff;
                imageData.data[i + 3] = 255;
            }
            ctx.putImageData(imageData, 0, 0);
        }
    }

    function ismandlebrot(coord) {
        var cr = coord.x
        var ci = coord.y
        var zr = coord.x
        var zi = coord.y

        var i;
        for (i = 0; i < 200; i++) {
            if (zr**2 + zi**2 > 4) {
                return [false, i];
            }

            newzr = (zr * zr) - (zi * zi) + cr;
            newzi = ((zr * zi) *2) + ci
            zr = newzr
            zi = newzi
        }
        return [true, i];
    }

    var graph = new Graph("mandelwat");
    graph.r = 2
    graph.center = {
        x: -1.25066,
        y: 0.02012
    };
    graph.render(ismandlebrot);
    // setInterval(function(){
    //     graph.r /=1.1;
    //     graph.render(ismandlebrot);
    // },300);
})();


