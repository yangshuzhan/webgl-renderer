precision highp float;
uniform vec2 iResolution;
uniform vec3 cameralocation;
uniform vec3 randoms;
uniform float roughness;
uniform float lightintensity;
uniform vec3 glossycolor;
uniform vec3 diffusecolor;
uniform float bias;
varying vec3 prenormal;
varying vec3 position;
uniform float time;
uniform sampler2D u_Sampler;
uniform sampler2D Sampler;
struct lightinfo{
  vec3 position[3];
  vec3 center,normal,a,b;
  float radius;
};
uniform lightinfo trianglelight;

float rand(vec3 normal){
//return fract(dot(gl_FragCoord.xy,vec2(4.3112609,8.7178291199))*fract(gl_FragCoord.z*99.73)+random);
  return fract((fract(gl_FragCoord.x*43.112609)+fract(gl_FragCoord.y*8.7178291199))+randoms.x);
}
vec3 random3D(float random,vec3 normal){
  float z=random*2.0-1.0;
  float r1=sqrt(1.0-z*z);
  float b=fract(random*99.73+randoms.y)*6.28318;
  float r=fract(random*74207.281+randoms.z);
  return (vec3(z,r1*sin(b),r1*cos(b))+normal)*sqrt(r);
}
float intersect(vec3 origin, vec3 raydir) {
  float temp3=dot(trianglelight.normal,raydir);
  if(temp3>0.0){
      return 0.0;
    }
  //float temp=1.0/dot(raydir,trianglelight.normal);
  vec3 temp2=cross(trianglelight.position[0]-origin,raydir);
  //float x=dot(temp2,trianglelight.b)*temp;
  //float y=-dot(temp2,trianglelight.a)*temp;
  vec3 xy0=(temp2*mat3(trianglelight.b,-trianglelight.a,vec3(0.0)))/temp3;
 return float(xy0.x>0.0&&xy0.y>0.0&&xy0.x+xy0.y<1.0);
}

void main(){
  
  vec3 a,b;
  vec3 normal=normalize(prenormal);
  vec3 viewdir=normalize(cameralocation-position);
  
  
  vec3 dir=random3D(rand(normal),normal*roughness);//表示偏离向量
  vec3 lightdir=reflect(-viewdir,normal);
  
  lightdir=mix(lightdir,dir,roughness);
  //lightdir+=dir*roughness;
  
  float cosa=step(0.0,dot(lightdir,normal));
  //if(dot(lightdir,normal)<0.0)
  //vec3 error2=lightdir-dot(normal,lightdir)*normal;
  //float fresnel=length(cross(normal,normalize(viewdir)))+0.2;
  //光线跟踪
  a=glossycolor*intersect(position,lightdir);
  

 //投影到球面上
  vec3 l1=normalize(trianglelight.position[0]-position);
  vec3 l2=normalize(trianglelight.position[1]-position);
  vec3 l3=normalize(trianglelight.position[2]-position);
  vec3 n123=max(normal*mat3(l1,l2,l3),0.0);
  vec3 one=vec3(1.0);

  float averagecosa=0.33333*dot(n123,one)/length(l1+l2+l3);//有点问题
  
  vec3 k1=normalize(cross(l1,l2));//求立体角
  vec3 k2=normalize(cross(l3,l1));
  vec3 k3=normalize(cross(l2,l3));
  vec3 a123=acos(-vec3(dot(k1,k2),dot(k2,k3),dot(k1,k3)));
  //b=vec3(length(cross(l2-l1,l3-l1))*averagecosa);
  
  float intensity=dot(a123,one)-3.1415927;//表示这点的光强
  b=diffusecolor*(intensity*averagecosa);

  //gl_FragColor=vec4((1.0-1.0/((a+b)*lightintensity+1.0)),1.0/time);
  gl_FragColor=vec4((a+b)*lightintensity,1.0/time);
}