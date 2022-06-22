function torgb(str) {
  let a = parseInt(str[1] + str[2], 16);
  let b = parseInt(str[3] + str[4], 16);
  let c = parseInt(str[5] + str[6], 16);
  return [a / 255, b / 255, c / 255];
}
function createnoise(n) {
  
  let img = new Float32Array(n * n * 3);
  let last=[];
  let num=n*n*3;
  for (let i = 0; i <num; i += 1) {
    img[i] = Math.random();
     // img[i+1]=(Math.random()>0.5);
     // img[i+2]=7*(Math.random()>0.5);
     
      //img[i+1]=img[i];
      //img[i+2]=img[i];
  }
  let t=1/100;
  let width3=3*width
  for(let i=0;i<100;i++){
  for(let index=0;index<num;index++){//减小噪点的差异性
    let error=0;
    let matrix=[1,-1,width,-width,1+width,width-1,1-width,-1-width,-2,2,2*width,-2*width,-1-2*width,1-2*width,-1+2*width,1+2*width,-2+width,-2-width,2+width,2-width]
  let weight=[1,1,1,1,0.5,0.5,0.5,0.5,0.3,0.3,0.3,0.3,0.2,0.2,0.2,0.2,0.2,0.2,0.2,0.2]
    for(let j=0;j<matrix.length;j++){
      let temp=index+matrix[j]*3;
      let x=temp%width3;
      if(temp>=num)
        temp+=-num-width3+x+x;//超出数组边界的点变换回来
      else if(temp<0)
        temp+=num-width3+x+x;
      error+=Math.abs(img[index]-img[temp])*weight[j];
    }
    if(error<2-t*i)
      img[index]=1-img[index];
  }
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
  let n = 20;
  let buffer = new Float32Array(img.width * img.height * 3);
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let temp = img.get(x, y);
      let p = (x + img.width * y) * 3;
      buffer[p] = exp(temp[0] / 255) - 1;
      buffer[p + 1] = exp(temp[1] / 255) - 1;
      buffer[p + 2] = exp(temp[2] / 255) - 1;
    }
  }

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
