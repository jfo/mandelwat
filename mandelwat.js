(function() {
    var c = document.getElementById("mandelwat");
    var ctx = c.getContext("2d");

    ctx.moveTo(c.width/2,0);
    ctx.lineTo(c.width/2,c.height);
    ctx.stroke();

    ctx.moveTo(0, c.height / 2);
    ctx.lineTo(c.width,c.height / 2);
    ctx.stroke();

})()
