
let m,mandel,test2,m0,myfont,time,finalmat,canvas,g;

function preload(){
  //frameRate(1);
  mandel = loadShader('shader.vert', 'shader.frag');
  test2 = loadShader('shader.vert', 'shader.frag');
  depth =loadShader('shader.vert','depth.frag');
  normal =loadShader('shader.vert','normal.frag');
  post =loadShader('post.vert','post.frag');
  m0 = loadModel('teapot.obj',true);
  myfont=loadFont('inconsolata.otf');
  input = createFileInput(handleFile);
  input.position(0, 0);
  slider0 = createSlider(1, 4, 1,0);
  slider0.position(20, 60);
  slider0.style('width', '80px');
  picker1=createColorPicker('#000000');
  picker1.position(20, 100);
  slider2 = createSlider(0.0, 99000000, 5000000,0);
  slider2.position(20, 150);
  slider2.style('width', '80px');
  slider3 = createSlider(0.0, 1000, 100,0);
  slider3.position(20, 200);
  slider3.style('width', '80px');
  picker4=createColorPicker('#555555');
  picker4.position(20, 250);
  slider5 = createSlider(0.0, 0.2, .1,0);
  slider5.position(20, 300);
  slider5.style('width', '80px');
  slider6 = createSlider(0.0, 1, .5,0);
  slider6.position(20, 350);
  slider6.style('width', '80px');
  slider7 = createSlider(0.0, 0.5, 0.5,0);
  slider7.position(20, 390);
  slider7.style('width', '80px');
  slider8 = createSlider(0.0, 2, 0.5,0);
  slider8.position(20, 430);
  slider8.style('width', '80px');
  //let val = slider.value();
  let span0 = createSpan('fresnel');
  span0.position(20, 40);
  let span = createSpan('diffusecolor');
  span.position(20, 80);
  let span2 = createSpan('lightintensity');
  span2.position(20, 130);
  let span3 = createSpan('lightradius');
  span3.position(20, 180);
  let span4 = createSpan('ambient');
  span4.position(20, 230);
  let span5 = createSpan('radius');
  span5.position(20, 280);
  let span6 = createSpan('strength');
  span6.position(20, 320);
  let span7 = createSpan('bias');
  span7.position(20, 370);
  let span8 = createSpan('bias2');
  span8.position(20, 410);
}
function handleFile(file){
  //console.log(a.name);
  
  loadStrings(
    file.data,
    lines => {
      let blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      m=loadModel(URL.createObjectURL(blob) + "#ext=.obj",true);
      g=new grid(m);
})
  
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
  a.setUniform('finalmat',finalmat);
  a.setUniform('random',random());
  a.setUniform('lightintensity',1.0);
  a.setUniform('lightlocation',[300*sin(6*mouseX/width-3),300-2*mouseY,300*cos(6*mouseX/width-3)]);
  a.setUniform('cameralocation',[this._renderer._curCamera.eyeX,-this._renderer._curCamera.eyeY,this._renderer._curCamera.eyeZ]);
  //console.log(this._renderer._curCamera.cameraMatrix.mat4);
  a.setUniform('camerafar',this._renderer._curCamera.cameraFar);
  a.setUniform('cameranear',this._renderer._curCamera.cameraNear);
  a.setUniform('fresnel',slider0.value());
  a.setUniform('diffusecolor',picker1.color()._array);
  a.setUniform('lightintensity',slider2.value());
  a.setUniform('lightradius',slider3.value());
  a.setUniform('ambient',picker4.color()._array);
  a.setUniform('presampler',canvas);
  a.setUniform('sampler',depthmap);
  a.setUniform('sampler2',normalmap);
  a.setUniform('sampler3',postmap);
  a.setUniform('radius',slider5.value());
  a.setUniform('strength',slider6.value());
  a.setUniform('time',time);
  a.setUniform('bias',slider7.value());
  a.setUniform('bias2',slider8.value());
}

function draw() {
  time++;
  //console.log(rayboxintersect(vec3(1,201,1), vec3(0,-1,0), vec3(-200,-200,0), vec3(200,200,200)))
  //finalmat=mat4toarray(math.transpose(math.inv(arraytomat4(this._renderer._curCamera.cameraMatrix.mat4))));
  //shader(mandel);
  //rotateX(millis() / 1000);
  //quad(10,10,-10,10,-1,-1,1,-1)
  //normalMaterial();  
  if(m){  
    //测试相交
    //console.log(m.faces);
    
    
    //console.log('center',g.center);
    //console.log('maxpoint',g.maxpoint);
    //console.log('minpoint',g.minpoint);
    if(g.triangles.length==0){
    g=new grid(m);
    console.log(g);
    }
    
    raysimulate(200,g);
    
      //渲染深度图
    uniformgroup(depth);
    depthmap.shader(depth);
    //depthmap.background(255);
    depthmap.clear();
    depthmap.model(m);
    //渲染normal
    uniformgroup(normal);
    normalmap.shader(normal);
    normalmap.clear();
    normalmap.model(m);
    
    
    uniformgroup(mandel);
    postmap.shader(mandel);
    postmap.clear();
    postmap.background(picker4.color());
    postmap.model(m);//渲染模型
    
    //console.log(m);
    uniformgroup(post);
    shader(post); 
    plane();
 
    

    
  }
  else{
    uniformgroup(test2);
    shader(test2);
    background(picker4.color());
    model(m0);
    
    
  push();
  scale(1,-1,1);
  translate(500*sin(6*mouseX/width-3),500-mouseY,500*cos(6*mouseX/width-3));
  resetShader();
  sphere(slider3.value()/10);
  pop();
  }
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
