precision highp float;
uniform vec2 iResolution;
uniform sampler2D sampler2;
uniform sampler2D sampler3;
uniform sampler2D presampler;
uniform float time;
varying vec3 normal;
varying vec3 position;
varying vec4 screenposition;
void main(){
  //gl_FragColor=vec4(normal*0.5+vec3(0.5),gl_FragCoord.z);
  vec2 uv=vec2(gl_FragCoord.x/iResolution.x,2.0-gl_FragCoord.y/iResolution.y)*.5;
  gl_FragColor=texture2D(presampler,uv)*time/(time+1.0)+ texture2D(sampler3,uv)/(time+1.0);
}