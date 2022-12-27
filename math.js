'use strict';
class Vec3 {
  constructor(a, b, c) {
    this.x = a;
    this.y = b;
    this.z = c;
  }
  dot(n) {
    return this.x * n.x+this.y * n.y+this.z * n.z;
  }
  minus(n) {
    return new Vec3(this.x - n.x, this.y - n.y, this.z - n.z);
  }
  minusto(n) {
    this.x -= n.x;
    this.y -= n.y;
    this.z -= n.z;
    return this;
  }
  cross(b) {
    return new Vec3(this.y * b.z - this.z * b.y,this.z * b.x - this.x * b.z,this.x * b.y -this.y * b.x);
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  norm() {//注意会改变原向量！
    let l = 1/this.length();
    this.x *= l;
    this.y *= l;
    this.z *= l;
    return this;
  }
  normnum(a) {
    let l = a/this.length();
    this.x *= l;
    this.y *= l;
    this.z *= l;
    return this;
  }
  scale(n) {
    return new Vec3(this.x * n, this.y * n, this.z * n);
  }
  scaleto(n) {
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return this;
  }
  addto(b){
    this.x+=b.x;
    this.y+=b.y;
    this.z+=b.z;
    return this;
  }
  add(b) {
    return new Vec3(this.x + b.x, this.y + b.y, this.z + b.z);
  }
  multiply(n) {
    return new Vec3(this.x * n.x, this.y * n.y, this.z * n.z);
  }
  divide(n) {
    return new Vec3(this.x / n.x, this.y / n.y, this.z / n.z);
  }
  dividenum(n) {
    return new Vec3(this.x / n, this.y / n, this.z / n);
  }
  dis(b) {
    return this.minus(b).length();
  }
  proj(b){
    return b.scale(this.dot(b)/(b.length()));
  }
  reverse(){//注意会改变原向量！
    this.x=-this.x;
    this.y=-this.y;
    this.z=-this.z;
    return this;
  }
  static merge(a,b,a1,b1){
    return new Vec3(a.x*a1 + b.x*b1, a.y*a1 + b.y*b1, a.z*a1 + b.z*b1);
  }
}

function vec3(a, b, c) {
  if (arguments.length == 3) return new Vec3(a, b, c);
  else if (arguments.length == 1) return new Vec3(a.x, a.y, a.z);
  else if (arguments.length == 0) return new Vec3(0, 0, 0);
}
function array3d(x, y, z) {
  let p = [];
  for (let i = 0; i < x; i++) {
    p.push([]);
    for (let j = 0; j < y*z; j++) {
      p[i].push(0);
    }
  }
  return p;
}
var buf = new ArrayBuffer(4),f32=new Float32Array(buf),u32=new Uint32Array(buf);
 function fsqrt(x){
   f32[0] = x;
   u32[0]=0x1fc00000+((u32[0])>>1);//指数/2
   let y=f32[0];
   y=(y+x/y)*0.5;
   y=(y+x/y)*0.5;
   y=(y+x/y)*0.5;
   return y;
 }
var seed2=Math.SQRT2;
function frand(){
  seed2=fraction(seed2*9973);
  return seed2;
}
function fraction(a){
  return a-~~a;
}
function mat4multiply(b,a){//为什么是反的
  let temp=new Float32Array(16);
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      temp[i*4+j]=a[i*4]*b[j]+a[i*4+1]*b[j+4]+a[i*4+2]*b[j+8]+a[i*4+3]*b[j+12];
    }
  }
  return temp;
}
let vec={
  add:function(a,b){
    let temp=new Array(a.length)
    for(let i=0;i<a.length;i++){
      temp[i]=a[i]+b[i]
    }
    return temp;
  },
  dot:function(a,b){
    let temp=0
    for(let i=0;i<a.length;i++){
      temp+=a[i]*b[i]
    }
    return temp;
  },
  multiply:function(a,b){
    let temp=new Array(a.length)
    for(let i=0;i<a.length;i++){
      temp[i]=a[i]*b[i]
    }
    return temp;
  },
  multiplynum:function(a,b){
    let temp=new Array(a.length)
    for(let i=0;i<a.length;i++){
      temp[i]=a[i]*b
    }
    return temp;
  }
}
function difference(setA, setB) {
    let _difference = new Set(setA);
    for (let elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}
function findinarray(arr,a){
  for(let i=0;i<arr.length;i++){
    if(arr[i]===a)
      return true;
  }
  return false;
}
function averageof(arr){
  let sum=0;
  for(let i=0;i<arr.length;i++){
    sum+=arr[i];
  }
  return sum/arr.length;
}