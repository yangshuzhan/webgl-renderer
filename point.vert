precision highp float;
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 cmatrix,pmatrix;
varying vec4 position;
varying vec3 normal;
void main() {
  gl_PointSize=5.0;
  normal=aNormal;
  position=pmatrix*cmatrix*vec4(aPosition.x,aPosition.y,aPosition.z,1.0);
  gl_Position=position;
}