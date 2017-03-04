(function() {

    var canvas = document.getElementById("mandelwat");
    var gl = canvas.getContext("webgl");

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

    var vertexShaderSource = document.getElementById("2d-vertex-shader").text;
    var fragmentShaderSource = document.getElementById("2d-fragment-shader").text;
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
      -1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionAttributeLocation, size, type, normalize, stride, offset)

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;

    var offsetLoc = gl.getUniformLocation(program, "xy");
    var centerLoc = gl.getUniformLocation(program, "center");

    // thoser the width height attrs for the canvas
    function logslider(position) {
      // position will be between 0 and 100
      var minp = 0;
      var maxp = 100;

      // The result should be between 100 an 10000000
      var minv = Math.log(0.5);
      var maxv = Math.log(1500000);

      // calculate adjustment factor
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
        console.log(zoomlevel)
        if (zoomlevel < 100 && zoomlevel > 0.0) {
            var delta = (e.deltaY < 0 ? -0.3 : 0.3)
            rext = 1/logslider(zoomlevel += delta);
            gl.uniform1f(r , rext)
            requestAnimationFrame(function(){
                gl.drawArrays(primitiveType, offset, count);
            });
        } else if (zoomlevel > 100) {
            zoomlevel = 99.9;
        } else if (zoomlevel < 0) {
            zoomlevel = 0.1;
        }
    });


    var iterations = gl.getUniformLocation(program, "iterations");
    gl.uniform1f(iterations, 2000)
    var iterationslide = document.getElementById("iterations")
    iterationslide.addEventListener('input', function(e) {
        gl.uniform1f(iterations, e.target.value)
        gl.drawArrays(primitiveType, offset, count);
    });

    gl.uniform2fv(offsetLoc, [ 500,500 ])
    var center = { x:0.0, y:0.0 };
    gl.uniform2fv(centerLoc, [center.x, center.y])
    canvas.addEventListener('click', function(e) {
        center.x += ((e.offsetX * rext / canvas.width) - rext / 2) * 2
        center.y += (((e.offsetY * rext / canvas.height) - rext / 2) * -1) * 2


        gl.uniform2fv(centerLoc, [center.x, center.y])
        gl.drawArrays(primitiveType, offset, count);
    });

    gl.drawArrays(primitiveType, offset, count);

})()
