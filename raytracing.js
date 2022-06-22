
function intersect(origin, raydir, tri) {
  //raydir.norm();
  //let oa=tri.p1.minus(origin);
  //let ab=tri.p2.minus(tri.p1);
  //let ac=tri.p3.minus(tri.p1);
  
  //let ab=tri.ab;
  //let ac=tri.ac;
  //tri.temp表示两边的叉乘，可提前存储
  let temp=1/tri.temp.dot(raydir);
  //let temp2=oa.cross(raydir);
  let temp2=tri.p1.minus(origin).cross(raydir);
  let x=temp2.dot(tri.b)*temp;
  let y=-temp2.dot(tri.a)*temp;
  if(x>0&&y>0&&x+y<1){
    let position=new Vec3(tri.a.x*x+tri.b.x*y+tri.p1.x,tri.a.y*x+tri.b.y*y+tri.p1.y,tri.a.z*x+tri.b.z*y+tri.p1.z)
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
    return new Vec3(tri.normal, t, position);
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
      closest = intersection;
    }
    //console.log('光源与面重合',intersection)//舍去较远点
  }
  if (closest.y == 999999999) return false;
  else return closest;
}
let presample=[0,0,0];//马尔科夫采样的方向
let speed=vec3(0.33,0.33,0.33);
let preresult=vec3(vec3(0,0,0),0,vec3(0,0,0));
let preweight=0.05,weight=0.05,photoncount=0;
let rejection=0,total=0;
function raysimulate(origin, grid) {
  let time1 = Date.now();
  let photons = new Array();
  let a,x,y,z,dir=vec3(0,0,0),result;
  let cameralocation=new Vec3(this._renderer._curCamera.eyeX,this._renderer._curCamera.eyeY,this._renderer._curCamera.eyeZ);
  while(Date.now() - time1<16) {
    // x = presample[0]+randomGaussian(0,0.1);
    // y = presample[1]+randomGaussian(0,0.1);
    // z = presample[2]+randomGaussian(0,0.1);
    
    dir.x=presample[0]+speed.x*0.3;
    dir.y=presample[1]+speed.y*0.3;
    dir.z=presample[2]+speed.z*0.3;
    dir=dir.norm();
    result = tracegrid(origin, dir, grid);
    //let temp = intersectobj(vec3(1, 100, 1), dir.norm(), grid);
    weight=measureweight(result,cameralocation,dir);
    if(preweight*Math.random()>weight){//如果采样失败，拒绝采样,Math.random()>weight/preweight
      result=false;
      speed=new Vec3(-speed.x,-speed.y,-speed.z);
      rejection++;
    }
    else{//如果采样成功
      preresult=result;
      presample=[dir.x,dir.y,dir.z];
      preweight=weight;
    }
    speed.x+=random(-0.05,0.05);
    speed.y+=random(-0.05,0.05);
    speed.z+=random(-0.05,0.05);//每次略微调整速度方向
    speed = speed.minus(dir.scale(speed.dot(dir)));

    
    // mutation增加均匀程度
    if(Math.random()<0.01){
      a=random(0,TWO_PI);
      z=random(-1,1);
      x=Math.sin(a)*Math.sqrt(1-z*z);
      y=Math.cos(a)*Math.sqrt(1-z*z);
      presample=[x,y,z];
      preresult=false;
      preweight=0.05;
    }
      //photons.push(new Vec3(temp.z.x,-temp.z.y,temp.z.z));
    if(result!=false){//如果采样点不是黑色的话
      photons.push(result.z.x,result.z.y,result.z.z,result.x.x,result.x.y,result.x.z);//法线和位置
      //let temp=(abs(dir.dot(result.x)));
      photons.push(1,1,1);//根据马尔可夫的概率反转计算权重
    }
  }
  total+=photons.length;
  //console.log(rejection/total,'rejection rate');
  //console.log(photons.length,'samples')
  //console.log(total)
  return photons;
}
function measureweight(result,cameralocation,dir){//背面的点权重应该为0,dir表示光线方向

  if(result===false||result.z.minus(cameralocation).dot(result.x)>0)
    return 0.05;
  else {
    let viewdir=result.z.minus(cameralocation);
    //let weight=Math.abs(dir.dot(result.x)*dir.dot(t.normal));//入射光系数*面光系数*视角系数
    let weight=Math.abs(dir.dot(t.normal)*viewdir.norm().dot(result.x));//入射光系数*面光系数*视角系数
    return weight;
  }
  //else return cameralocation.minus(result.z).norm().dot(result.x);
  
}
function rayboxintersect(origin, raydir, boxmin, boxmax) {
  if (
    origin.x < boxmax.x &&
    origin.y < boxmax.y &&
    origin.z < boxmax.z &&
    origin.x > boxmin.x &&
    origin.y > boxmin.y &&
    origin.z > boxmin.z
  ) {
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

