(function() {
  var canvas = document.getElementById('mandelwat');

  var gl = canvas.getContext('webgl');
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

  var vertexShaderSource = document.getElementById('vertex-shader').text;
  var fragmentShaderSource = document.getElementById('fragment-shader').text;
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource,
  );

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
  var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  var positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // three 2d points
  var positions = [-1, 1, 1, 1, 1, -1, 1, -1, -1, -1, -1, 1];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program);
  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var size = 2;
  var type = gl.FLOAT;
  var normalize = false;
  var stride = 0;
  var offset = 0;
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset,
  );

  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;

  var offsetLoc = gl.getUniformLocation(program, 'xy');
  gl.uniform2fv(offsetLoc, [canvas.width, canvas.height]);

  gl.drawArrays(primitiveType, offset, count);
})();
