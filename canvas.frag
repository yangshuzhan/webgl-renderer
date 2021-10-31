precision highp float;
uniform vec2 iResolution;
uniform sampler2D u_Sampler;
uniform sampler2D Sampler;
uniform float time;
//varying vec3 normal;
void main(){
  vec2 uv=gl_FragCoord.xy/iResolution*.5;
  gl_FragColor=vec4(texture2D(Sampler,uv).xyz,1.0);
}