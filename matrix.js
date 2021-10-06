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
