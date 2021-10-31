let vertexshadersource='attribute vec3 aPosition;'+
    'uniform mat4 projmatrix,cameramatrix;'+
    'void main(){'+
    'gl_PointSize=5.0;'+
    'gl_Position=projmatrix*cameramatrix*vec4(aPosition,1.0);}'
let fragmentshadersource='precision highp float;'+
    'void main(){'+
    'gl_FragColor=vec4(0.5,0.0,0.0,1.0);}'
let fragmentshadersource2='precision highp float;'+
    'void main(){'+
    'gl_FragColor=vec4(0.5,0.5,0.0,1.0);}'

function setup() {
  canvas=createCanvas(windowWidth,windowHeight,WEBGL)
  gl=canvas.GL;
  gl.getExtension('OES_texture_float');
  framebuffer=createFramebuffer();
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, 1, 1);
  
  b=readshader('point.vert','point.frag');
  a=readshader('default.vert','default.frag');
  c=readshader('canvas.vert','canvas.frag');
  arr=loadObj(getfromurl('teapot.obj'),true);
  
  let file=document.getElementById('fileinput');
  file.addEventListener('input', handleFiles);
  
  picker1=document.getElementById('diffusecolor');
  slider2 = document.getElementById('lightintensity');
  slider3 = document.getElementById('lightradius');
  roughness=document.getElementById('roughness');
  picker4=document.getElementById('ambientcolor');
  lightcolor=document.getElementById('lightcolor');
  glossycolor=document.getElementById('glossycolor');
  //let val = slider.value();
  let fresnel = document.getElementById('fresnel');
  aoradius = document.getElementById('ao radius');
  aostrength = document.getElementById('ao strength');
  bias = document.getElementById('bias');
  aobias2 = document.getElementById('ao bias2');
  checkbox = document.getElementById('lighttracing');
  
  t=new tri(vec3(0.0,0.0,100.0),vec3(66.0,100.0,100.0),vec3(100.0,-66.0,100.0));
  t=t.scale(1);
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
let t,time=1;
function draw() { 
  
  //background(0);
  if(time==1)
    clearframebuffer();
  orbitControl()

  useShader(a)
  //drawtriangles(arr);
  drawtriangles(arr,framebuffer);
    
  useShader(b)
  drawtriangles(t.array,framebuffer);
  //savecanvas();
  rendertocanvas();
  //useShader(b)
  //drawpoints(arr)
  time++;
  if(time>50)
  noLoop();

    
}
