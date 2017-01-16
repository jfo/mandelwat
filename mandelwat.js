(function() {
    function Graph(canvasId) {
        var canvas = document.getElementById(canvasId);
        var ctx = canvas.getContext("2d");

        var indexToCoord = function(index) {
            index /= 4;
            coord =  {
                x: index % canvas.width,
                y: Math.floor(index / canvas.width)
            }
            coord.x = ((coord.x * 4 / canvas.height) - 2);
            coord.y = ((coord.y * 4 / canvas.width) - 2) * -1 ;
            return coord;
        }

        this.render = function(predicate) {
            var imageData = ctx.createImageData(canvas.width, canvas.height);
            for (var i = 0; i < canvas.width * canvas.height * 4; i += 4) {
                set = predicate(indexToCoord(i), arguments[1]) ? 0 : 255;
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

        for (var i = 0; i < 100; i++) {
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
    graph.render(ismandlebrot);

})();


