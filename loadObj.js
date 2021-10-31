function loadObj(string, resize) {
  let points = [],
    faces = [],
    vn = [],
  array = [];
  let line = [];
  let maxpoint = new Vec3(-999999999, -999999999, -999999999);
  let minpoint = new Vec3(999999999, 999999999, 999999999);
  for (let i = 0; i < string.length; i++) {
    line += string[i];
    if (string[i] == "\n") {
      splitline(line);
      line = []; //清空一行
    }
  }

  function splitline(line) {
    if (line[0] == "v" && line[1] == " ") {
      //如果是点
      let arr = line.split(" ");
      let temp = vec3(Number(arr[1]), -arr[2], Number(arr[3]));
      points.push(temp);
      if (temp.x > maxpoint.x) maxpoint.x = temp.x;
      if (temp.y > maxpoint.y) maxpoint.y = temp.y;
      if (temp.z > maxpoint.z) maxpoint.z = temp.z;
      if (temp.x < minpoint.x) minpoint.x = temp.x;
      if (temp.y < minpoint.y) minpoint.y = temp.y;
      if (temp.z < minpoint.z) minpoint.z = temp.z;
    }else if(line[0] == "v" && line[1] == "n") {
      let arr = line.split(" ");
      vn.push(vec3(Number(arr[1]),-arr[2],Number(arr[3])));
    }
    else if (line[0] == "f" && line[1] == " ") {
      let arr = line.split(/( |\/)/);
      let a, b, c,d,e,f,g,h; //abce用来存放面所对应的点的坐标,efgh法线
      let normal1,normal2,normal3,normal4;
      if (arr.length > 7) {
        //f除了点坐标还包括法线信息
        a = Number(arr[2]) - 1;
        b = Number(arr[8]) - 1;
        c = Number(arr[14]) - 1;
        
        e=Number(arr[6]) - 1;
        f=Number(arr[12]) - 1;
        g=Number(arr[18]) - 1;
        normal1=vn[e];
        normal2=vn[f];
        normal3=vn[g];
        
      } else {
        a = Number(arr[2]) - 1;
        b = Number(arr[4]) - 1;
        c = Number(arr[6]) - 1;
        normal1 = (points[c].minus(points[a])).cross(points[b].minus(points[a]));
        normal1.norm();
        normal2=normal1;
        normal3=normal1;
        normal4=normal1;
      }

      faces.push(vec3(a, b, c));
      
      
      array.push(points[a].x, points[a].y, points[a].z);
      array.push(normal1.x, normal1.y, normal1.z);
      array.push(points[b].x, points[b].y, points[b].z);
      array.push(normal2.x, normal2.y, normal2.z);
      array.push(points[c].x, points[c].y, points[c].z);
      array.push(normal3.x, normal3.y, normal3.z);
      if (arr[20] != null) {
        //四边形
        d = Number(arr[20]) - 1;
        h= Number(arr[24]) - 1;
        normal4=vn[h];
        faces.push(vec3(b, c, d));
        array.push(points[a].x, points[a].y, points[a].z);
        array.push(normal1.x, normal1.y, normal1.z);
        array.push(points[c].x, points[c].y, points[c].z);
        array.push(normal3.x, normal3.y, normal3.z);
        array.push(points[d].x, points[d].y, points[d].z);
        array.push(normal4.x, normal4.y, normal4.z);
      }
    } else if (line[0] == "o" && line[1] == " ") {
    }
  }

  if (resize == true) {
    //点统计完了缩放坐标
    let scale = 300 / maxpoint.dis(minpoint);
    for (let i = 0; i < array.length; i += 6) {
      for(let j=0;j<3;j++){
        array[i+j]*=scale;
      }
    }
  }
  return array;
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
