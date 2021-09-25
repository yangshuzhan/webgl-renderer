
let m,mandel,test2,m0,myfont;
function preload(){
  mandel = loadShader('shader.vert', 'shader.frag');
  test2 = loadShader('shader.vert', 'shader.frag');
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
}
function handleFile(file){
  //console.log(a.name);
  loadStrings(
    file.data,
    lines => {
      let blob = new Blob([lines.join('\n')], { type: 'text/plain' });
      m=loadModel(URL.createObjectURL(blob) + "#ext=.obj",true);
      
})}
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  //setAttributes('antialias', true);
  // create and initialize the shader


  
  noStroke();
  textFont(myfont);
  textSize(36);
  strokeWeight(0.1);
  //frameRate(5);
  //console.log(m);
  //console.log(m0);
  //console.log(picker4.color());
}

function uniformgroup(a) {//批量设置uniform
  a.setUniform("iResolution", [width, height]);
  a.setUniform('cmatrix',this._renderer._curCamera.cameraMatrix.mat4);
  a.setUniform('pmatrix',this._renderer._curCamera.projMatrix.mat4);
  a.setUniform('lightintensity',1.0);
  a.setUniform('lightlocation',[300*sin(6*mouseX/width-3),300-2*mouseY,300*cos(6*mouseX/width-3)]);
  a.setUniform('cameralocation',[this._renderer._curCamera.eyeX,this._renderer._curCamera.eyeY,this._renderer._curCamera.eyeZ]);
  //console.log(this._renderer._curCamera.cameraMatrix.mat4);
  a.setUniform('fresnel',slider0.value());
  a.setUniform('diffusecolor',picker1.color()._array);
  a.setUniform('lightintensity',slider2.value());
  a.setUniform('lightradius',slider3.value());
  a.setUniform('ambient',picker4.color()._array);
}

function draw() {
  scale(1,-1,1);
  background(picker4.color());
  push();
  translate(500*sin(6*mouseX/width-3),500-mouseY,500*cos(6*mouseX/width-3));
  resetShader();
  sphere(slider3.value()/10);
  pop();
  
  //shader(mandel);
  //rotateX(millis() / 1000);
  //quad(10,10,-10,10,-1,-1,1,-1)
  //normalMaterial();

  uniformgroup(mandel);
  if(m){
    uniformgroup(mandel);
    shader(mandel);
    model(m);
  }
  else{
    uniformgroup(test2);
    shader(test2);
    model(m0);
  }
  orbitControl();
}


