(function() {
    var c = document.getElementById("mandelwat");
    var ctx = c.getContext("2d");

    function predicate(x) {
        return x % 5 == 0;
    }

    var imageData = ctx.createImageData(c.width, c.height);
    for (x = 0; x < c.width * c.height * 4; x += 4) {
        var set = predicate(x / 4) ? 0 : 255;
        imageData.data[x] =     set;
        imageData.data[x + 1] = set;
        imageData.data[x + 2] = set;
        imageData.data[x + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
})()
