
function setup() {
  frameRate(60)
  canvas=createCanvas(windowWidth,windowHeight,WEBGL);
  pixelDensity(1);
  console.log(displayDensity())
  gl=canvas.GL;
  gl.getExtension('EXT_color_buffer_float');
  gl.getExtension('OES_texture_float');
  gl.getExtension('EXT_disjoint_timer_query');
  gl.getExtension('OES_texture_float_linear');
  gl.getExtension('WEBGL_color_buffer_float');
  gl.getExtension('EXT_float_blend');
  gl.getExtension('EXT_frag_depth');
  ext = gl.getExtension('EXT_disjoint_timer_query');
  //console.log(gl.getSupportedExtensions());
  query =null;
  
  framebuffer=createFramebuffer(1);
  bloommap=createFramebuffer(3);
  backmap=createFramebuffer(4);
  photonmap=createFramebuffer(5);
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, 1, 1);
  
  createnoise(128);//生成一张噪声纹理
  //createworld();
  ambientcolor=color(255)
  loadImage('studio.jpg',world=>createworld(world));
  
  b=readshader('point.vert','point.frag');
  a=readshader('default.vert','default.frag');
  c=readshader('canvas.vert','canvas.frag');
  black=readshader('default.vert','black.frag');
  transparentshader=readshader('default.vert','transparent.frag');
  photonshader=readshader('point.vert','photon.frag');
  bloom=readshader('canvas.vert','bloom.frag');
  backface=readshader('default.vert','backface.frag');
  
  currentmodel=loadObj(getfromurl('teapot.obj'),true);
  arr=currentmodel.arr;
  grid=new Grid(currentmodel);
  
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
  
  t0=new tri(vec3(0.0,0.0,100.0),vec3(66.0,100.0,100.0),vec3(100.0,-66.0,100.0));
  t=t0.scale(1);
  //setInterval(drawFrame,16);
  //drawFrame();
  setcamera()
}
let t,time=1;
const samples=2560;
function draw() { 
  
  if(lockcamera.checked==false)
    orbitControl();
  
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);//开启混合
  if(time==1){
    t=t0.scale(lightradius.value);//调整光源尺寸
    rejection=0,total=0;//重置采样计数
    
    generator=halton(2);
    generator2=halton(3);
    generator3=hammersley(samples/16);
    sam=stratify(generator,generator3,4);
    clearframebuffer(framebuffer);
    clearframebuffer(photonmap,0);
    if(lighttracing.checked==true){
      //gl.blendFuncSeparate(gl.ZERO, gl.ONE, 1, 1);
      useShader(black);//画黑色
      drawtriangles(arr,framebuffer);
      drawtriangles(arr,photonmap);
    }
  }
  randoms=sam();
  randoms.push(generator2());
  //randoms=[Math.random(),Math.random(),Math.random()];
  
  if(lighttracing.checked==false)
  {
    if(transparent.checked==false)
    useShader(a);
  else{
    if(time==1){
      gl.bindFramebuffer(gl.FRAMEBUFFER, backmap);//每次清空背面
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.FRONT);
    useShader(backface);
    drawtriangles(arr,backmap);
    gl.disable(gl.CULL_FACE);
    }
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
  }}
  
  useShader(b);//画光源
  drawtriangles(t.array,framebuffer);
  
  if(lighttracing.checked==true){//发射光子
    gl.depthFunc(gl.LEQUAL);
    let temp=trisampling(t);
    let photons=raysimulate(temp,grid);//photons作为数组
    photoncount=photons.length;
      
    gl.blendFunc(gl.ONE, gl.ONE);
    useShader(photonshader);
    drawpoints(photons,photonmap);//画光子
    
  }
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  useShader(bloom);
  drawtriangles(t2,bloommap);
  //savecanvas();
  gl.blendFunc(gl.ONE, gl.ZERO);//关闭混合因为会干扰光子的叠加
  rendertocanvas();
  
  time++;
  if(time==samples&&lighttracing.checked==false)//if(total>5000000000)
    noLoop();
  if (query) {
  let available = ext.getQueryObjectEXT(query, ext.QUERY_RESULT_AVAILABLE_EXT);
  let disjoint = gl.getParameter(ext.GPU_DISJOINT_EXT);
  if (available&&!disjoint) {
  let timeElapsed = ext.getQueryObjectEXT(query, ext.QUERY_RESULT_EXT);
  fps.textContent=timeElapsed/1000000;
}
  if(available||disjoint){
    ext.deleteQueryEXT(query);
    query=null;
}
  }
}
function setcamera(){
  this._renderer._curCamera.setPosition(291.3318359688469, -86.37646567228508, 21.391875407101793);
  this._renderer._curCamera.lookAt(0, 0, 0);
}