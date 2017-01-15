(function() {
    var c = document.getElementById("mandelwat");
    var ctx = c.getContext("2d");

    var imageData = ctx.createImageData(c.width, c.height);
    for (x = 0; x < 200 * 200 * 4; x += 4) {
        imageData.data[x] =     0;
        imageData.data[x + 1] = 0;
        imageData.data[x + 2] = 0;
        imageData.data[x + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
})()
