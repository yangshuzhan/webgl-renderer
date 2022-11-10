function setup() {
  frameRate(60)
  canvas=createCanvas(windowWidth,windowHeight,WEBGL);
  pixelDensity(1);
  //console.log(displayDensity())
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
  differencemap=createFramebuffer(6);
  
  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, 1, 1);
  gl.depthFunc(gl.LEQUAL);
  createnoise(128);//生成一张噪声纹理
  //createworld();
  ambientcolor=color(0)
  loadImage('studio.jpg',world=>createworld(world));
  
  b=readshader('point.vert','point.frag');
  a=readshader('default.vert','default.frag');
  c=readshader('canvas.vert','canvas.frag');
  black=readshader('default.vert','black.frag');
  transparentshader=readshader('default.vert','transparent.frag');
  photonshader=readshader('photon.vert','photon.frag');
  bloom=readshader('canvas.vert','bloom.frag');//用来混合光晕和光子
  difference=readshader('canvas.vert','difference.frag');//用来混合光晕和光子
  backface=readshader('default.vert','backface.frag');
  
  currentmodel=loadObj(getfromurl('teapot.obj'),true);
  //arr=currentmodel.arr;
  // grid=new Grid(currentmodel);
  // arr=depthofvert(currentmodel,grid);
  t0=new tri(vec3(66.0,100.0,100.0),vec3(0.0,0.0,100.0),vec3(100.0,-66.0,100.0));
  t=t0.scale(1);
  //setInterval(drawFrame,16);
  //drawFrame();
  setcamera(283.1511030186248,-112.28185371990193,-3.314059294267578)
  //setcamera(-25.90765174020619,-86.17297624556258,-227.46752438819215)
  inputmap=new Float32Array(width*height*4);
  output=new Float32Array(width*height*4);
}
let t,time=1;
const samples=2560;

function draw() { 
  cameralocation=new Vec3(this._renderer._curCamera.eyeX,this._renderer._curCamera.eyeY,this._renderer._curCamera.eyeZ);
  if(lockcamera.checked==false)
    orbitControl();
  clearframebuffer(framebuffer);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);//开启混合
  if(time===1){
    t=t0.scale(lightradius.value).rotate(lightrotation.value).distance(lightdistance.value);//调整光源尺寸
    rejection=0,total=0,totalrejection=0;//重置采样计数
    clearframebuffer(differencemap);//清空用来存图像边缘的图
    lightx=halton(2);
    lighty=halton(3);
    generator=halton(2);
    generator2=halton(3);
    generator3=hammersley(samples/16);
    sam=stratify(generator,generator3,4);
  }
  randoms=sam();
  randoms.push(generator2());
  //randoms=[Math.random(),Math.random(),Math.random()];
  
  if(lighttracing.checked==false)//避免与之前的图层叠加
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
    drawtriangles(arr,backmap,true);
    gl.disable(gl.CULL_FACE);
    }
    useShader(transparentshader);
  }

  if(query==null){
    query =ext.createQueryEXT();
    ext.beginQueryEXT(ext.TIME_ELAPSED_EXT, query);
    if(lighttracing.checked===false)
      drawtriangles(arr,framebuffer,true);//画物体
    ext.endQueryEXT(ext.TIME_ELAPSED_EXT);
  }
  else{
    if(lighttracing.checked===false)
      drawtriangles(arr,framebuffer,true);
  }}
  
    useShader(b);//画光源
    drawtriangles(t.array,framebuffer);
  
  if(lighttracing.checked==true){//发射光子
    let photons=raysimulate(trisampling(t,randoms[0],randoms[2]),grid,t.normal);//photons作为数组
    photoncount=photons.length;

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    useShader(black);//framebuffer画黑色
    drawtriangles(arr,framebuffer,true);//不平滑
    
    gl.blendFunc(gl.ONE, gl.ZERO);
    useShader(black);//画黑色
    drawtriangles(arr,photonmap,true);//每次画个黑色底色
    useShader(backface);
    drawtriangles(arr,backmap,true);//用于读取深度
    gl.blendFunc(gl.ONE, gl.ONE);
    useShader(photonshader);
    drawpoints(photons,photonmap);//画光子
  }
  
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  useShader(bloom);
  drawtriangles(t2,bloommap);
  //savecanvas();
  
  
  if(time%60===0){
    // console.log(total/time)
    //console.log(totalrejection/(total+totalrejection))
    //myfilter(output);
    useShader(difference);
    drawtriangles(t2,differencemap);
  }
    
  gl.blendFunc(gl.ONE, gl.ZERO);//关闭混合因为会干扰光子的叠加
  rendertocanvas();//渲染完成
  
  

  //清理光子贴图
  if(lighttracing.checked==true){
    clearframebuffer(photonmap,0);
    clearframebuffer(backmap,0);
  }
  
  
  time++;
  if(time==samples&&infinite.checked===false)
    {
      noLoop();
      console.log('Finished');
    }
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
  if(localStorage.camera){
    let temp=localStorage.camera.split(',')
    this._renderer._curCamera.setPosition(...temp);
  }
  else
    this._renderer._curCamera.setPosition(291.3318359688469, -86.37646567228508, 21.391875407101793);
  this._renderer._curCamera.lookAt(0, 0, 0);
}
function myfilter(output){
  gl.bindFramebuffer(gl.FRAMEBUFFER, bloommap);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.FLOAT, output);
  for(let i=0;i<output.length-width*4;i+=4){
    if(i%(4*width)>=4*width-4){
      continue;
    }
    let sx=abs(output[i]-output[i+4]);
    let sy=abs(output[i]-output[i+width*4]);
    output[i]=(sy+sx)/3/(0.01+output[i]);
    //output[i+1]=(sy+sx)/3/output[i+1];
    //output[i+2]=(sy+sx)/3/output[i+2];
    //output[i+3]=1;
  }
  gl.activeTexture(gl.TEXTURE6);
  gl.bindTexture(gl.TEXTURE_2D, differencemap.texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, output);
}