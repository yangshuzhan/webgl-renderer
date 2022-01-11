precision highp float;
precision highp sampler2D;
uniform vec2 iResolution;
uniform sampler2D u_Sampler;
uniform sampler2D Sampler;
uniform sampler2D world_Sampler;
uniform sampler2D bloom_Sampler;
uniform sampler2D back_Sampler;
uniform float time;
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
  vec2 uv2=gl_FragCoord.xy/128.0;
  vec3 rand=fract(texture2D(u_Sampler,uv2).xyz)-vec3(0.5,0.5,0.0);
  vec3 bloom=vec3(0.0);
  
  if(dot(texture2D(Sampler,uv+rand.xy*rand.z*0.1).xyz,vec3(1.0))>1.0){
    bloom=vec3(1.0/(1.0+length(rand.xy))-0.4);
  }
  gl_FragColor=vec4(color+texture2D(bloom_Sampler,uv).xyz*(time-0.9)/time,1.0);
}