(function() {
    function Graph(canvasId) {
        var canvas = document.getElementById(canvasId);
        var ctx = canvas.getContext("2d");
        var aspectRatio = canvas.height / canvas.width

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

            coord.x = (((coord.x * this.r / canvas.width) - this.r / 2) + (this.center.x * aspectRatio)) / aspectRatio;
            coord.y = ((((coord.y * this.r / canvas.height) - this.r / 2) * -1) + this.center.y);

            return coord;
        }.bind(this)

        var imageData = ctx.createImageData(canvas.width, canvas.height);
        this.render = function(predicate) {
            for (var i = 0; i < canvas.width * canvas.height * 4; i += 4) {
                set = predicate(indexToCoord(i)) ? 0 : 255;
                imageData.data[i]     = set;
                imageData.data[i + 1] = set;
                imageData.data[i + 2] = set;
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
                return false;
            }

            newzr = (zr * zr) - (zi * zi) + cr;
            newzi = ((zr * zi) *2) + ci
            zr = newzr
            zi = newzi
        }
        return true;
    }

    var graph = new Graph("mandelwat");
    graph.r = 0.0003;
    graph.center = {
        x: -1.25066,
        y: 0.02012
    };
    graph.render(ismandlebrot);
    // setInterval(function(){
    //     graph.r /=1.1;
    //     graph.render(ismandlebrot);
    // },200);
})();


