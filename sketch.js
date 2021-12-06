
function setup() {
  frameRate(60)
  canvas=createCanvas(windowWidth,windowHeight,WEBGL);
  pixelDensity(1);
  console.log(displayDensity())
  gl=canvas.GL;
  gl.getExtension('OES_texture_float');
  gl.getExtension('EXT_disjoint_timer_query');
  gl.getExtension('OES_texture_float_linear');
  gl.getExtension('WEBGL_color_buffer_float');
  gl.getExtension('EXT_float_blend');
  ext = gl.getExtension('EXT_disjoint_timer_query');
  //console.log(gl.getSupportedExtensions());
  query =null;
  
  framebuffer=createFramebuffer(1);
  bloommap=createFramebuffer(3);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, 1, 1);
  
  createnoise(128);//生成一张噪声纹理
  //createworld();
  ambientcolor=color(255)
  loadImage('cityenvironment.jpg',world=>createworld(world));
  
  b=readshader('point.vert','point.frag');
  a=readshader('default.vert','default.frag');
  c=readshader('canvas.vert','canvas.frag');
  transparentshader=readshader('default.vert','transparent.frag');
  bloom=readshader('default.vert','bloom.frag');
  backface=readshader('default.vert','backface.frag');
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
let t,time=1;
const samples=64;
function draw() { 
  
  //background(0);
  if(time==1){
    //console.log([this._renderer._curCamera.eyeX,this._renderer._curCamera.eyeY,this._renderer._curCamera.eyeZ,])
    generator=halton(2);
    generator2=halton(3);
    generator3=hammersley(samples/16);
    sam=stratify(generator,generator3,4);
    clearframebuffer();
  }
  randoms=sam();
  randoms.push(generator2())
  //randoms=[Math.random(),Math.random(),Math.random()];
  if(lockcamera.checked==false)
    orbitControl();
  
  if(transparent.checked==false)
    useShader(a)
  else{
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    useShader(backface);
    //drawtriangles(arr,null);
    gl.disable(gl.CULL_FACE);
    useShader(transparentshader);
  }

  
  if(query==null){
    query =ext.createQueryEXT();
    ext.beginQueryEXT(ext.TIME_ELAPSED_EXT, query);
    drawtriangles(arr,framebuffer);
    ext.endQueryEXT(ext.TIME_ELAPSED_EXT);
  }
  else{
    drawtriangles(arr,framebuffer);
  }
  
  useShader(b);
  drawtriangles(t.array,framebuffer);
  
  useShader(bloom);
  drawtriangles(t2,bloommap);
  //savecanvas();
  rendertocanvas();
  //useShader(b)
  //drawpoints(arr)
  time++;
  if(time>samples)
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