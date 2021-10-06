precision highp float;
varying vec3 normal;
varying vec3 position;
varying vec4 screenposition;
const vec4 bitSh = vec4(256. * 256. * 256., 256. * 256., 256., 1.);
const vec4 bitMsk = vec4(0.,vec3(1./256.0));
const vec4 bitShifts = vec4(1.) / bitSh;
vec4 pack (float value) {
    vec4 comp = fract(value * bitSh);
    comp -= comp.xxyz * bitMsk;
    return comp;
}
void main(){
  //gl_FragColor=vec4(normal*0.5+vec3(0.5),gl_FragCoord.z);
  gl_FragColor=pack(gl_FragCoord.z);
}