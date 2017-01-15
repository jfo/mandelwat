(function() {
    var c = document.getElementById("mandelwat");
    var ctx = c.getContext("2d");

    function predicate(coord) {
       return coord.x % 10 == 0;
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
    for (i = 0; i < c.width * c.height * 4; i += 4) {

        var set = predicate(
            indexToXY(i)
        ) ? 0 : 255;

        imageData.data[x] =     set;
        imageData.data[x + 1] = set;
        imageData.data[x + 2] = set;
        imageData.data[x + 3] = 255;
    }
    console.log(acc)
    ctx.putImageData(imageData, 0, 0);
})()
