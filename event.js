function windowResized(){  
  resizeCanvas(windowWidth, windowHeight);
  gl.deleteFramebuffer(framebuffer);
  framebuffer=createFramebuffer();
  time=1;
  loop()
}
function mouseDragged(){
  time=1;
  loop()
}

function mouseWheel(){
  time=1;
  loop()
}
async function handleFiles() {
  const fileList = this.files;
  const temp=await fileList[0].text();
  //console.log(loadObj(temp));
  
  arr=loadObj(temp,true);
  loop()
  //gl.deleteBuffer(vertexBuffer);
  //vertexBuffer=null;
}