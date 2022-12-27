attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec3 aDir;
attribute vec3 aColor;
attribute vec3 aSmoothnormal;
attribute float aLength;
attribute float aRoughness;
attribute float aRefraction;
uniform sampler2D back_Sampler;
uniform sampler2D bloom_Sampler;
uniform vec2 iResolution;
uniform mat4 projcameramatrix;
uniform vec3 cameralocation;
uniform float time;
uniform float photoncount;
uniform vec3 randoms;
varying vec3 position;
varying vec3 normal;
varying vec3 color;
varying vec3 biasedposition;
varying float size;
varying float roughness;
varying vec3 screennormal;
varying vec3 raydir;
varying vec3 smoothnormal;
varying float refraction;
void main(){
  raydir=aDir;
  smoothnormal=aSmoothnormal;
  roughness=aRoughness;
  refraction=aRefraction;
  vec3 dir=cameralocation-aPosition;
  size=3000.0/(1.0+log2(time))/length(dir)/log2(1.0+photoncount)*aLength;
  
  normal=aNormal;
  screennormal=(projcameramatrix*vec4(normal,1.0)).xyz;
  position=aPosition;
  
  //vec2 cv=gl_PointCoord*2.0-vec2(1.0);
  vec3 viewdir=normalize(cameralocation-position);
  vec3 biasedposition=aPosition+0.1*(size-1.0)*viewdir*(1.0/abs(dot(normal,viewdir))-0.5);//为了防止点的一部分被挡住
  vec4 outposition=projcameramatrix*vec4(biasedposition,1.0);
  
  vec2 uv=(outposition.xy)/length(cameralocation-position)*0.5+0.5;
  //uv=vec2(uv.x,1.0-uv.y);
  // if(texture2D(bloom_Sampler,uv).xyz!=vec3(0.0))//在边缘处缩小半径
  //   size*=1.1-dot(texture2D(difference_Sampler,uv).xyz,vec3(0.3333));
  size=clamp(size,1.0,100.0);

  color=aColor;

  // vec3 temp=texture2D(back_Sampler,uv+size*(randoms.xy*2.0-1.0)/iResolution).xyz-position;
  // if(length(temp)*abs(dot(normal,viewdir))>5.0&&dot(temp,viewdir)<0.0){//边缘能量补偿
  //   color*=3.0;
  //   color=vec3(1.0,0.0,0.0);
  // //color=texture2D(difference_Sampler,uv).xyz+0.1;
  // }

  gl_PointSize=size;
  gl_Position=outposition;
}