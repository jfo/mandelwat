(function() {
    var canvas = document.getElementById("mandelwat");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        alert("This browser doesn't seem to support webGL. sorry :(");
        return;
    }

    function createShader(gl, type, source) {
      var shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
      if (success) {
        return shader;
      }

      console.log(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
    }

    var vertexShaderSource = document.getElementById("vertex-shader").text;
    var fragmentShaderSource = document.getElementById("fragment-shader").text;
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

    function createProgram(gl, vertexShader, fragmentShader) {
      var program = gl.createProgram();
      gl.attachShader(program, vertexShader);
      gl.attachShader(program, fragmentShader);
      gl.linkProgram(program);
      var success = gl.getProgramParameter(program, gl.LINK_STATUS);
      if (success) {
        return program;
      }

      console.log(gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
    }

    var program = createProgram(gl, vertexShader, fragmentShader);
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    var positionBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // three 2d points
    var positions = [
      -1, 1,
      1, 1,
      1, -1,
      1, -1,
      -1, -1,
      -1, 1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var size = 2;
    var type = gl.FLOAT;
    var normalize = false;
    var stride = 0;
    var offset = 0;
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;

    // mine starts here:

    var offsetLoc = gl.getUniformLocation(program, "xy");
    var centerLoc = gl.getUniformLocation(program, "center");

    function logslider(position) {
      var minp = 0;
      var maxp = 100;
      var minv = Math.log(0.5);
      var maxv = Math.log(150000);
      var scale = (maxv-minv) / (maxp-minp);
      return Math.exp(minv + scale*(position-minp));
    }

    var zoomlevel = 0.5;

    var r = gl.getUniformLocation(program, "r");
    var rext = 2.0;
    gl.uniform1f(r, 2.0)
    var zoom = document.getElementById("zoom")
    zoom.addEventListener('input', function(e) {
        rext = 1 / logslider(e.target.value)
        gl.uniform1f(r , rext)
        requestAnimationFrame(function(){
            gl.drawArrays(primitiveType, offset, count);
        });
    });

    canvas.addEventListener('wheel', function(e) {
        if (zoomlevel < 100 && zoomlevel > 0.0) {
            var delta = (e.deltaY < 0 ? -0.3 : 0.3)
            rext = 1/logslider(zoomlevel += delta);
            gl.uniform1f(r , rext)
            requestAnimationFrame(function(){
                gl.drawArrays(primitiveType, offset, count);
            });
            zoom.value=zoomlevel;
        } else if (zoomlevel > 100) {
            zoomlevel = 99.9;
        } else if (zoomlevel < 0) {
            zoomlevel = 0.1;
        }
    });

    var iterations = gl.getUniformLocation(program, "iterations");
    var iterationslide = document.getElementById("iterations");
    var initIterState = 50;
    iterationslide.value = initIterState;
    gl.uniform1i(iterations, initIterState);
    iterationslide.addEventListener('input', function(e) {
        gl.uniform1i(iterations, e.target.value);
        gl.drawArrays(primitiveType, offset, count);
    });

    var bailout = gl.getUniformLocation(program, "bailout");
    var bailoutslide = document.getElementById("bailout");
    var initBailoutState = 4.0;
    var bailext = initBailoutState;
    bailoutslide.value = initBailoutState;
    gl.uniform1f(bailout, initBailoutState);
    bailoutslide.addEventListener('input', function(e) {
        bailext = Math.pow(e.target.value, 2);
        gl.uniform1f(bailout, bailext);
        gl.drawArrays(primitiveType, offset, count);
    });

    var resizebutton = document.getElementById("resize-button");
    var resizex = document.getElementById("resize-x");
    var resizey = document.getElementById("resize-y");
    resizebutton.addEventListener('click', function() {
        canvas.height = resizey.value;
        canvas.width = resizex.value;
        gl.uniform2fv(offsetLoc, [canvas.width,canvas.height])
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.drawArrays(primitiveType, offset, count);
    });

    gl.uniform2fv(offsetLoc, [canvas.width,canvas.height])
    var center = { x:0.0, y:0.0 };
    gl.uniform2fv(centerLoc, [center.x, center.y])
    canvas.addEventListener('click', function(e) {
        center.x += ((e.offsetX * rext / canvas.width) - rext / 2) * 2
        center.y += (((e.offsetY * rext / canvas.height) - rext / 2) * -1) * 2
        gl.uniform2fv(centerLoc, [center.x, center.y])
        gl.drawArrays(primitiveType, offset, count);
    });

    function attachSliderEventHandlers(id) {
        var thing = gl.getUniformLocation(program, id);
        var thingslide = document.getElementById(id)
        var initState = 0.0;
        thingslide.value = initState;
        gl.uniform1f(thing, initState)
        thingslide.addEventListener('input', function(e) {
            gl.uniform1f(thing, e.target.value / 100)
            gl.drawArrays(primitiveType, offset, count);
        });
    }
    attachSliderEventHandlers("red");
    attachSliderEventHandlers("green");
    attachSliderEventHandlers("blue");
    attachSliderEventHandlers("wat");

    // actually draw the initial state.
    gl.drawArrays(primitiveType, offset, count);

})()
