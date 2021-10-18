
let m,test2,m0,myfont,time,canvas,g,currentmodel;

function preload(){
  //frameRate(1);
  mandel = loadShader('shader.vert', 'shader.frag');
  test2 = loadShader('shader.vert', 'shader.frag');
  depth =loadShader('shader.vert','depth.frag');
  normal =loadShader('shader.vert','normal.frag');
  post =loadShader('post.vert','post.frag');
  pointshader =loadShader('point.vert','point.frag');
  m0 = loadModel('teapot.obj',true);
  g=new grid(m0);
  
  input = document.getElementById('fileinput');
  input.addEventListener('change', handleFile);
  console.log(input.files);
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

  aobias = document.getElementById('ao bias');

  aobias2 = document.getElementById('ao bias2');

  checkbox = document.getElementById('lighttracing');

}
function handleFile(){
  console.log(input.files);
 
      m=loadModel(input.files[0].webkitRelativePath,true);
      g=new grid(m);

}
  



function setup() {

  canvas=createCanvas(windowWidth, windowHeight, WEBGL);
  depthmap=createGraphics(width, height, WEBGL);
  depthmap.noStroke();
  normalmap=createGraphics(width, height, WEBGL);
  normalmap.noStroke();
  postmap=createGraphics(width, height, WEBGL);
  postmap.noStroke();
  //setAttributes('antialias', true);
  // create and initialize the shader
  
  noStroke();

  //strokeWeight(1);
  //frameRate(5);
  //console.log(m);
  //console.log(m0);
  //console.log(picker4.color());
  
  
}

function uniformgroup(a) {//批量设置uniform
  a.setUniform("iResolution", [width, height]);
  a.setUniform('cmatrix',this._renderer._curCamera.cameraMatrix.mat4);
  a.setUniform('pmatrix',this._renderer._curCamera.projMatrix.mat4);
  a.setUniform('random',Math.random());
  a.setUniform('lightintensity',1.0);
  a.setUniform('lightlocation',[300*Math.sin(6*mouseX/width-3),300-2*mouseY,300*Math.cos(6*mouseX/width-3)]);
  a.setUniform('cameralocation',[this._renderer._curCamera.eyeX,-this._renderer._curCamera.eyeY,this._renderer._curCamera.eyeZ]);
  //console.log(this._renderer._curCamera.cameraMatrix.mat4);
  a.setUniform('camerafar',this._renderer._curCamera.cameraFar);
  a.setUniform('cameranear',this._renderer._curCamera.cameraNear);
  a.setUniform('roughness',roughness.value);
  a.setUniform('fresnel',fresnel.value);
  a.setUniform('diffusecolor',color(picker1.value)._array);
  a.setUniform('lightintensity',slider2.value);
  a.setUniform('lightradius',slider3.value);
  a.setUniform('ambient',color(picker4.value)._array);
  a.setUniform('lightcolor',color(lightcolor.value)._array);
  a.setUniform('glossycolor',color(glossycolor.value)._array);
  a.setUniform('presampler',canvas);
  a.setUniform('sampler',depthmap);
  a.setUniform('sampler2',normalmap);
  a.setUniform('sampler3',postmap);
  a.setUniform('radius',aoradius.value);
  a.setUniform('strength',aostrength.value);
  a.setUniform('time',time);
  a.setUniform('bias',aobias.value);
  a.setUniform('bias2',aobias2.value);
}

function draw() {
  if(time<10)
  time++;
  
  //console.log(rayboxintersect(vec3(1,201,1), vec3(0,-1,0), vec3(-200,-200,0), vec3(200,200,200)))
  //finalmat=mat4toarray(math.transpose(math.inv(arraytomat4(this._renderer._curCamera.cameraMatrix.mat4))));
  //shader(mandel);
  //rotateX(millis() / 1000);
  //quad(10,10,-10,10,-1,-1,1,-1)
  //normalMaterial();  
  if(m){  
    currentmodel=m;
  }
  else{
    currentmodel=m0;
  }
    //console.log('center',g.center);
    //console.log('maxpoint',g.maxpoint);
    //console.log('minpoint',g.minpoint);
    if(g.triangles.length==0){
    g=new grid(currentmodel);
    //console.log(g.getcell(vec3(8.5324,-14.755076,31.3614)));
      
    }
    
    
    
      //渲染深度图
    uniformgroup(depth);
    depthmap.shader(depth);
    //depthmap.background(255);
    depthmap.clear();
    depthmap.model(currentmodel);
    //渲染normal
    uniformgroup(normal);
    normalmap.shader(normal);
    normalmap.clear();
    normalmap.model(currentmodel);
    
    if(checkbox.checked==true){
      uniformgroup(pointshader);
      raysimulate(1000,g);
    }
    
    uniformgroup(mandel);
    postmap.shader(mandel);
    postmap.clear();
    postmap.background(color(picker4.value));
    postmap.model(currentmodel);//渲染模型
    
    //console.log(m);
    uniformgroup(post);
    shader(post); 
    plane(100,100,100);
    
 
    

    
 

    
    
  push();
  scale(1,-1,1);
  translate(500*sin(6*mouseX/width-3),500-mouseY,500*cos(6*mouseX/width-3));
  resetShader();
  postmap.sphere(slider3.value/10);
  pop();
  
  //console.log(m);
  orbitControl();
}
function windowResized() {
  // depthmap.size(windowWidth, windowHeight);
  // normalmap.size(windowWidth, windowHeight);
  // postmap.size(windowWidth, windowHeight);
  // resizeCanvas(windowWidth, windowHeight);

  time=0;
}
function mouseMoved(){
  time=0;
  
  //finalmat=arraytomat4(this._renderer._curCamera.projMatrix.mat4);
  //console.log(finalmat);
}
function mouseDragged(){
  time=0;
}
function mouseWheel(){
  time=0;
}
