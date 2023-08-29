precision highp float;
precision highp sampler2D;
uniform vec2 iResolution;
uniform vec3 cameralocation;
uniform vec3 randoms;
uniform float roughness;
uniform float lightintensity;
uniform float ambientintensity;
uniform vec3 glossycolor;
uniform vec3 diffusecolor;
uniform float bias;
varying vec3 prenormal;
varying vec3 screennormal;
varying vec3 position;
uniform float time;
uniform float f0;
uniform sampler2D u_Sampler;
uniform sampler2D Sampler;
uniform sampler2D world_Sampler;
uniform sampler2D normaldepth_Sampler;
uniform sampler2D bloom_Sampler;
uniform mat4 biasedprojcameramatrix;
struct lightinfo{
  vec3 position[3];
  vec3 center,normal,a,b;
  float radius;
};
uniform lightinfo trianglelight;
const float pi=3.1415926;
vec3 rand(vec2 uv){
return fract(texture2D(u_Sampler,uv).xyz+randoms);
}
float ao(vec2 uv,vec2 rand,inout vec3 normal0,in vec3 viewdir){
  float x=sin(rand.x*6.283),y=cos(rand.x*6.283);
  //vec4 screennormal=(biasedprojcameramatrix*vec4(normal0,0.0));
  // screennormal.y=-screennormal.y;
  if(dot(normal0,cameralocation-position)<0.0)
    normal0=-normal0;
  float result=0.0,temp0=0.0;
  vec3 p1;
  for(float i=1.0;i<5.0;i++){
    vec2 tempuv=(vec2(x,y)+screennormal.xy*0.5)*0.05*i*(rand.y+0.1)*bias;
    p1=texture2D(normaldepth_Sampler,uv+tempuv).xyz;
    vec3 lightdir=normalize(p1-position);
    float temp1=dot(normal0,lightdir);
    if(temp1>temp0&&p1!=vec3(0)){
      result=temp1;
      temp0=temp1;
    }
  }
  normal0=normalize(mix(reflect(normalize(p1-position),normal0),normal0,0.5));
    return 1.0-result*2.0;
}
vec3 ssr(vec2 uv,in vec3 lightdir,in vec3 rand,inout vec3 color){
  vec3 reflectdir=lightdir;
  vec2 reflectuv=normalize((biasedprojcameramatrix*vec4(reflectdir,0.0)).xy);
  //reflectuv.y*=-1.0;
  vec3 temp0=vec3(0);
  for(float i=0.0;i<10.0;i++){
    vec2 tempuv=((reflectuv.xy)*0.05)*(i+rand.x)*bias;
    vec3 p1=texture2D(normaldepth_Sampler,uv+tempuv).xyz;
    vec3 temp1=normalize(p1-position)-reflectdir;
    
    if(dot(temp0,temp1)<0.0&&p1!=vec3(0)){
      
      color=texture2D(bloom_Sampler,uv+tempuv).xyz*glossycolor;
      return color;
    }
    temp0=temp1;
  }
  return color;
}
vec3 random3D(vec3 r,vec3 normal){
  float z=r.x*2.0-1.0;
  float r1=sqrt(1.0-z*z);
  float b=r.y*6.2831853;
  float radius=r.z;
  return (vec3(z,r1*sin(vec2(b,b+1.5707963)))+normal)*(1.0-sqrt(1.0-sqrt(radius)));
}
vec3 random3D2(vec3 r){
  float z=r.x*2.0-1.0;
  float r1=sqrt(1.0-z*z);
  float b=r.y*6.2831853;
  return vec3(z,r1*sin(vec2(b,b+1.5707963)));
}
float intersect(vec3 origin, vec3 raydir) {
  float temp=dot(trianglelight.normal,raydir);
  if(temp<0.0){
      return 0.0;
    }
  //float temp=1.0/dot(raydir,trianglelight.normal);
  vec3 temp2=cross(trianglelight.position[0]-origin,raydir);
  float x=dot(temp2,trianglelight.b)/temp;
  float y=-dot(temp2,trianglelight.a)/temp;
  //vec3 xy0=(temp2*mat3(trianglelight.b,-trianglelight.a,vec3(0.0)))*temp3;
 return float(x>0.0&&y>0.0&&x+y<1.0);
}
vec3 lookuptex(vec3 lightdir){
    vec2 worlduv;
    worlduv.x=atan(lightdir.x/lightdir.z)/6.2832+0.25*sign(lightdir.z);
    worlduv.y=-acos(lightdir.y)/3.1415927;
  
  return texture2D(world_Sampler,worlduv).xyz;
}
vec3 ourbrdf(vec3 viewdir,vec3 normal,vec3 rand){
  vec3 dir=random3D(rand,normal*roughness);//表示偏离向量
  vec3 lightdir=reflect(-viewdir,normal);
  return normalize(mix(lightdir,dir,roughness));
}
vec3 phongbrdf(vec3 viewdir,vec3 normal,vec3 rand){
  vec3 random3d=random3D2(rand);
  vec3 lightdir=reflect(normalize(-viewdir),normal);
  vec3 dir=normalize(cross(random3d,lightdir));//沿着dir旋转
  float n=-0.3*log(1.0-roughness)/log(500.0);
  //float n=.01*(1.0/(1.0-roughness)-1.0);
  float cosseta=pow(rand.z,n);
  return cosseta*lightdir+(1.0-cosseta)*dot(lightdir,dir)*dir+sqrt(1.0-cosseta*cosseta)*cross(dir,lightdir);
}
vec3 blinnphongbrdf(vec3 viewdir,vec3 normal,vec3 rand){
  vec3 random3d=random3D2(rand);
  vec3 dir=normalize(cross(random3d,normal));//沿着dir旋转
  //float n=1.0/roughness-1.0;
  float cosseta=pow(rand.z,roughness);
  vec3 dnormal=cosseta*normal+(1.0-cosseta)*dot(normal,dir)*dir+sqrt(1.0-cosseta*cosseta)*cross(dir,normal);
  return reflect(-viewdir,dnormal);
}
vec3 ggxbrdf(vec3 viewdir,vec3 normal,vec3 rand){
  vec3 dir=normalize(cross(random3D2(rand),normal));//沿着dir旋转
  float ra=rand.z;
  float cosseta=sqrt((1.0 - ra)/((roughness*roughness - 1.0) * ra + 1.0));
  vec3 dnormal=cosseta*normal+(1.0-cosseta)*dot(normal,dir)*dir+sqrt(1.0-cosseta*cosseta)*cross(dir,normal);
  // float sinseta=sqrt(1.0-cosseta*cosseta);
  // vec3 dnormal=mat3(vec3(1,0,0),vec3(0,cosseta,sinseta),vec3(0,-sinseta,cosseta))*normal;
  return reflect(-viewdir,dnormal);
}
vec3 toWorldspace(vec3 a,vec3 normal){
  // vec3 b=normalize(vec3(normal.y,-normal.x,0.0));
  //vec3 b=normalize(vec3(normal.z,0.0,-normal.x));
  vec3 b=normalize(cross(normal,vec3(0,1,0)));
  vec3 c=normalize(cross(b,normal));
  return mat3(b,normal,c)*a;
  
}
vec3 ggx2brdf(vec3 viewdir,vec3 normal,vec3 rand){
  float theta=pi*rand.x;
  float r=sqrt(rand.y);
  vec2 P=vec2(r*sin(theta),r*cos(theta));
  vec3 N = vec3(P.x, sqrt(1.0 - P.x * P.x - P.y * P.y), P.y);
  N = normalize(vec3(roughness * N.x, N.y, roughness * N.z));
  return reflect(-viewdir,toWorldspace(N,normal));
}
vec3 ggx3brdf(vec3 viewdir,vec3 normal,vec3 rand){
  float cosalpha=dot(viewdir,normal);
  float sinalpha=sqrt(1.0-cosalpha*cosalpha);
  float theta,scaling=1.0;
  if(rand.z<1.0/(1.0+cosalpha)){
    theta=pi*rand.x;
  }
  else{
    theta=pi*rand.x+pi;
    scaling=cosalpha;
  }
  float r=sqrt(rand.y);
  vec2 P=vec2(r*cos(theta),r*sin(theta)*scaling);
  vec3 N = vec3(P.x,sqrt(1.0 - P.x * P.x - P.y * P.y),P.y);
  N=mat3(vec3(1,0,0),vec3(0.0,cosalpha,-sinalpha),vec3(0.0,sinalpha,cosalpha))*N;
  N = normalize(vec3(roughness * N.x, N.y, roughness * N.z));
  vec3 dir1=reflect(-viewdir,toWorldspace(N,normal));
    return dir1;
}
void main(){
  vec3 a,b;
  vec3 normal=normalize(prenormal);
  vec3 viewdir=normalize(cameralocation-position);
  if(dot(normal,viewdir)<0.0)
    normal=-normal;
  vec2 uv=gl_FragCoord.xy/128.0;
  vec2 uv2=gl_FragCoord.xy/iResolution;
  vec3 rand=rand(uv);
  vec3 diffusenormal=normal,reflection=vec3(0);
  float reflectionindex=0.0;
  float aocolor=ao(uv2,rand.xy,diffusenormal,viewdir);
  
  vec3 lightdir=ourbrdf(viewdir,normal,rand);
  float cosa=dot(normalize(lightdir),viewdir);
  float fresnel=(cosa+3.0)*f0/(cosa+2.0*f0+1.0);
  //光线跟踪
  float intersection=intersect(position,lightdir);
  a=glossycolor*intersection*lightintensity;
  //环境反射
  if(intersection==0.0){
    a=glossycolor*ambientintensity*lookuptex(lightdir);
  }
  a=ssr(uv2,lightdir,rand,a);

  vec3 diffusedir=random3D(vec3(rand.xy,1.0),diffusenormal);
  
  b=diffusecolor*ambientintensity*lookuptex(diffusedir);

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
  b+=diffusecolor*(intensity*averagecosa*lightintensity);
  
  //vec4 screennormal=(biasedprojcameramatrix*vec4(normal,0.0)).xyzw;
  // screennormal.xyz/=screennormal.w;
  //gl_FragColor=vec4((1.0-1.0/((a+b)*lightintensity+1.0)),1.0/time);
  
  gl_FragColor=vec4(mix(b*aocolor,a,fresnel),1.0);
}