function windowResized(){  
  
  resizeCanvas(windowWidth, windowHeight);
  gl.deleteFramebuffer(framebuffer);
  framebuffer=createFramebuffer(1);
  bloommap=createFramebuffer(3);
  backmap=createFramebuffer(4);
  photonmap=createFramebuffer(5);
  time=1;
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
  
  currentmodel=loadObj(temp,true);
  arr=currentmodel.arr;
  grid=new Grid(currentmodel)
  
  time=1;
  loop();
  //gl.deleteBuffer(vertexBuffer);
  //vertexBuffer=null;
}
