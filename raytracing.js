'use strict';
function intersect(origin, raydir, tri) {
  //let temp=tri.temp.dot(raydir);
  // if(temp<=0)//背面剔除
  //   temp=-temp;
  let temp=tri.temp.dot(raydir);
  let temp2=tri.p1.minus(origin).cross(raydir);
  let x=tri.b.dot(temp2)/temp;
  if(x<0)
    return false;
  let y=-tri.a.dot(temp2)/temp;
  if(y>=0&&x+y<=1){
    let position=new Vec3(tri.a.x*x+tri.b.x*y+tri.p1.x,tri.a.y*x+tri.b.y*y+tri.p1.y,tri.a.z*x+tri.b.z*y+tri.p1.z);
    let t;
    if(raydir.x){
      t=(position.x-origin.x)/raydir.x;
    }
    else if(raydir.y){
      t=(position.y-origin.y)/raydir.y;
    }
    else {
      t=(position.z-origin.z)/raydir.z;
    }
    if(t>0.0001){
      let normal=tri.n1.scale(1-x-y).addto(tri.n2.scale(x)).addto(tri.n3.scale(y)).norm();//平滑法线 
      return [t,tri.normal,position,normal,tri.materialid];
    }
  }
  return false;  
}
function metro(path){
  let arr=new Array(path),prearr=new Array(path);
  prearr.fill(0.5),arr.fill(0.5);
  function next(i){
    if(rejection===0)
      prearr[i]=arr[i]
    
      arr[i]=prearr[i]+direction*0.01*Math.random()/Math.log1p(time);
    if(arr[i]>1)
      arr[i]--
      else if(arr[i]<0)
        arr[i]++
      return arr[i];
  }
  return next;
}
let photoncount=0,totalrejection=0;
let rejection=0,total=0,maxdepth=20,direction=1;
let indir=[],inspeed=[],vertical=[],metro1=metro(maxdepth),metro2=metro(2),lastdir=[];
while(indir.length<=maxdepth){
          indir.push(randdir());
          lastdir.push(randdir());
          inspeed.push(randdir());
          vertical.push(inspeed[inspeed.length-1].cross(indir[indir.length-1]).norm());
        }
let index=0;
function raysimulate(origin, grid, normal) {
  let time1 = Date.now();
  let photons = [],tempindex=0,prephotons;
  let preweight=0,weight,preindex=0,raylength=0;
  for(let i=0;i%200!=0||Date.now() - time1<16;i++) {//while((i%50!=0||Date.now() - time1<16))
    // indir=[],inspeed=[],vertical=[];
    //tempphotons=[];
    let tempindex=photons.length;
    weight=0;
    raylength=bsdf(trisampling(t,metro2(0),metro2(1)),false,normal,normal,[1,1,1],[1,1,1],0,0,0,1);
    //raylength=bsdf(origin,false,normal,normal,[1,1,1],[1,1,1],0,0,0,1);
    weight+=0.0001;
    if(weight>Math.random()*preweight){//接受采样
       preweight=weight;
      for(let i=tempindex;i<photons.length;i+=18){
        photons[9+i]/=weight;
        photons[10+i]/=weight;
        photons[11+i]/=weight;//概率并不能简单地除以密度
        //概率并不能简单地除以密度
      }
      for(let i=0;i<=raylength;i++)
      lastdir[i]=indir[i];
      if(rejection>0){
        for(let i=prephotons;i<tempindex;i+=18){
        photons[9+i]*=rejection+1;
        photons[10+i]*=rejection+1;
        photons[11+i]*=rejection+1;
      }
      rejection=0;
      }
    }
    else{//拒绝
        
        // if(inspeed[i]){
        if(rejection===0)//标记拒绝采样之前的光子
          prephotons=tempindex-18;
      direction=-direction;
      rejection++
      photons.length=tempindex;
      totalrejection++
    }
    uptateMetropolis(raylength);
   }
  photoncount=photons.length; 
  total+=photons.length;
  //console.log(rejection/(rejection+total))
  // console.log(photons.length)
  return photons;
    function addphotons(position,normal,raydir,color,length,smoothnormal,roughness,refraction){
      photons.push(position.x,position.y,position.z,normal.x,normal.y,normal.z,raydir.x,raydir.y,raydir.z,color[0],color[1],color[2],smoothnormal.x,smoothnormal.y,smoothnormal.z,length,roughness,refraction);//法线和位置,颜色
    }
    function bsdf(position,raydir,normal,smoothnormal,color,objcolor,path,length,refraction,roughness){
      //dir=metropolis(path).add(normal).norm();
      // if(path>10||Math.random()<1-(objcolor[0]+objcolor[1]+objcolor[2])/3){//颜色转化为概率
      //   return path;
      // }
      // objcolor=normcolor(objcolor);
      // if(path>10)//颜色转化为概率
      //   return path;

      let resultray,raytype;
      
      if(roughness>0){
        resultray=metropolis(path).add(normal).norm();
        raytype=0;
        refraction=0
      }
      else if(metro1(path)<fresnel(raydir,normal)){
        resultray=refract(raydir,smoothnormal);
        raytype=1;
        refraction++
      }
      else{
        resultray=reflect(raydir,smoothnormal);
        raytype=2;
        refraction++
      }
      
      let viewdir=cameralocation.minus(position),distance=viewdir.length(),temp=viewdir.norm().dot(smoothnormal);
      
      if(path>0&&raytype===0||raytype===1){//漫反射和第一次折射的时候吸收
        color[0]*=objcolor[0];//吸收颜色其实不对
        color[1]*=objcolor[1];
        color[2]*=objcolor[2];
      }
      if(path>0&&temp>0){
        if(raytype===0){
          addphotons(position,normal,raydir,color,length,smoothnormal,roughness,0);
          weight+=temp*(color[0]+color[1]+color[2])/distance;
        }
        else{//折射或者反射
          weight+=(color[0]+color[1]+color[2])*Math.pow(max(viewdir.dot(resultray.norm()),0),distance);
          addphotons(position,normal,resultray,color,length,smoothnormal,roughness,refraction);
        }
      }
      let result = tracegrid(position, resultray, grid);
      if(result&&path<maxdepth){//命中
return bsdf(result[2],resultray,result[1],result[3],color,materialtable[result[4]][1],++path,length+result[0],refraction,materialtable[result[4]][2]);
     }
     else return path;
    }
  
      function metropolis(path){

        let step=Math.random();
        // if(rejection>0)//有问题
        //   step=Math.random();

        indir[path]=lastdir[path].add(inspeed[path].scale(direction*step/Math.log2(10+time))).norm();
        // if(reject===0){
        // let swap=inspeed[path];
        // inspeed[path]=vertical[path];
        // vertical[path]=swap;
        // }
        
        
        return indir[path];
      }
      function uptateMetropolis(length){
        index++
        if(index*index*index>time){
          for(let path=0;path<=length;path++){
            vertical[path].addto(new Vec3(Math.random()-0.5,Math.random()-0.5,Math.random()-0.5)).norm();
            inspeed[path]=vertical[path].cross(indir[path]).norm();
          }
          index=0
        }
          
      }
     
    function fresnel(raydir,normal){
        let f0=0.9,cosa=-raydir.dot(normal);
        if(cosa>0)
          return f0-f0*(1-cosa)*(1-cosa)*(1-cosa)*(1-cosa)*(1-cosa);
        else if(-cosa<0.2)//全反射
          return 0;
        else return -0.8*cosa+0.2;
      }
  function reflect(raydir,normal){
        return raydir.minus(normal.scale(raydir.dot(normal)*2));
      }
      function refract(I,N){
        let t=I.dot(N),eta=0.75
          //t=abs(t)
           let k = 1.0 - eta * eta * (1.0 - t*t);
        if(k<0)
          return reflect(I,N);
        else
          return I.scale(eta).addto(N.scale(eta * t - Math.sqrt(k)));
      }
}


function randdir(){
  let a=Math.random()*6.283185;
  let z=Math.random()*2-1;
  let temp=Math.sqrt(1-z*z);
  let x=Math.sin(a)*temp;
  let y=Math.cos(a)*temp;
  return new Vec3(x,y,z);
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
      return new Vec3(boxmin.x, y0, z0).addto(origin);
  } else if (raydir.x < 0) {
    if (y1 > boxmin.y && y1 < boxmax.y && z1 > boxmin.z && z1 < boxmax.z&&tx1>0)
      return new Vec3(boxmax.x, y1, z1).addto(origin);
  }

  let ty0 = boxmin.y / raydir.y,
    ty1 = boxmax.y / raydir.y;
  let x0 = ty0 * raydir.x;
  let x1 = ty1 * raydir.x;
  z0 = ty0 * raydir.z;
  z1 = ty1 * raydir.z;
  
  if (raydir.y > 0) {
    if (x0 > boxmin.x && x0 < boxmax.x && z0 > boxmin.z && z0 < boxmax.z&&ty0>0)
      return new Vec3(x0, boxmin.y, z0).addto(origin);
  } else if (raydir.y < 0) {
    if (x1 > boxmin.x && x1 < boxmax.x && z1 > boxmin.z && z1 < boxmax.z&&ty1>0)
      return new Vec3(x1, boxmax.y, z1).addto(origin);
  }

  let tz0 = boxmin.z / raydir.z,
    tz1 = boxmax.z / raydir.z;
  x0 = tz0 * raydir.x;
  x1 = tz1 * raydir.x;
  y0 = tz0 * raydir.y;
  y1 = tz1 * raydir.y;
  if (raydir.z > 0) {
    if (x0 > boxmin.x && x0 < boxmax.x && y0 > boxmin.y && y0 < boxmax.y&&tz0>0)
      return new Vec3(x0, y0, boxmin.z).addto(origin);
  } else if (raydir.z < 0) {
    if (x1 > boxmin.x && x1 < boxmax.x && y1 > boxmin.y && y1 < boxmax.y&&tz1>0)
      return new Vec3(x1, y1, boxmax.z).addto(origin);
  }
  return false;
}

