
precision highp float;
precision highp sampler2D;
uniform vec2 iResolution;
uniform sampler2D u_Sampler;
uniform sampler2D Sampler;
uniform sampler2D world_Sampler;
uniform float time;
uniform vec3 randoms;
//varying vec3 normal;
uniform sampler2D photon_Sampler;
uniform float photonstotal;
uniform float lightintensity;
vec3 fromLinear(vec3 linearRGB)
{
    vec3 cutoff = step(linearRGB, vec3(0.0031308));
    vec3 higher = vec3(1.055)*pow(linearRGB, vec3(1.0/2.4)) - vec3(0.055);
    vec3 lower = linearRGB * vec3(12.92);

    return mix(higher, lower, cutoff);
}
void main(){
  //vec2 uv=gl_FragCoord.xy/iResolution*.5;
  vec2 uv=gl_FragCoord.xy/iResolution;
  vec2 uv2=gl_FragCoord.xy/128.0;
  vec3 rand=fract(texture2D(u_Sampler,uv2).xyz+randoms)-vec3(0.5,0.5,0.0);
  vec3 bloom=vec3(0.0);
  vec3 color=texture2D(Sampler,uv+rand.xy*rand.z*0.02*lightintensity).xyz;
  float temp=dot(color,vec3(0.33))-0.9;
  if(temp>0.0){
    bloom=vec3(temp/(1.0+dot(rand.xy,rand.xy)));
  }
  vec3 photoncolor=texture2D(photon_Sampler,uv).xyz;
  
  vec3 basecolor=clamp(texture2D(Sampler,uv).xyz,0.0,1.0);
  
  //gl_FragDepthEXT = 0.0;
  gl_FragColor=vec4(basecolor+bloom+photoncolor,1.0/time);
}