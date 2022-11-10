precision highp float;
precision highp sampler2D;
uniform vec2 iResolution;
uniform sampler2D u_Sampler;
uniform sampler2D Sampler;
uniform sampler2D world_Sampler;
uniform sampler2D bloom_Sampler;
uniform sampler2D back_Sampler;
uniform sampler2D photon_Sampler;
uniform sampler2D difference_Sampler;
uniform float time;
uniform float photonstotal;
uniform vec3 randoms;
//varying vec3 normal;
vec3 fromLinear(vec3 linearRGB)
{
    vec3 cutoff = step(linearRGB, vec3(0.0031308));
    vec3 higher = vec3(1.055)*pow(linearRGB, vec3(1.0/2.4)) - vec3(0.055);
    vec3 lower = linearRGB * vec3(12.92);

    return mix(higher, lower, cutoff);
}
vec3 saturate(vec3 RGB){
  float brightness=dot(RGB,vec3(0.333333,0.33333,0.33333));
  vec3 saturation=RGB-vec3(brightness);
  return saturation*pow(brightness,0.15)+vec3(brightness);
}
void main(){
  //vec2 uv=gl_FragCoord.xy/iResolution*.5;
  vec2 uv=gl_FragCoord.xy/iResolution;
  vec3 color=fromLinear(saturate(texture2D(Sampler,uv).xyz));
  //vec3 photoncolor=+texture2D(photon_Sampler,uv).xyz*100.0*inversesqrt(photonstotal+1.0);
  vec2 uv2=gl_FragCoord.xy/128.0;
  vec3 rand=fract(texture2D(u_Sampler,uv2).xyz)-vec3(0.5,0.5,0.0);
  vec3 photoncolor=fromLinear(texture2D(bloom_Sampler,uv).xyz);
  //gl_FragColor=vec4(color*(vec3(1.0)-min(photoncolor,1.0))+photoncolor,1.0);//合成有问题
  gl_FragColor=vec4(photoncolor,1.0);//合成有问题
  //gl_FragColor=vec4(color,1.0);//合成有问题
  
  //gl_FragColor=vec4(texture2D(difference_Sampler,uv).xyz,1.0);
}