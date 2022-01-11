function windowResized(){  
  time=1;
  resizeCanvas(windowWidth, windowHeight);
  gl.deleteFramebuffer(framebuffer);
  framebuffer=createFramebuffer(1);
  bloommap=createFramebuffer(3);
  
  setcamera()
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
  time=1;
  loop()
  //gl.deleteBuffer(vertexBuffer);
  //vertexBuffer=null;
}
