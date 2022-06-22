#extension GL_EXT_frag_depth : enable
precision highp float;
uniform float lightintensity;
uniform float time;
uniform vec3 cameralocation;
uniform float photoncount;
varying vec3 position;
varying vec3 normal;
varying vec3 color;
void main(){
  vec3 dir=cameralocation-position;
  float l=length(dir);
  gl_FragColor=vec4(vec3(900.0*lightintensity*color/l),1.0);
  //gl_FragColor=vec4(vec3(sqrt(abs(dot(normalize(dir),normal)))*90000000.0*lightintensity*color/(l*photoncount)),1.0);

  gl_FragDepthEXT = gl_FragCoord.z-0.01;
}