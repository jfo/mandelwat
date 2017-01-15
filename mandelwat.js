(function() {
    function randColor() { return '#'+Math.floor(Math.random()*16777215).toString(16); }

    var c = document.getElementById("mandelwat");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    ctx.rect(0, 0, c.width, c.height);

    function newColor() {
        ctx.fillStyle = randColor();
        ctx.fill();
        console.log(ctx.fillStyle);
        requestAnimationFrame(newColor);
    }

    newColor();

})()
