(function() {
  var canvas = document.getElementById('mandelwat');
  var gl = canvas.getContext('webgl');
  if (!gl) {
    alert("This browser doesn't seem to support webGL. sorry :(");
    return;
  }
  var vertexShaderSource = `\
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0, 1);
}
`;
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.error('vertex shader failed to compile');
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  var fragmentShaderSource = `\
precision mediump float;
void main() {
  gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}
`;
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    console.error('vertex shader failed to compile');
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  }
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('program failed to link');
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
  }
  var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
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
  gl.drawArrays(primitiveType, offset, count);
})();
