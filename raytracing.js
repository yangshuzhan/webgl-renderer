
function intersect(origin, raydir, tri) {
  let oa=tri.p1.minus(origin);
  //let ab=tri.p2.minus(tri.p1);
  //let ac=tri.p3.minus(tri.p1);
  
  //let ab=tri.ab;
  //let ac=tri.ac;
  let temp=1/tri.temp.dot(raydir);
  let temp2=oa.cross(raydir);
  let x=temp2.dot(tri.ac)*temp;
  let y=-temp2.dot(tri.ab)*temp;
  if(x>0&&y>0&&x+y<1){
    let A=1-x-y;
    //debugger
    //let normal=tri.normal1.scale(A).add(tri.normal2.scale(x)).add(tri.normal3.scale(y));
    let normal=new Vec3(tri.normal1.x*A+tri.normal2.x*x+tri.normal3.x*y,tri.normal1.y*A+tri.normal2.y*x+tri.normal3.y*y,tri.normal1.z*A+tri.normal2.z*x+tri.normal3.z*y);
    if(normal.dot(raydir)>0)//光线跟法线同向
      return false;
    normal.norm();
    let position=new Vec3(tri.ab.x*x+tri.ac.x*y+tri.p1.x,tri.ab.y*x+tri.ac.y*y+tri.p1.y,tri.ab.z*x+tri.ac.z*y+tri.p1.z)
    //let position=ab.scale(x).add(ac.scale(y)).add(oa);
    let t;
    if(raydir.x!=0){
      t=(position.x-origin.x)/raydir.x;
    }
    else if(raydir.y!=0){
      t=(position.y-origin.y)/raydir.y;
    }
      
    else {
      t=(position.z-origin.z)/raydir.z;
    }
    return new Vec3(normal, t, position);
  }
    else{
      return false;
    }
}
function intersectobj(origin, raydir, grid) {
  let length = grid.triangles.length;
  let closest = new Vec3(0, 999999999, 0);
  //console.log('共有这么多面',length)
  for (i = 0; i < length; i++) {
   
    let intersection = intersect(origin, raydir, grid.triangles[i]);
    if (intersection == false) {
      continue;
    } else if (closest.y > intersection.y) {
      //取最近点
      closest = intersection;
    }
    //console.log('光源与面重合',intersection)//舍去较远点
  }
  if (closest.y == 999999999) return false;
  else return closest;
}
let num=0,num2=0;

function raysimulate(rays, grid) {
  let time1=millis();
  
  
  let photons = new Array();
  let position=vec3(200*Math.sin(6*mouseX/width-3),300-2*mouseY,200*Math.cos(6*mouseX/width-3))
  while(millis()-time1<17){
    //let a=Math.random()*TWO_PI;
    //let b=Math.random()*PI;
    sampling();
  }
    

    
    //console.log(num + "次光线耗时(毫秒):", millis() - time0, "命中率:", num/num2,'速度（光线/毫秒）',num/(millis() - time1));
    console.log("耗时(毫秒):",millis()-time1, "命中率:", num/num2);


  drawphontons(photons);
  
  function sampling(){
  for (let i = 0; i < 10; i++) {
    let a=Math.random()*TWO_PI;
    let z=Math.random()*2-1;
    let r=fsqrt(1-z*z);
    let x=Math.cos(a)*r;
    let y=Math.sin(a)*r;
    
    let temp=tracegrid(position, vec3(x,y,z), grid);
    if(temp!=false){
      photons.push(temp.z.x);
      photons.push(-temp.z.y);
      photons.push(temp.z.z);
      
      photons.push(temp.x.x);//传递normal
      photons.push(temp.x.y);
      photons.push(temp.x.z);
      num++;
    }
  }
    num2+=10;
}
}

function drawphontons(photons) {
  stroke(255, 0, 255); // Change the color
  strokeWeight(0.9); 
  const gl = this.drawingContext;
  //console.log(gl)
  let photondata=new Float32Array(photons);
  let photonbuffer=gl.createBuffer();
  //gl.bindBuffer(gl.ARRAY_BUFFER,photonbuffer);
  //gl.bufferData(gl.ARRAY_BUFFER,photondata,gl.STATIC_DRAW);
  this._renderer.drawPoints(photons, photonbuffer);
  //gl.drawArrays(gl.Points, 0, photons.length/3);
  noStroke();
}
p5.RendererGL.prototype.drawPoints = function(vertices, vertexBuffer) {
  const gl = this.GL;
  const pointShader = pointshader;
  //console.log(pointShader);
  pointShader._renderer=this;
  //console.log(pointShader);
  pointShader.init();
  pointShader._loadAttributes();
  //pointShader._loadUniforms();
  pointShader.bindShader();
  
  //this._setPointUniforms(pointShader);
  //pointShader.setUniform('cmatrix',this._curCamera.cameraMatrix.mat4);
  //pointShader.setUniform('pmatrix',this._curCamera.projMatrix.mat4);
  
  gl.enable(gl.BLEND);
  
  this._bindBuffer(
    vertexBuffer,
    gl.ARRAY_BUFFER,
    vertices,
    Float32Array,
    gl.STATIC_DRAW
  );
  
  pointShader.enableAttrib(pointShader.attributes.aPosition, 3,gl.FLOAT,false,24,0);
  pointShader.enableAttrib(pointShader.attributes.aNormal, 3,gl.FLOAT,false,24,12);
  
  gl.drawArrays(gl.Points, 0, vertices.length/6);

  pointShader.unbindShader();
};

function rayboxintersect(origin, raydir, boxmin, boxmax) {
  if (
    origin.x < boxmax.x &&
    origin.y < boxmax.y &&
    origin.z < boxmax.z &&
    origin.x > boxmin.x &&
    origin.y > boxmin.y &&
    origin.z > boxmin.z
  ) {
    //console.log("在格子里");
    //点在格子内
    return true;
  }
 
  boxmin = boxmin.minus(origin);
  boxmax = boxmax.minus(origin);
  let tx0 = boxmin.x / raydir.x;
  let tx1 = boxmax.x / raydir.x;
  let y0 = tx0 * raydir.y,
    y1 = tx1 * raydir.y,
    z0 = tx0 * raydir.z,
    z1 = tx1 * raydir.z;
  if (raydir.x > 0) {//与x面相交
    if (y0 > boxmin.y && y0 < boxmax.y && z0 > boxmin.z && z0 < boxmax.z&&tx0>0)
      return vec3(boxmin.x, y0, z0).add(origin);
  } else if (raydir.x < 0) {
    if (y1 > boxmin.y && y1 < boxmax.y && z1 > boxmin.z && z1 < boxmax.z&&tx1>0)
      return vec3(boxmax.x, y1, z1).add(origin);
  }

  let ty0 = boxmin.y / raydir.y,
    ty1 = boxmax.y / raydir.y;
  x0 = ty0 * raydir.x;
  x1 = ty1 * raydir.x;
  z0 = ty0 * raydir.z;
  z1 = ty1 * raydir.z;
  
  if (raydir.y > 0) {
    if (x0 > boxmin.x && x0 < boxmax.x && z0 > boxmin.z && z0 < boxmax.z&&ty0>0)
      return vec3(x0, boxmin.y, z0).add(origin);
  } else if (raydir.y < 0) {
    if (x1 > boxmin.x && x1 < boxmax.x && z1 > boxmin.z && z1 < boxmax.z&&ty1>0)
      return vec3(x1, boxmax.y, z1).add(origin);
  }

  let tz0 = boxmin.z / raydir.z,
    tz1 = boxmax.z / raydir.z;
  x0 = tz0 * raydir.x;
  x1 = tz1 * raydir.x;
  y0 = tz0 * raydir.y;
  y1 = tz1 * raydir.y;
  if (raydir.z > 0) {
    if (x0 > boxmin.x && x0 < boxmax.x && y0 > boxmin.y && y0 < boxmax.y&&tz0>0)
      return vec3(x0, y0, boxmin.z).add(origin);
  } else if (raydir.z < 0) {
    if (x1 > boxmin.x && x1 < boxmax.x && y1 > boxmin.y && y1 < boxmax.y&&tz1>0)
      return vec3(x1, y1, boxmax.z).add(origin);
  }
  return false;
}
