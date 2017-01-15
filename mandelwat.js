(function() {
    var c = document.getElementById("mandelwat");
    var ctx = c.getContext("2d");

    function ismandlebrot(coord) {
        var cr = coord.x
        var ci = coord.y
        var zr = coord.x
        var zi = coord.y
        var out = true;

        for (var i = 0; i < 10; i++) {
            if (zr**2 + zi**2 > 4) {
                out = false;
                return out;
            }

            zr = zr**2 + cr;
            zi = ((zr * zi) *2) + zi**2 + ci
        }
        return out;
    }

    function predicate(coord) {
        coord.x = (coord.x * 4 / c.width) - 2;
        coord.y = ((coord.y * 4 / c.height) - 2) * -1;
        return ismandlebrot(coord);
    }

    function indexToXY(index) {
        index /= 4;
        return {
            x: index % c.width,
            y: Math.floor(index / c.width)
        }
    }

    var imageData = ctx.createImageData(c.width, c.height);
    var acc = [];
    for (var i = 0; i < c.width * c.height * 4; i += 4) {

        var set = predicate(
            indexToXY(i)
        ) ? 0 : 255;

        imageData.data[i] =     set;
        imageData.data[i + 1] = set;
        imageData.data[i + 2] = set;
        imageData.data[i + 3] = 255;

    }

    ctx.putImageData(imageData, 0, 0);
})();
