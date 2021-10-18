precision highp float;
attribute vec3 aPosition;
attribute vec3 aNormal;
varying vec3 normal;
varying vec3 position;
varying vec4 screenposition;
uniform mat4 cmatrix,pmatrix;
uniform sampler2D sampler2;
uniform sampler2D sampler3;
uniform sampler2D presampler;
void main() {
  normal=aNormal;
  position=aPosition;
  gl_Position=vec4(position.x,-position.y,position.z,.5);
  
}