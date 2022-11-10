'use strict';
class Grid {
  constructor(model,res) {
    let length = model.vertices.length;
    this.maxpoint = new Vec3(-9999999999, -9999999999, -9999999999);
    this.minpoint = new Vec3(9999999999, 9999999999, 9999999999);
    //console.log("共有这么多点", length);
    for (let i = 0; i < length; i++) {
      let p = model.vertices[i];
      if (p.x > this.maxpoint.x) {
        this.maxpoint.x = p.x;
      }
      if (p.y > this.maxpoint.y) {
        this.maxpoint.y = p.y;
      }
      if (p.z > this.maxpoint.z) {
        this.maxpoint.z = p.z;
      }
      if (p.x < this.minpoint.x) {
        this.minpoint.x = p.x;
      }
      if (p.y < this.minpoint.y) {
        this.minpoint.y = p.y;
      }
      if (p.z < this.minpoint.z) {
        this.minpoint.z = p.z;
      }
    }
    this.maxpoint.addto(new Vec3(0.1,0.1,0.1));
    this.center = this.minpoint.add(this.maxpoint).dividenum(2);
    this.radius = this.center.dis(this.maxpoint);
    if(res==null){
      this.res=Math.ceil(Math.pow(model.vertices.length/3,0.4));
    }//自动计算栅格数
    else{
      this.res = res;
    }
    this.xres = this.res;
    //console.log(this.res)
    this.width = (this.maxpoint.x - this.minpoint.x) / this.res;//以x为标准的单位格子宽度
    this.yres = Math.ceil((this.maxpoint.y - this.minpoint.y) / this.width);
    this.zres = Math.ceil((this.maxpoint.z - this.minpoint.z) / this.width); 
    //为了保证格子是正方体，根据width大小设置包围盒
    this.maxpoint.y=this.width*this.yres+this.minpoint.y;
    this.maxpoint.z=this.width*this.zres+this.minpoint.z;
    //然后再计算包围盒的长宽高
    this.xwidth=this.maxpoint.x - this.minpoint.x;
    this.ywidth=this.maxpoint.y - this.minpoint.y;
    this.zwidth=this.maxpoint.z - this.minpoint.z;
    //cache=new Uint8Array(this.xres+this.yres+this.zres);
    //console.log('grid res',this.xres,this.yres,this.zres)
    this.cell = array3d(this.xres, this.yres , this.zres ); //三维数组用来存储三角形
    //创建triangle数组
    this.triangles = new Array(model.vertices.length/3);
    let xres=this.xres,yres=this.yres,zres=this.zres,cell=this.cell;
    for (let i = 0; i < model.vertices.length; i+=3) {
      this.triangles[i/3] = new tri(model.vertices[i],model.vertices[i+1],model.vertices[i+2],model.normals[i],model.normals[i+1],model.normals[i+2],model.materialid[i]);
      let maxcell = this.getcell(this.triangles[i/3].maxpoint); //把三角形的包围盒放进格子
      let mincell = this.getcell(this.triangles[i/3].minpoint);
      //console.log(maxcell);
      for (let j = mincell[0]; j <= maxcell[0]; j++) {
        for (let k = mincell[1]; k <= maxcell[1]; k++) {
          for (let l = mincell[2]; l <= maxcell[2]; l++) {
            if(this.cell[j][k+l*this.yres]===0)
              this.cell[j][k+l*this.yres]=[];
            this.cell[j][k+l*this.yres].push(this.triangles[i/3]);
          }
        }
      }
    } //初始化三角形
    let changed=1,iteration=0;
      while(changed>0){
        changed=0;
        for(let i=0;i<xres;i++){
          for(let j=0;j<yres;j++){
            for(let k=0;k<zres;k++){
              let temp=cell[i][j+k*yres];
              if(temp>=iteration&&judge(i+1,j,k,temp)&&judge(i-1,j,k,temp)&&judge(i,j+1,k,temp)&&judge(i,j-1,k,temp)&&judge(i,j,k+1,temp)&&judge(i,j,k-1,temp)){
                cell[i][j+k*yres]++;
                changed++
              }
                
            }
          }
      }
        iteration++;
    }
    
    function judge(x,y,z,temp){
      if(x<0||x>=xres||y<0||y>=yres||z<0||z>=zres)
        return true
      else return(cell[x][y+z*yres]>=temp)
    }
  return this
  }
  getcell(position) {
    let x = Math.floor((position.x - this.minpoint.x)*this.xres/this.xwidth);
    let y = Math.floor((position.y - this.minpoint.y)*this.yres/this.ywidth);
    let z = Math.floor((position.z - this.minpoint.z)*this.zres/this.zwidth);

    // cell.x = Math.floor((position.x - this.minpoint.x) /((this.maxpoint.x - this.minpoint.x) / this.xres));
    // cell.y = Math.floor((position.y - this.minpoint.y) /((this.maxpoint.y - this.minpoint.y) / this.yres));
    // cell.z = Math.floor((position.z - this.minpoint.z) /((this.maxpoint.z - this.minpoint.z) / this.zres));
    
    //防止有点落在盒子边上从而数组越界
    if(x===this.xres)
      x--;
    else if(x===-1)
      x++;
    if(y===this.yres)
      y--;
    else if(y===-1)
      y++
    if(z===this.zres)
      z--;
    else if(z===-1)
      z++;
    return [x,y,z];
  }
}
let cache=new Uint8Array(51);
let num1=0,num2=0
function tracegrid(origin, raydir, grid) {
  let o;
  if (
    origin.x <= grid.maxpoint.x &&origin.x >= grid.minpoint.x &&
    origin.y <= grid.maxpoint.y &&origin.y >= grid.minpoint.y &&
    origin.z <= grid.maxpoint.z &&origin.z >= grid.minpoint.z) {
    //console.log("在格子里");
    o=origin;
  }
  else{
    o = rayboxintersect(origin, raydir, grid.minpoint, grid.maxpoint);
    if (o === false) {
    //console.log('不与盒子相交')
    return false;
  }
  }

  let o2 = o.minus(grid.minpoint);//o2相对于grid的坐标
  // let index = grid.getcell(o);
  // let inx=index.x,iny=index.y,inz=index.z;
  let [inx,iny,inz]=grid.getcell(o);
  let rx=raydir.x,ry=raydir.y,rz=raydir.z;
  let tx, ty, tz;
  let width=grid.width;
  if(rx>0)
  tx = ((inx+1)*width - o2.x) / rx; //o表示什么
  else if(rx<0)
    tx = ((inx)*width - o2.x) / rx;
  else
    tx=Infinity;
  if(ry>0)
  ty = ((iny+1)*width - o2.y) / ry;
  else if(ry<0)
  ty = ((iny)*width - o2.y) / ry;
  else
    ty=Infinity;
    if(rz>0)
  tz = ((inz+1)*width - o2.z) / rz;
  else if(rz<0)
  tz = ((inz)*width - o2.z) / rz;
  else//rz为0的时候
    tz=Infinity;
  
  let dtx = width / Math.abs(rx);
  let dty = width / Math.abs(ry);
  let dtz = width / Math.abs(rz);
  
  //rx,ry,rz改成每步加的步长
  rx=Math.sign(rx),ry=Math.sign(ry),rz=Math.sign(rz);
  //let index=vec3();
  let closest=[],mindistance=Infinity,yres=grid.yres,cell=grid.cell,intesectionlist=[];//把变量定义在while循环外面
  let length;
  while (
    iny >= 0 && iny < yres &&
    inx >= 0 && inx < grid.xres &&
    inz >= 0 && inz < grid.zres) {
    let miss=true;
      let arr = cell[inx][inz*yres+iny];//获取格子中的所有三角形
      length=arr.length;
      if(length){
        for (let i = 0; i < length; i++){
          let temp=arr[i];
          if(findinarray(intesectionlist,temp)){//如果上一次相交过就不再相交
            miss=false;
            continue;
          }
          let result = intersect(origin, raydir, temp);
            if (result){//相交的话
              miss=false;
              intesectionlist.push(temp);
              let tempdistance=result[0];
              if(tempdistance<mindistance){
                closest=result;
                mindistance=tempdistance;
              }
            }
        }
        length=0;
      }
    else length=arr;
    
      if(mindistance<Infinity&&miss)
          return closest;

    for(;length>=0;length--){
    if (tx <= ty ) {
      if(tx <= tz){
        tx+=dtx; 
        inx+=rx;
      }
      else{
        tz+=dtz;
        inz+=rz;
      }
    } 
      else if(ty<=tz){
        ty+=dty;
        iny+=ry;
      }
      else{
        tz+=dtz;
        inz+=rz;
      }
  }
  }
  if(closest.length===5)
        return closest;
  else
  return false;
}

