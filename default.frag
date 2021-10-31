precision highp float;
uniform vec2 iResolution;
uniform vec3 cameralocation;
uniform float random;
uniform float roughness;
uniform float lightintensity;
uniform vec3 glossycolor;
uniform vec3 diffusecolor;
uniform float bias;
varying vec3 prenormal;
varying vec3 position;
uniform vec3 light1;
uniform vec3 light2;
uniform vec3 light3;
uniform float time;
uniform sampler2D u_Sampler;
uniform sampler2D Sampler;
const vec3 center=vec3(88.7,11.3,100.0);
float max(float a,float b,float c){
  if(a>b&&a>c)
    return a;
  else if(b>a&&b>c)
    return b;
  else
    return c;
}
float rand(vec2 uv){
  return fract(fract(uv.x*0.969179)*uv.y*14.142135623730951+random);
}
float transformrand(float seed){
  return tan(3.14159*(seed-0.5));
}
vec3 random3D(float random){
  return vec3(random,fract(random*97.0),fract(random*9973.0));
}
vec3 hitposition;
bool intersect(vec3 origin, vec3 raydir,vec3 p1,vec3 p2,vec3 p3) {
  vec3 oa=p1-origin;
  vec3 facenormal=cross(p2-p1,p3-p1);
    if(dot(facenormal,raydir)>0.0){
      hitposition=vec3(99999999.0);
      return false;
    }
      
  float temp=1.0/dot(raydir,facenormal);
  vec3 temp2=cross(oa,raydir);
  float x=dot(temp2,p3-p1)*temp;
  float y=-dot(temp2,p2-p1)*temp;
   hitposition=vec3(x,y,1.0-x-y);//交点用向量表示
  if(x>0.0&&y>0.0&&x+y<1.0){
    return true;
  }
  else{
   
     return false;
  }
}

void main(){
  
  vec3 a,b;
  vec3 normal=normalize(prenormal);

  vec3 facenormal=cross(light2-light1,light3-light1);
  vec3 viewdir=cameralocation-position;
  
  float error=max(dot(normalize(viewdir),normal),0.0);//视角越低粗糙度越小
  
  vec3 random3d=(random3D(transformrand(rand(gl_FragCoord.xy))))*roughness*error;//表示偏离程度
  vec3 dnormal=normalize(normal+random3d);
  
  vec3 lightdir=normalize(reflect(-viewdir,dnormal));
  
  float coherent=1.0;//去掉越过地平线的反射光
  if(dot(lightdir,normal)<0.0)
    coherent=0.0;
  
 //投影到球面上
  vec3 l1=normalize(light1-position);
  vec3 l2=normalize(light2-position);
  vec3 l3=normalize(light3-position);
  vec3 l4=normalize(center-position);
  vec3 n123=max(vec3(dot(normal,l1),dot(normal,l2),dot(normal,l3)),0.0);

  float averagecosa=0.33333*(n123.x+n123.y+n123.z)/length(l1+l2+l3);//有点问题
  
  vec3 k1=normalize(cross(l1,l2));//求立体角
  vec3 k2=normalize(cross(l3,l1));
  vec3 k3=normalize(cross(l2,l3));
  vec3 a123=acos(vec3(-dot(k1,k2),-dot(k2,k3),-dot(k1,k3)));
  //b=vec3(length(cross(l2-l1,l3-l1))*averagecosa);
  
  float intensity=a123.x+a123.y+a123.z-3.14159;//表示这点的光强
  b=diffusecolor*(intensity*averagecosa);
  
  float fresnel=length(cross(normal,normalize(viewdir)))+0.1;
  if(intersect(position,lightdir,light1,light2,light3)){
    a=glossycolor*(coherent*fresnel); 
  }
  
  //用漫反射近似
  //a=a*(1.0-roughness*error)+b*roughness*error;
  a=mix(a,b,roughness*error) ;
  
  
  //计算交点与三角形的距离
  
  vec2 uv=vec2(gl_FragCoord.x/iResolution.x,2.0-gl_FragCoord.y/iResolution.y)*.5;
  //gl_FragColor=vec4((1.0-1.0/((a+b)*lightintensity+1.0))+texture2D(u_Sampler,uv).xyz+texture2D(Sampler,uv).xyz,1.0);
  gl_FragColor=vec4((1.0-1.0/((a+b)*lightintensity+1.0)),1.0/time);
}