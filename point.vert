attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
uniform mat4 biasedprojcameramatrix;
varying vec3 position;
varying vec3 normal;
void main(){
  normal=aNormal;
  position=aPosition;
  //gl_PointSize=1.5;
  gl_Position=biasedprojcameramatrix*vec4(aPosition,1.0);
}