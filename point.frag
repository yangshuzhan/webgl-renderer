precision highp float;
uniform vec2 iResolution;
uniform sampler2D sampler;
uniform sampler2D sampler2;
uniform sampler2D sampler3;
uniform sampler2D presampler;
uniform float bias2;
uniform float time;
uniform vec3 cameralocation;
varying vec4 position;
varying vec3 normal;
const vec4 bitSh = vec4(256. * 256. * 256., 256. * 256., 256., 1.);
const vec4 bitMsk = vec4(0.,vec3(1./256.0));
const vec4 bitShifts = vec4(1.) / bitSh;
float unpack (vec4 color) {
    return dot(color , bitShifts);
}
void main(){
  vec2 uv=vec2(gl_FragCoord.x/iResolution.x,2.0-gl_FragCoord.y/iResolution.y)*.5;
  float pz=unpack(texture2D(sampler,uv));
  vec3 viewdir=cameralocation-position.xyz;
  //vec3 normal=texture2D(sampler2,uv).xyz*2.0-1.0;

  //if(dot(normal,viewdir)>0.0)
   gl_FragColor=vec4(normal,1.0);

   //gl_FragColor=texture2D(sampler2,uv);
  
}