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
  gl_Position=vec4(position.x,-position.y,position.z,.5);
  
}