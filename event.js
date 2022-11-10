function checkCamera(){
  if(lockcamera.checked===true){
    //console.log(this._renderer._curCamera.eyeX,this._renderer._curCamera.eyeY,this._renderer._curCamera.eyeZ);
  
   localStorage.camera=[this._renderer._curCamera.eyeX,this._renderer._curCamera.eyeY,this._renderer._curCamera.eyeZ].toString()
  console.log(localStorage.camera)
  }
}
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

let file=document.getElementById('fileinput');
  file.addEventListener('input', handleFiles);
async function handleFiles() {
  const fileList = this.files;
  if(fileList.length>0)
  {
    for(let i=0;i<fileList.length;i++){
      const temp=await fileList[i].text();
      //console.log(fileList[i])
      if(fileList[i].name.split('.')[1]==='obj'){
        currentmodel=loadObj(temp,true);
        // arr=currentmodel.arr;
        // grid=new Grid(currentmodel);
      }
      else if(fileList[i].name.split('.')[1]==='mtl'){
        loadmaterials(temp);
        //console.log(selectmaterial)
        for(let i=0;i<materialtable.length;i++){
              selectmaterial.options[i] = new Option(materialtable[i][0]);

        }
      }
    }
    //console.log(materialtable)
  time=1;
  loop();
  }
  //gl.deleteBuffer(vertexBuffer);
  //vertexBuffer=null;
}
function selectmaterials(){
  //console.log(selectmaterial.value)
   
    let result=false;
    for(let i=0;i<materialtable.length;i++){
      if(materialtable[i][0]===selectmaterial.value){
          result=materialtable[i]
        diffusecolor.value=rgbToHex(result[1])
          break;
        }
    }
}
function changediffuse(){
  let result=false;
    for(let i=0;i<materialtable.length;i++){
      if(materialtable[i][0]===selectmaterial.value){
          materialtable[i][1]=torgb(diffusecolor.value)
          break;
        }
    }
}
