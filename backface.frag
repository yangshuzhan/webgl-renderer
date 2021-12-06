precision highp float;
precision highp sampler2D;
uniform vec2 iResolution;
uniform sampler2D u_Sampler;
uniform sampler2D Sampler;
uniform sampler2D world_Sampler;
uniform sampler2D diffuse_Sampler;
uniform float time;
uniform vec3 randoms;
varying vec3 prenormal;

void main(){
  //vec2 uv=gl_FragCoord.xy/iResolution*.5;
  vec3 normal=normalize(prenormal);
  gl_FragColor=vec4(normal,1.0);
}