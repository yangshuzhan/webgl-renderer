precision highp float;
uniform float lightintensity;
uniform float time;
uniform float ambientintensity;
//varying vec3 normal;
void main(){
  gl_FragColor=vec4(vec3(ambientintensity*0.01),1.0);
}