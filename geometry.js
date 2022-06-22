class tri{
  constructor(p1,p2,p3,n1,n2,n3){
    this.p1=p1;
    this.p2=p2;
    this.p3=p3;
    this.a=p2.minus(p1);
    this.b=p3.minus(p1);
    this.temp=this.a.cross(this.b);
    this.center=(p1.add(p2).add(p3)).dividenum(3);
    this.maxpoint=vec3(max(p1.x,p2.x,p3.x),max(p1.y,p2.y,p3.y),max(p1.z,p2.z,p3.z));
    this.minpoint=vec3(min(p1.x,p2.x,p3.x),min(p1.y,p2.y,p3.y),min(p1.z,p2.z,p3.z));
    if(n1!=null)
      this.normal=vec3(n1,n2,n3)
    else
      this.normal=this.b.cross(this.a).norm();//法线的正确方向
    this.array=[p1.x,p1.y,p1.z,this.normal.x,this.normal.y,this.normal.z,p2.x,p2.y,p2.z,this.normal.x,this.normal.y,this.normal.z,p3.x,p3.y,p3.z,this.normal.x,this.normal.y,this.normal.z,];
  }
  scale(num){
    let p1=this.p1.minus(this.center).scale(num).add(this.center);
    let p2=this.p2.minus(this.center).scale(num).add(this.center);
    let p3=this.p3.minus(this.center).scale(num).add(this.center);
    return new tri(p1,p2,p3);
  }
}