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
void main(){
  //vec2 uv=gl_FragCoord.xy/iResolution*.5;
  vec2 uv=gl_FragCoord.xy/iResolution;
  vec2 uv2=gl_FragCoord.xy/128.0;
  vec3 rand=fract(texture2D(u_Sampler,uv2).xyz+randoms);
  vec3 tempcolor=texture2D(bloom_Sampler,uv).xyz;
  vec2 dx=vec2(0.05*(rand.x-0.5),0.0);
  vec2 dy=vec2(0.0,0.05*(rand.y-0.5));
  vec3 color=abs(tempcolor-(texture2D(bloom_Sampler,uv+dx).xyz));
    color+=abs(tempcolor-(texture2D(bloom_Sampler,uv+dy).xyz));
  gl_FragColor=vec4(clamp(sqrt(color),0.0,1.0),sqrt(60.0/time));
}