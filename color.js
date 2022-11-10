function normcolor(color){
  let temp=3/(color[0]+color[1]+color[2]);
  if(temp>1)
    return color
  else{
    color[0]*=temp;
    color[1]*=temp;
    color[2]*=temp;
  return color;
  }
}
function doublecolor(color){
  let temp=(color[0]+color[1]+color[2])/3;
  color[0]*=temp*temp;
    color[1]*=temp*temp;
    color[2]*=temp*temp;
  return color;
}
function torgb(str) {
  let a = parseInt(str[1] + str[2], 16);
  let b = parseInt(str[3] + str[4], 16);
  let c = parseInt(str[5] + str[6], 16);
  return [a / 255, b / 255, c / 255];
}

function rgbToHex(arr) {
  return "#" + componentToHex(arr[0]) + componentToHex(arr[1]) + componentToHex(arr[2]);
  
  function componentToHex(c) {
    c=Math.floor(c*255)
  let hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

}
function createnoise(n) {
  
  let img = new Float32Array(n * n * 3);
  let last=[];
  let num=n*n*3;
  for (let i = 0; i <num; i += 1) {
    img[i] = Math.random();
  }
  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);//linear采样有问题
  // Upload the image into the texture.
  //gl.texImage2D(gl.TEXTURE_2D,0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE,img);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, n, n, 0, gl.RGB, gl.FLOAT, img);
  return img;
  function toarray(x,y){
    return (y*n+x)*3;
  }
  function toxy(i){
    let x=floor(i/3)%n;
    let y=floor(i/3);
    return [x,y]
  }
}
let ambientcolor;
function createworld(img) {
  //console.log(img)
  var texture = gl.createTexture();
  gl.activeTexture(gl.TEXTURE2);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  //gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB, gl.RGB, gl.UNSIGNED_BYTE,img.canvas);
  let r = 0,
    g = 0,
    b = 0;
  for (let i = 0; i < 20; i++) {
    let temp = img.get(Math.random() * img.width, Math.random() * img.height);
    r += temp[0];
    g += temp[1];
    b += temp[2];
  }
  r = r / 20 / 3;
  g = g / 20 / 3;
  b = b / 20 / 3;
  ambientcolor = color(r, g, b);
  gl.clearColor(...ambientcolor._array);
  time = 1;
  loop();

  let buffer = new Float32Array(img.width * img.height * 3);
  
  img.loadPixels()
  let p=img.pixels;
  for(let i=0,j=0;i<p.length;i+=4,j+=3){
    buffer[j] = exp(p[i] / 255) - 1;
    buffer[j + 1] = exp(p[i+1] / 255) - 1;
    buffer[j + 2] = exp(p[i+2] / 255) - 1;
  }
  // for (let y = 0; y < img.height; y++) {
  //   for (let x = 0; x < img.width; x++) {
  //     let temp = img.get(x, y);
  //     let p = (x + img.width * y) * 3;
  //     buffer[p] = exp(temp[0] / 255) - 1;
  //     buffer[p + 1] = exp(temp[1] / 255) - 1;
  //     buffer[p + 2] = exp(temp[2] / 255) - 1;
  //   }
  // }

  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGB,
    img.width,
    img.height,
    0,
    gl.RGB,
    gl.FLOAT,
    buffer
  );
/*
  creatediffuse();
  function creatediffuse() {
    let buffer2 = new Float32Array(buffer.length);
    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        let p = (x + img.width * y) * 3;
        let normal = spheretonormal(x / img.width, y / img.height);
        let rx = Math.random() * TWO_PI,
          ry = Math.random() * 2 - 1;
        let r = sqrt(1 - ry * ry);
        let randnormal = [
          normal[0] + sin(rx) * r,
          normal[1] + cos(rx) * r,
          normal[2] + ry,
        ];
        let l=sqrt(randnormal[0]*randnormal[0]+randnormal[1]*randnormal[1]+randnormal[2]*randnormal[2]);
        randnormal=[randnormal[0]/l,randnormal[1]/l,randnormal[2]/l]
        randnormal=normal;
        let temp = normaltosphere(...randnormal);
        let temp2 = [temp[0] * img.width, temp[1] * img.height];
        let p2 = (temp2[0] + img.width * temp2[1]) * 3;
        buffer2[p] = buffer[p2];
        buffer2[p + 1] = buffer[p2+1];
        buffer2[p + 2] = buffer[p2+2];
      }
    }
  let texture2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE3);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,img.width,img.height,0,gl.RGB,gl.FLOAT,buffer2);
  }
  console.log(spheretonormal(...normaltosphere(1,0,0)))*/
  
  return img;
}
function normaltosphere(x, y, z) {
  let a;
  if (z > 0) {
    a = atan(x / z);
  } else {
    a = atan(x / z)+PI;
  }

  let b = asin(y) ;
  return [a, b];
}
function spheretonormal(a, b) {
  let x, y, z;
  x = cos(a ) * cos(b );
  y = sin(b );
  z = sin(a ) * cos(b );
  return [x, y, z];
}
