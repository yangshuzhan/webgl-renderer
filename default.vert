attribute vec3 aPosition;
attribute vec3 aNormal;
attribute float aDepth;
uniform mat4 biasedprojcameramatrix;
uniform float f0;
uniform float bias;
uniform vec3 cameralocation;
uniform vec2 iResolution;
varying vec3 prenormal;
varying vec3 position;
varying float depth;
varying vec3 refractposition;
varying vec3 screennormal;
varying vec2 refractuv;
void main(){
  prenormal=aNormal;
  position=aPosition;
    //gl_PointSize=1.5;
  depth=aDepth;
  vec3 refractdir=refract(normalize(aPosition-cameralocation),aNormal,1.0-f0);
  float tempdepth=depth*-dot(aNormal,refractdir);//计算uv
  refractposition=refractdir*tempdepth+aPosition;
  vec4 temp=biasedprojcameramatrix*vec4(refractposition,1.0);
  screennormal=(biasedprojcameramatrix*vec4(aNormal,0.0)).xyz;
  refractuv=(temp.xy/temp.w*0.5+vec2(0.5));
  gl_Position=biasedprojcameramatrix*vec4(aPosition,1.0);
}