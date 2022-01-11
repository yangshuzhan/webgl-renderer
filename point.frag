precision highp float;
uniform float lightintensity;
//varying vec3 normal;
void main(){
  gl_FragColor=vec4(vec3(lightintensity),1.0);
}