attribute vec3 aPosition;
attribute vec3 aNormal;
attribute float aDepth;
uniform mat4 biasedprojcameramatrix;
uniform float f0;
uniform vec3 cameralocation;
uniform vec2 iResolution;
varying vec3 prenormal;
varying vec3 position;
varying float depth;
varying vec3 refractposition;
varying vec2 refractuv;
void main(){
  prenormal=aNormal;
  position=aPosition;
    //gl_PointSize=1.5;
  depth=aDepth;
  refractposition=refract(normalize(aPosition-cameralocation),aNormal,1.0-f0)*depth+aPosition;
  vec4 temp=(biasedprojcameramatrix*vec4(refractposition,1.0));
  refractuv=(temp.xy/temp.w+vec2(1.0))*0.5;
  gl_Position=biasedprojcameramatrix*vec4(aPosition,1.0);
}