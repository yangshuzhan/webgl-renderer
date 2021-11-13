class Vec3 {
  constructor(a, b, c) {
    this.x = a;
    this.y = b;
    this.z = c;
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }
  add(b) {
    return new Vec3(this.x + b.x, this.y + b.y, this.z + b.z);
  }
  minus(n) {
    return new Vec3(this.x - n.x, this.y - n.y, this.z - n.z);
  }
  multiply(n) {
    return new Vec3(this.x * n.x, this.y * n.y, this.z * n.z);
  }
  divide(n) {
    return new Vec3(this.x / n.x, this.y / n.y, this.z / n.z);
  }
  scale(n) {
    return new Vec3(this.x * n, this.y * n, this.z * n);
  }
  dividenum(n) {
    return new Vec3(this.x / n, this.y / n, this.z / n);
  }
  dot(n) {
    return this.x * n.x + this.y * n.y + this.z * n.z;
  }
  norm() {
    let l = this.length();
    this.x /= l;
    this.y /= l;
    this.z /= l;
    return this;
  }
  cross(b) {
    return new Vec3(
      this.y * b.z - this.z * b.y,
      this.z * b.x - this.x * b.z,
      this.x * b.y - this.y * b.x
    );
  }
  dis(b) {
    return this.minus(b).length();
  }
  proj(b){
    return b.scale(this.dot(b)/(b.dot(b)));
  }
}
function vec3(a, b, c) {
  if (arguments.length == 3) return new Vec3(a, b, c);
  else if (arguments.length == 1) return new Vec3(a.x, a.y, a.z);
  else if (arguments.length == 0) return new Vec3(0, 0, 0);
}
function array3d(x, y, z) {
  let p = new Array(x);
  for (let i = 0; i < x; i++) {
    p[i] = new Array(y);
    for (let j = 0; j < y; j++) {
      p[i][j] = new Array(z);
      for (let k = 0; k < z; k++) {
        p[i][j][k] = [];
      }
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

function* halton(k){
let n=k,step=1/k,arr=[0],num=0;
  while(true){
    for(let i=0;k*i<n;i++){
      let temp=arr[i]+step;
      arr.push(temp);
      yield temp;
    }
    step+=step;
    if(step>=k/n){
      n*=k;
      step=1/n;
    }
    num=0;
  }
} 