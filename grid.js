class tri {
  constructor(point1, point2, point3, normal) {
    this.p1 = vec3(point1); //vec3向量
    this.p2 = vec3(point2);
    this.p3 = vec3(point3);

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
}
class grid {
  constructor(model,res) {
    //计算包围盒
    
    let length = model.vertices.length;
    this.maxpoint = new vec3(-9999999999, -9999999999, -9999999999);
    this.minpoint = new vec3(9999999999, 9999999999, 9999999999);
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
    this.maxpoint=this.maxpoint.add(vec3(0.1,0.1,0.1));
    this.center = this.minpoint.add(this.maxpoint).dividenum(2);
    this.radius = this.center.dis(this.maxpoint);
    if(res==null){
      this.res=Math.ceil(Math.pow(model.faces.length,0.33333333)*0.3);
    }//自动计算栅格数
    else{
      this.res = res;
    }
    
    this.xres = this.res;
    this.width = (this.maxpoint.x - this.minpoint.x) / this.res;
    this.yres = ceil((this.maxpoint.y - this.minpoint.y) / this.width);
    this.zres = ceil((this.maxpoint.z - this.minpoint.z) / this.width); 
    console.log('格子',this.xres,this.yres,this.zres)
    this.cell = array3d(this.xres, this.yres , this.zres ); //三维数组用来存储三角形
    //创建triangle数组
    this.triangles = new Array(model.faces.length);
    for (let i = 0; i < this.triangles.length; i++) {
      this.triangles[i] = new tri(
        model.vertices[model.faces[i][0]],
        model.vertices[model.faces[i][1]],
        model.vertices[model.faces[i][2]]
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

    //console.log("cell", this.cell);
  }
  getcell(position) {
    let cell = vec3();
    cell.x = floor(
      (position.x - this.minpoint.x) /
        ((this.maxpoint.x - this.minpoint.x) / this.xres)
    );
    cell.y = floor(
      (position.y - this.minpoint.y) /
        ((this.maxpoint.y - this.minpoint.y) / this.yres)
    );
    cell.z = floor(
      (position.z - this.minpoint.z) /
        ((this.maxpoint.z - this.minpoint.z) / this.zres)
    );
    
    //防止有点落在盒子边上从而数组越界
    if(cell.x==this.xres)
      cell.x--;
    if(cell.y==this.yres)
      cell.y--;
    if(cell.z==this.zres)
      cell.z--;
    //console.log(cell)
    return cell;
  }
}

function tracegrid(origin, raydir, grid) {
  if (
    origin.x < grid.maxpoint.x &&
    origin.y < grid.maxpoint.y &&
    origin.z < grid.maxpoint.z &&
    origin.x > grid.minpoint.x &&
    origin.y > grid.minpoint.y &&
    origin.z > grid.minpoint.z
  ) {
    console.log("在格子里");
    
  }
  let o = rayboxintersect(origin, raydir, grid.minpoint, grid.maxpoint);
  if (o == false) {
    //console.log('不与盒子相交')
    return false;
  }
  else if(o==true){
    o=origin;
  }
//方向怎么不对
  let o2 = o.minus(grid.minpoint);//o2相对于grid的坐标
  let tx, ty, tz, dtx, dty, dtz, t;
  tx = (grid.width - o2.x) / raydir.x; //o表示什么
  ty = (grid.width - o2.y) / raydir.y;
  tz = (grid.width - o2.z) / raydir.z;
  dtx = grid.width / abs(raydir.x);
  dty = grid.width / abs(raydir.y);
  dtz = grid.width / abs(raydir.z);
  let index = grid.getcell(o);
  
  //let index=vec3();
  while (
    index.x >= 0 &&
    index.y >= 0 &&
    index.z >= 0 &&
    index.x < grid.xres &&
    index.y < grid.yres &&
    index.z < grid.zres
  ) {
    let arr = grid.cell[index.x][index.y][index.z];
    if (arr.length != 0) {
      let closest=vec3(0,999999999999,0);
      for (let i = 0; i < arr.length; i++) {
        
        let temp = intersect(origin, raydir, grid.triangles[arr[i]]);
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
