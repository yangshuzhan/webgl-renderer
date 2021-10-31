function createFramebuffer(){
  let framebuffer=gl.createFramebuffer();
  let texture=gl.createTexture();
  framebuffer.texture=texture;
  gl.activeTexture(gl.TEXTURE1);//有问题
  gl.bindTexture(gl.TEXTURE_2D,framebuffer.texture);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.drawingBufferWidth,gl.drawingBufferHeight,0,gl.RGBA,gl.FLOAT,null);
  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
  // create a depth renderbuffer
  framebuffer.depthBuffer = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, framebuffer.depthBuffer);
// make a depth buffer and the same size as the targetTexture
  gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, gl.drawingBufferWidth,gl.drawingBufferHeight);
  return framebuffer;
}
let canvastexture;
function savecanvas(){
  if(canvastexture==null){
    canvastexture=gl.createTexture();
    }
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D,canvastexture);
  
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  //gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,width,height,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.FLOAT, gl.canvas);
}
let t2=[-1,-1,1,0,0,0,1,1,1,0,0,0,-1,1,1,0,0,0]
t2.push(-1,-1,1,0,0,0,1,1,1,0,0,0,1,-1,1,0,0,0)
function rendertocanvas(){
  useShader(c);
  drawtriangles(t2);
}
function clearframebuffer(){
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}
function clearcanvas(){
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
}