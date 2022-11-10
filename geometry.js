class tri{
  constructor(p1,p2,p3,n1,n2,n3,materialid){
    this.a=p2.minus(p1);
    this.b=p3.minus(p1);
    this.temp=this.a.cross(this.b);
    this.p1=p1;
    this.p2=p2;
    this.p3=p3;
    this.center=(p1.add(p2).add(p3)).dividenum(3);
    this.maxpoint=new Vec3(max(p1.x,p2.x,p3.x),max(p1.y,p2.y,p3.y),max(p1.z,p2.z,p3.z));
    this.minpoint=new Vec3(min(p1.x,p2.x,p3.x),min(p1.y,p2.y,p3.y),min(p1.z,p2.z,p3.z));
    
    this.normal=this.b.cross(this.a).norm();//法线的正确方向
    this.materialid=materialid;
    if(n1!=null){
      this.n1=n1;
      this.n2=n2;
      this.n3=n3;
    }
    else{
      this.n1=this.normal;
      this.n2=this.normal;
      this.n3=this.normal;
    }
    
    this.array=[p1.x,p1.y,p1.z,this.n1.x,this.n1.y,this.n1.z,p2.x,p2.y,p2.z,this.n2.x,this.n2.y,this.n2.z,p3.x,p3.y,p3.z,this.n3.x,this.n3.y,this.n3.z,];
  }
  scale(num){
    let p1=this.p1.minus(this.center).scale(num).add(this.center);
    let p2=this.p2.minus(this.center).scale(num).add(this.center);
    let p3=this.p3.minus(this.center).scale(num).add(this.center);
    return new tri(p1,p2,p3);
  }
  rotate(a){
    let p1=vec3(cos(a),0,-sin(a)).scale(this.p1.x).add(vec3(sin(a),0,cos(a)).scale(this.p1.z)).add(vec3(0,this.p1.y,0));
    let p2=vec3(cos(a),0,-sin(a)).scale(this.p2.x).add(vec3(sin(a),0,cos(a)).scale(this.p2.z)).add(vec3(0,this.p2.y,0));
    let p3=vec3(cos(a),0,-sin(a)).scale(this.p3.x).add(vec3(sin(a),0,cos(a)).scale(this.p3.z)).add(vec3(0,this.p3.y,0));

    return new tri(p1,p2,p3);
  }
  distance(a){
    return new tri(this.p1.scale(a),this.p2.scale(a),this.p3.scale(a));
  }
}