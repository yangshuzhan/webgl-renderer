precision highp float;
attribute vec3 aPosition;
attribute vec3 aNormal;
varying vec3 normal;
varying vec3 position;
varying vec4 screenposition;
uniform mat4 cmatrix,pmatrix;
void main() {
  normal=aNormal;
  position=aPosition;
  screenposition=pmatrix*cmatrix*vec4(aPosition.x,-aPosition.y,aPosition.z,1.0);
  gl_Position=screenposition;
  
}