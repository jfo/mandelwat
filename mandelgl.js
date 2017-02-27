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
gl.uniform2fv(offsetLoc, [ 500,500 ])
gl.uniform2fv(centerLoc, [ 0.0,0.0 ])
gl.drawArrays(primitiveType, offset, count);

canvas.addEventListener('onscroll', function(e) {
    console.log([e.offsetX, e.offsetY]);
});

canvas.addEventListener('click', function(e) {
    console.log([e.offsetX, e.offsetY]);
    gl.uniform2fv(centerLoc, [e.offsetX / 500, e.offsetY / 500])
    gl.drawArrays(primitiveType, offset, count);
});
