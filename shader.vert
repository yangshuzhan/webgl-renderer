precision highp float;
attribute vec3 aPosition;
attribute vec3 aNormal;
varying vec3 normal;
varying vec3 position;

uniform mat4 cmatrix,pmatrix;

void main() {
  normal=aNormal;
  position=aPosition;
  //gl_Position = aPosition*0.1+vec4(x,y,z,0)*0.01+vec4(0.0,0.0,0.0,0.3);
  //gl_Position=pmatrix*aPosition+vec4(x,y,z,350.0);
  gl_Position=pmatrix*cmatrix*vec4(aPosition.x,-aPosition.y,aPosition.z,1.0);
  
}