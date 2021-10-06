function rays(lightposition, photons, model) {}

function intersect(origin, raydir, tri) {
  //raydir.norm();

  let normal = tri.normal;

  //   if (raydir.dot(normal) >= 0){
  //     return false;
  // }

  // let dir=tri.center.minus(origin);
  //   if(dir.cross(raydir).length()>tri.radius){
  //     //console.log('方向不对');
  //     return false;
  //   }

  //let v0 = tri.p1.minus(origin);

  //let d = tri.p1.dot(normal);

  //let t = (normal.dot(origin) + d) / normal.dot(raydir);

  let t = tri.p1.minus(origin).dot(normal) / raydir.dot(normal);
  if (t < 0) {
    //t咋么会小于0
    return false;
  }

  let position = origin.add(raydir.scale(t)); //其实t应该取负数

  let v0 = tri.p1;
  let v1 = tri.p2;
  let v2 = tri.p3;
  let edge0 = v1.minus(v0);
  let edge1 = v2.minus(v1);
  let edge2 = v0.minus(v2);

  let C0 = position.minus(v0);
  let C1 = position.minus(v1);
  let C2 = position.minus(v2);

  if (
    normal.dot(edge0.cross(C0)) > 0 &&
    normal.dot(edge1.cross(C1)) > 0 &&
    normal.dot(edge2.cross(C2)) > 0
  ) {
    return new vec3(origin, t, position);
  } else {
    return false;
  }
}
function intersectobj(origin, raydir, grid) {
  let length = grid.triangles.length;
  let closest = new vec3(0, 999999999, 0);
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
function raysimulate(rays, grid) {
  let time1 = millis();
  let num = 0;
  let photons = new Array();
  let c=Math.random()*TWO_PI;
  for (let i = 0; i < rays; i++) {
    let a=c+i*TWO_PI/rays;
    //let a=random()*TWO_PI;
    let b=Math.random()*PI;
    let s=Math.sin(b);//sin优化
      let x = Math.cos(a)*s;
      let y = Math.sin(a)*s;
      let z = Math.cos(b);
     let dir=vec3(x,y,z)
    //let dir =sampling(7,time);
    
    let temp = tracegrid(vec3(1, 110, 1), dir, grid);
    //let temp = intersectobj(vec3(1, 100, 1), dir.norm(), grid);
    if (temp != false) {
      photons.push(new Vec3(temp.z.x,-temp.z.y,temp.z.z));
      //photons.push(temp.z.x);
      //photons.push(temp.z.y);
      //photons.push(temp.z.z);
      num++;
    }
  }
  num /= rays*0.525;
  //console.log(intersectobj(new vec3(0.1,0.1,0.1),new vec3(x,y,z),m));
  //console.log(rays*0.525 + "次光线耗时(毫秒):", millis() - time1, "命中率:", num);
  //console.log('方向',x,y,z);

  drawphontons(photons);
}

function drawphontons(photons) {
  stroke(255, 0, 255); // Change the color
  strokeWeight(1); 
  const gl = this.drawingContext;
  //console.log(gl)
  let photondata=new Float32Array(photons);
  let photonbuffer=gl.createBuffer();
  //gl.bindBuffer(gl.ARRAY_BUFFER,photonbuffer);
  //gl.bufferData(gl.ARRAY_BUFFER,photondata,gl.STATIC_DRAW);
  this._renderer._drawPoints(photons, photonbuffer);
  //gl.drawArrays(gl.Points, 0, photons.length/3);
  noStroke();
}
p5.RendererGL.prototype._drawPoints = function(vertices, vertexBuffer) {
  const gl = this.GL;
  const pointShader = this._getImmediatePointShader();
  this._setPointUniforms(pointShader);
  
  this._bindBuffer(
    vertexBuffer,
    gl.ARRAY_BUFFER,
    this._vToNArray(vertices),
    Float32Array,
    gl.STATIC_DRAW
  );

  pointShader.enableAttrib(pointShader.attributes.aPosition, 3);

  gl.drawArrays(gl.Points, 0, vertices.length);

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
