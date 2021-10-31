function windowResized(){  
  resizeCanvas(windowWidth, windowHeight);
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
