precision highp float;
precision highp sampler2D;
uniform vec2 iResolution;
uniform sampler2D u_Sampler;
uniform sampler2D Sampler;
uniform sampler2D world_Sampler;
uniform float time;
uniform vec3 randoms;
//varying vec3 normal;

void main(){
  //vec2 uv=gl_FragCoord.xy/iResolution*.5;
  vec2 uv=gl_FragCoord.xy/iResolution;
  vec2 uv2=gl_FragCoord.xy/128.0;
  vec3 rand=fract(texture2D(u_Sampler,uv2).xyz)-vec3(0.5,0.5,0.0);
  vec3 bloom=vec3(0.0);
  if(dot(texture2D(Sampler,uv+rand.xy*rand.z*0.1).xyz,vec3(1.0))>1.0){
    bloom=vec3(1.0/(1.0+length(rand.xy))-0.4);
  }
  gl_FragColor=vec4(bloom,1.0);
}