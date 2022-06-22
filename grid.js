/*class tri {
  constructor(point1, point2, point3, normal) {
    this.p1 = vec3(point1); //vec3向量
    this.p2 = vec3(point2);
    this.p3 = vec3(point3);
    this.ab=this.p2.minus(this.p1);
    this.ac=this.p3.minus(this.p1);
    this.temp=this.ab.cross(this.ac);
    this.maxpoint = vec3();
    this.minpoint = vec3();
    this.maxpoint.x = max([this.p1.x, this.p2.x, this.p3.x]);
    this.maxpoint.y = max([this.p1.y, this.p2.y, this.p3.y]);
    this.maxpoint.z = max([this.p1.z, this.p2.z, this.p3.z]);
    this.minpoint.x = min([this.p1.x, this.p2.x, this.p3.x]);
    this.minpoint.y = min([this.p1.y, this.p2.y, this.p3.y]);
    this.minpoint.z = min([this.p1.z, this.p2.z, this.p3.z]);

    this.center = this.maxpoint.add(this.minpoint).dividenum(2);
    //  console.log('center=',this.center)
    this.radius = this.center.dis(this.maxpoint);
    if (normal instanceof vec3) this.normal = normal;
    else {
      this.normal = this.p2.minus(this.p1).cross(this.p3.minus(this.p2)).norm();
    }
  }
}*/
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
    this.maxpoint=this.maxpoint.add(new Vec3(0.1,0.1,0.1));
    this.center = this.minpoint.add(this.maxpoint).dividenum(2);
    this.radius = this.center.dis(this.maxpoint);
    if(res==null){
      this.res=Math.ceil(Math.pow(model.faces.length,0.33333333)*0.3);
    }//自动计算栅格数
    else{
      this.res = res;
    }
    this.xres = this.res;
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
    
    console.log('grid res',this.xres,this.yres,this.zres)
    this.cell = array3d(this.xres, this.yres , this.zres ); //三维数组用来存储三角形
    //创建triangle数组
    this.triangles = new Array(model.faces.length);
    for (let i = 0; i < model.vertices.length; i+=3) {
      this.triangles[i] = new tri(
        model.vertices[i],
        model.vertices[i+1],
        model.vertices[i+2]
      );
      let maxcell = this.getcell(this.triangles[i].maxpoint); //把三角形的包围盒放进格子
      let mincell = this.getcell(this.triangles[i].minpoint);
      //console.log(maxcell);

      for (let j = mincell.x; j <= maxcell.x; j++) {
        for (let k = mincell.y; k <= maxcell.y; k++) {
          for (let l = mincell.z; l <= maxcell.z; l++) {
            this.cell[j][k][l].push(i);
            //console.log('放进格子')
          }
        }
      }
      //debugger;
    } //初始化三角形
    //console.log(this.cell);
  return this
    //console.log("cell", this.cell);
  }
  getcell(position) {
    let cell = new Vec3(0,0,0);
    cell.x = Math.floor((position.x - this.minpoint.x)*this.xres/this.xwidth);
    cell.y = Math.floor((position.y - this.minpoint.y)*this.yres /this.ywidth);
    cell.z = Math.floor((position.z - this.minpoint.z)*this.zres/this.zwidth);

    // cell.x = Math.floor((position.x - this.minpoint.x) /((this.maxpoint.x - this.minpoint.x) / this.xres));
    // cell.y = Math.floor((position.y - this.minpoint.y) /((this.maxpoint.y - this.minpoint.y) / this.yres));
    // cell.z = Math.floor((position.z - this.minpoint.z) /((this.maxpoint.z - this.minpoint.z) / this.zres));
    
    //防止有点落在盒子边上从而数组越界
    if(cell.x===this.xres)
      cell.x--;
    else if(cell.x===-1)
      cell.x++;
    if(cell.y===this.yres)
      cell.y--;
    else if(cell.y===-1)
      cell.y++
    if(cell.z===this.zres)
      cell.z--;
    else if(cell.z===-1)
      cell.z++;
    return cell;
  }
}

function tracegrid(origin, raydir, grid) {
  let o;
  if (
    origin.x <= grid.maxpoint.x &&
    origin.y <= grid.maxpoint.y &&
    origin.z <= grid.maxpoint.z &&
    origin.x >= grid.minpoint.x &&
    origin.y >= grid.minpoint.y &&
    origin.z >= grid.minpoint.z
  ) {
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
  let tx, ty, tz, dtx, dty, dtz, t;
  
  let index = grid.getcell(o);
  if(raydir.x>0)
  tx = ((index.x+1)*grid.width - o2.x) / raydir.x; //o表示什么
  else
    tx = ((index.x)*grid.width - o2.x) / raydir.x;
  if(raydir.y>0)
  ty = ((index.y+1)*grid.width - o2.y) / raydir.y;
  else
  ty = ((index.y)*grid.width - o2.y) / raydir.y;
    if(raydir.z>0)
  tz = ((index.z+1)*grid.width - o2.z) / raydir.z;
  else
  tz = ((index.z)*grid.width - o2.z) / raydir.z;
    
  dtx = grid.width / Math.abs(raydir.x);
  dty = grid.width / Math.abs(raydir.y);
  dtz = grid.width / Math.abs(raydir.z);
  
  
  //let index=vec3();
  let arr,closest=new Vec3(0,999999999999,0),temp,i;//把变量定义在while循环外面
  while (
    index.x >= 0 &&
    index.y >= 0 &&
    index.z >= 0 &&
    index.x < grid.xres &&
    index.y < grid.yres &&
    index.z < grid.zres
  ) {
    arr = grid.cell[index.x][index.y][index.z];//获取格子中的所有三角形
    if (arr.length != 0) {
      //closest=new Vec3(0,999999999999,0);
      for (i = 0; i < arr.length; i++) {
        
        temp = intersect(origin, raydir, grid.triangles[arr[i]]);
        if (temp != false&&temp.y<closest.y) {
          closest=temp;
        }
      }
      if(closest.y!=999999999999){
        return closest;
      }
    }
    if (tx < ty && tx < tz) {
      tx+=dtx;
      t = tx;
      
      if(raydir.x>0)
        index.x++;
      else
        index.x--;
    } else if (ty < tx && ty < tz) {
      ty+=dty;
      t = ty;
      
      if(raydir.y>0)
        index.y++;
      else
        index.y--;
    } else {
      tz+=dtz;
      t = tz;
      
      if(raydir.z>0)
        index.z++;
      else
        index.z--;
    }
  }
  return false;
}

