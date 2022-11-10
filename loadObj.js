let materialtable=[['default',[0.75,0.75,0.75],1]];//名称，漫反射颜色，不透明度
class models{
  constructor(){
    this.arr=[];
    this.faces=[];
    this.vertices=[];
    this.normals=[];
    this.materialid=[];
  }
}
function loadObj(string, resize) {
  let points = [],
    faces = [],
    vn = [],
  array = [];
  let mod=new models();
  let materialcount=0;
  let line = [];
  let maxpoint = new Vec3(-Infinity, -Infinity, -Infinity);
  let minpoint = new Vec3(Infinity, Infinity, Infinity);
  let lines=string.split('\n');
  for (let i = 0; i < lines.length; i++) {
      splitline(lines[i]);
  }
  function splitline(line) {
    if(line[0] == "u" && line[1] == "s"){//材质信息是标注到面
      let arr = line.split(" ");
      //console.log(arr)
      let result=false;
      for(let i=0;i<materialtable.length;i++){
        if(materialtable[i][0]==arr[1]){
          result=true;
          materialcount=i;
          break;
        }
      }
      if(result==false){
        
        materialtable.push([arr[1],[Math.random(),Math.random(),Math.random()],1]);
        materialcount=materialtable.length-1;
      }
    }
    else if (line[0] == "v" && line[1] == " ") {
      //如果是点
      let arr = line.split(" ");
      let temp = new Vec3(Math.fround(arr[1]), -Math.fround(arr[2]), Math.fround(arr[3]));
      points.push(temp);
      if (temp.x > maxpoint.x) maxpoint.x = temp.x;
      if (temp.y > maxpoint.y) maxpoint.y = temp.y;
      if (temp.z > maxpoint.z) maxpoint.z = temp.z;
      if (temp.x < minpoint.x) minpoint.x = temp.x;
      if (temp.y < minpoint.y) minpoint.y = temp.y;
      if (temp.z < minpoint.z) minpoint.z = temp.z;
    }else if(line[0] == "v" && line[1] == "n") {
      let arr = line.split(" ");
      vn.push(new Vec3(Math.fround(arr[1]),-Math.fround(arr[2]),Math.fround(arr[3])));
    }
    else if (line[0] == "f" && line[1] == " ") {
      let arr = line.split(/( |\/)/);
      let a, b, c,d,e,f,g,h; //abce用来存放面所对应的点的坐标,efgh法线
      let normal1,normal2,normal3,normal4;
      if (arr.length > 7) {
        //f除了点坐标还包括法线信息
        a = Math.fround(arr[2]) - 1;
        b = Math.fround(arr[8]) - 1;
        c = Math.fround(arr[14]) - 1;
        
        e=Math.fround(arr[6]) - 1;
        f=Math.fround(arr[12]) - 1;
        g=Math.fround(arr[18]) - 1;
        normal1=vn[e];
        normal2=vn[f];
        normal3=vn[g];
        
      } else {
        a = Math.fround(arr[2]) - 1;
        b = Math.fround(arr[4]) - 1;
        c = Math.fround(arr[6]) - 1;
        normal1 = (points[c].minus(points[a])).cross(points[b].minus(points[a]));
        normal1.norm();
        normal2=normal1;
        normal3=normal1;
        normal4=normal1;
      }

      faces.push(new Vec3(a, b, c));
      mod.materialid.push(materialcount,materialcount,materialcount);
      
      array.push(points[a].x, points[a].y, points[a].z);
      array.push(normal1.x, normal1.y, normal1.z);
      array.push(points[b].x, points[b].y, points[b].z);
      array.push(normal2.x, normal2.y, normal2.z);
      array.push(points[c].x, points[c].y, points[c].z);
      array.push(normal3.x, normal3.y, normal3.z);
      if (arr[20] != null) {
        //四边形
        d = Math.fround(arr[20]) - 1;
        h= Math.fround(arr[24]) - 1;
        normal4=vn[h];
        faces.push(new Vec3(b, c, d));
        array.push(points[a].x, points[a].y, points[a].z);
        array.push(normal1.x, normal1.y, normal1.z);
        array.push(points[c].x, points[c].y, points[c].z);
        array.push(normal3.x, normal3.y, normal3.z);
        array.push(points[d].x, points[d].y, points[d].z);
        array.push(normal4.x, normal4.y, normal4.z);
        mod.materialid.push(materialcount,materialcount,materialcount);
      }
    } else if (line[0] == "o" && line[1] == " ") {
    }
  }
  if (resize == true) {
    //点统计完了缩放坐标
    let center=maxpoint.add(minpoint).scale(0.5);
    let scale = 300 / maxpoint.dis(minpoint);
    for (let i = 0; i < array.length; i += 6) {
        array[i]=(array[i]-center.x)*scale;
        array[i+1]=(array[i+1]-center.y)*scale;
        array[i+2]=(array[i+2]-center.z)*scale;
    }
  }
  //array的结构为 x,y,z,normalx,normaly,normalz;
  //把数据放进模型类里;
  
  mod.arr=array;
  for(let i=0;i<array.length;i+=18){//加18 是因为顶点之间插了法线数据
    mod.vertices.push(new Vec3(array[i],array[i+1],array[i+2]));
    mod.normals.push(new Vec3(array[i+3],array[i+4],array[i+5]));
    mod.vertices.push(new Vec3(array[i+6],array[i+7],array[i+8]));
    mod.normals.push(new Vec3(array[i+9],array[i+10],array[i+11]));
    mod.vertices.push(new Vec3(array[i+12],array[i+13],array[i+14]));
    mod.normals.push(new Vec3(array[i+15],array[i+16],array[i+17]));
  }
  
  grid=new Grid(mod);
  arr=depthofvert(mod,grid);
  //arr=mod.arr;
  //print(materialtable,materialcount)
  return mod;
}
function depthofvert(mod,grid){//计算模型各点的厚度
  let depths=[],temparr=[];
  for(let i=0;i<mod.vertices.length;i++){
    //console.log(i)
    let result=tracegrid(mod.vertices[i],mod.normals[i].scale(-1),grid);
    if(result[0]>0)
      depths.push(result[0]);
    else
      depths.push(0);
  }
  
  for(let i=0;i<mod.vertices.length;i++){
    for(let j=0;j<6;j++)
      temparr.push(mod.arr[i*6+j]);
    temparr.push(depths[i]);
  }
  return temparr;
}
function getfromurl(url) {
  var request = new XMLHttpRequest();
  request.open("GET", url, false); // `false` makes the request synchronous
  request.send(null);
  return request.responseText;
}
function modeltoarray(m) {
  let array = new Array();
  for (let i = 0; i < m.faces.length; i++) {
    if (m.faces[i].length != 3) console.log("not a triangle");
    else {
      let p1 = m.faces[i][0],
        p2 = m.faces[i][1],
        p3 = m.faces[i][2];
      array.push(m.vertices[p1].x, -m.vertices[p1].y, m.vertices[p1].z);
      array.push(m.vertices[p2].x, -m.vertices[p2].y, m.vertices[p2].z);
      array.push(m.vertices[p3].x, -m.vertices[p3].y, m.vertices[p3].z);
    }
  }
  return array;
}
function loadmaterials(string){
  let materials=[],index=-1;
  let lines=string.split('\n');
  for (let i = 0; i < lines.length; i++) {
      splitline(lines[i]);
  }
  function splitline(line){
    if(line[0]==='n'){
      let arr=line.split(" ");
      materials.push([arr[1]]);
      index++;
    }
    else if(line[0]==='K'&&line[1]==='d'){//漫反射
      let arr=line.split(" ");
      materials[index].push([Math.fround(arr[1]),Math.fround(arr[2]),Math.fround(arr[3])])
    }
    else if(line[0]==='d'){
      let arr=line.split(" ");
      materials[index].push(Math.fround(arr[1]));
    }
  }
  //console.log(materials)
  for(let i=0;i<materials.length;i++){//更新材质库
    let result=false;
    for(let j=0;j<materialtable.length;j++){
      if(materialtable[j][0]==materials[i][0]){
          materialtable[j][1]=materials[i][1]
          result=true;
          break;
        }
    }
    if(result==false){
        materialtable.push(materials[i]);
      }
   }
  return materials;
}
