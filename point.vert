attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aColor;
uniform mat4 projcameramatrix;
varying vec3 position;
varying vec3 normal;
varying vec3 color;
void main(){
  gl_PointSize=1.0;
  normal=aNormal;
  position=aPosition;
  color=aColor;
  gl_Position=projcameramatrix*vec4(aPosition,1.0);
}