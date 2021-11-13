
function setup() {
  frameRate(60)
  canvas=createCanvas(windowWidth,windowHeight,WEBGL);
  gl=canvas.GL;
  gl.getExtension('OES_texture_float');
  gl.getExtension('EXT_disjoint_timer_query');
  ext = gl.getExtension('EXT_disjoint_timer_query');
  //console.log(ext)
  query =null;
  
  framebuffer=createFramebuffer();
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, 1, 1);
  
  b=readshader('point.vert','point.frag');
  a=readshader('default.vert','default.frag');
  c=readshader('canvas.vert','canvas.frag');
  arr=loadObj(getfromurl('teapot.obj'),true);
  
  let file=document.getElementById('fileinput');
  file.addEventListener('input', handleFiles);
  
  //picker1=document.getElementById('diffusecolor');
  //slider2 = document.getElementById('lightintensity');
  //slider3 = document.getElementById('lightradius');
  //roughness=document.getElementById('roughness');
  //picker4=document.getElementById('ambientcolor');
  //lightcolor=document.getElementById('lightcolor');
  //glossycolor=document.getElementById('glossycolor');
  //let val = slider.value();
  //let fresnel = document.getElementById('fresnel');
  //aoradius = document.getElementById('ao radius');
  //aostrength = document.getElementById('ao strength');
  //bias = document.getElementById('bias');
  //aobias2 = document.getElementById('ao bias2');
  //checkbox = document.getElementById('lighttracing');
  
  t=new tri(vec3(0.0,0.0,100.0),vec3(66.0,100.0,100.0),vec3(100.0,-66.0,100.0));
  t=t.scale(1);
  //setInterval(drawFrame,16);
  //drawFrame();
  setcamera()
}
let t,time=1,generator;
function draw() { 
  
  //background(0);
  if(time==1){
    //console.log([this._renderer._curCamera.eyeX,this._renderer._curCamera.eyeY,this._renderer._curCamera.eyeZ,])
    generator=halton(2);
    generator2=halton(3);
    generator3=halton(5);
    clearframebuffer();
  }
  //randomnumber=generator.next().value;
  //randomnumber=generator.next().value;
  if(lockcamera.checked==false)
    orbitControl();
  
  useShader(a)
  //drawtriangles(arr);
  
  if(query==null){
    query =ext.createQueryEXT();
    ext.beginQueryEXT(ext.TIME_ELAPSED_EXT, query);
    drawtriangles(arr,framebuffer);
    ext.endQueryEXT(ext.TIME_ELAPSED_EXT);
  }
  else{
    drawtriangles(arr,framebuffer);
  }
  
  
  useShader(b)
  drawtriangles(t.array,framebuffer);
  //savecanvas();
  rendertocanvas();
  //useShader(b)
  //drawpoints(arr)
  time++;
  if(time>50)
  noLoop();
  if (query) {
  let available = ext.getQueryObjectEXT(query, ext.QUERY_RESULT_AVAILABLE_EXT);
  let disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT);
  if (available&&!disjoint) {
  // See how much time the rendering of the object took in nanoseconds.
  let timeElapsed = ext.getQueryObjectEXT(query, ext.QUERY_RESULT_EXT);
  fps.textContent=timeElapsed/1000000;
}
  if(available||disjoint){
    ext.deleteQueryEXT(query);
    query=null;
}
  }
  //requestAnimationFrame(drawFrame);
}
function setcamera(){
  this._renderer._curCamera.setPosition(291.3318359688469, -86.37646567228508, 21.391875407101793);
  this._renderer._curCamera.lookAt(0, 0, 0);
}