// cuon-utils.js (c) 2012 kanda and matsuda
/**
 * Create a program object and make current
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return true, if the program object was created and successfully made current
 */
function readshader(url1, url2) {
  var request = new XMLHttpRequest();
  request.open("GET", url1, false); // `false` makes the request synchronous
  request.send(null);
  let vs = request.responseText;
  request.open("GET", url2, false); // `false` makes the request synchronous
  request.send(null);
  let fs = request.responseText;
  return initShaders(gl, vs, fs);
}
function initShaders(gl, vshader, fshader) {
  var program = createProgram(gl, vshader, fshader);
  if (!program) {
    console.log("Failed to create program");
    return false;
  }
  return program;
}

function useShader(program) {
  gl.useProgram(program);
  aPosition = gl.getAttribLocation(program, "aPosition");
  aNormal = gl.getAttribLocation(program, "aNormal");
  setuniform("projcameramatrix", mat4multiply(this._renderer._curCamera.projMatrix.mat4,this._renderer._curCamera.cameraMatrix.mat4));
  setuniform("cameralocation", [
    this._renderer._curCamera.eyeX,
    this._renderer._curCamera.eyeY,
    this._renderer._curCamera.eyeZ,
  ]);
  
  setuniform("randoms", [generator.next().value,generator2.next().value,generator3.next().value]);
  setuniform("roughness", Number(roughness.value));
  setuniform("bias", Number(bias.value));
  setuniform("time", time);
  setuniform("iResolution", [width, height]);
  setuniform("lightintensity", Number(lightintensity.value));
  setuniform("glossycolor", torgb(glossycolor.value));
  setuniform("diffusecolor", torgb(diffusecolor.value));

  setuniform("trianglelight.position[0]", [t.p1.x, t.p1.y, t.p1.z]);
  setuniform("trianglelight.position[1]", [t.p2.x, t.p2.y, t.p2.z]);
  setuniform("trianglelight.position[2]", [t.p3.x, t.p3.y, t.p3.z]);
  setuniform("trianglelight.a", [t.a.x, t.a.y, t.a.z]);
  setuniform("trianglelight.b", [t.b.x, t.b.y, t.b.z]);
  setuniform("trianglelight.normal", [t.normal.x, t.normal.y, t.normal.z]);
  u_Sampler = gl.getUniformLocation(program, "u_Sampler");
  gl.uniform1i(u_Sampler, 0);
  Sampler = gl.getUniformLocation(program, "Sampler");
  gl.uniform1i(Sampler, 1);
  function setuniform(name, value) {
    let location = gl.getUniformLocation(program, name);
    if (value.length == 16) gl.uniformMatrix4fv(location, false, value);
    else if (value.length == 3) gl.uniform3fv(location, value);
    else if (value.length == 2) gl.uniform2fv(location, value);
    else if (value.length == null) {
      gl.uniform1f(location, value);
    }
  }
}
function transituniforms() {}
/**
 * Create the linked program object
 * @param gl GL context
 * @param vshader a vertex shader program (string)
 * @param fshader a fragment shader program (string)
 * @return created program object, or null if the creation has failed
 */
function createProgram(gl, vshader, fshader) {
  // Create shader object
  var vertexShader = loadshader(gl, gl.VERTEX_SHADER, vshader);
  var fragmentShader = loadshader(gl, gl.FRAGMENT_SHADER, fshader);
  if (!vertexShader || !fragmentShader) {
    return null;
  }

  // Create a program object
  var program = gl.createProgram();
  if (!program) {
    return null;
  }

  // Attach the shader objects
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // Link the program object
  gl.linkProgram(program);

  // Check the result of linking
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    var error = gl.getProgramInfoLog(program);
    console.log("Failed to link program: " + error);
    gl.deleteProgram(program);
    gl.deleteShader(fragmentShader);
    gl.deleteShader(vertexShader);
    return null;
  }
  return program;
}

/**
 * Create a shader object
 * @param gl GL context
 * @param type the type of the shader object to be created
 * @param source shader program (string)
 * @return created shader object, or null if the creation has failed.
 */
function loadshader(gl, type, source) {
  // Create shader object
  var shader = gl.createShader(type);
  if (shader == null) {
    console.log("unable to create shader");
    return null;
  }

  // Set the shader program
  gl.shaderSource(shader, source);

  // Compile the shader
  gl.compileShader(shader);

  // Check the result of compilation
  var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compiled) {
    var error = gl.getShaderInfoLog(shader);
    console.log("Failed to compile shader: " + error);
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

//let vertexBuffer;
function setupBuffers(array) {
  array.vertexBuffer = gl.createBuffer();
  //console.log(gl.getBufferParameter(gl.ARRAY_BUFFER, gl.BUFFER_SIZE));
  gl.bindBuffer(gl.ARRAY_BUFFER, array.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.STATIC_DRAW);
}

let ARRAY;
function drawtriangles(array, framebuffer) {
  if (array.vertexBuffer == null) {
    //ARRAY = array;
    setupBuffers(array);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, array.vertexBuffer);
  //绘制多个物体要重新绑定buffer
  gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 24, 12);
  gl.enableVertexAttribArray(aNormal);
  
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  if (framebuffer != null) {
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      framebuffer.texture,
      0
    );
    gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depthBuffer);
    
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, framebuffer.depthBuffer);
  }
  gl.drawArrays(gl.TRIANGLES, 0, array.length / 3);

}
function drawpoints(array) {
  if (array.vertexBuffer == null) {
    setupBuffers(array);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 24, 0);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aNormal, 3, gl.FLOAT, false, 24, 12);
    gl.enableVertexAttribArray(aNormal);
  }
  gl.drawArrays(gl.POINTS, 0, array.length / 3);
}
