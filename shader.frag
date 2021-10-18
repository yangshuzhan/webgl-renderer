
precision highp float;
uniform vec2 iResolution;
uniform mat4 cmatrix,pmatrix;
uniform vec3 lightlocation;
uniform float lightintensity;
uniform vec3 cameralocation;
uniform float camerafar;
uniform float cameranear;
uniform float lightradius;
uniform vec3 diffusecolor;
uniform vec3 lightcolor;
uniform vec3 glossycolor;
uniform float roughness;
uniform float fresnel;
uniform vec3 ambient;
uniform float random;
uniform sampler2D sampler;
uniform sampler2D sampler2;
uniform sampler2D presampler;
uniform float radius;
uniform float strength;
uniform float time;
uniform float bias;
uniform float bias2;
uniform mat4 finalmat;
varying vec3 normal;
varying vec3 position;
varying vec4 screenposition;
const float samples=16.0;
const vec4 bitSh = vec4(256. * 256. * 256., 256. * 256., 256., 1.);
const vec4 bitMsk = vec4(0.,vec3(1./256.0));
const vec4 bitShifts = vec4(1.) / bitSh;
float unpack (vec4 color) {
    return dot(color , bitShifts);
}
float rand(vec2 xy,float seed){
    return fract(sin(dot(xy, vec2(12.9898,78.233))*seed) * 43758.5453);
}
vec3 random3d(float random){
  return vec3(random,fract(random*97.0),fract(random*9973.0));
}
vec3 ao(vec3 a){
  vec3 dp;float amount=0.0;float samplecount;//统计采样到的点
  vec2 uv=vec2(gl_FragCoord.x/iResolution.x,2.0-gl_FragCoord.y/iResolution.y)*0.5;
  //float pz=texture2D(sampler,uv).w;//取像素的depth
  float pz=unpack(texture2D(sampler,uv));
  if(pz>0.0&&pz<1.0)
  {
    vec4 screennormal=cmatrix*vec4(normal.x,-normal.y,normal.z,1.0);
    screennormal=normalize(screennormal/screennormal.w);
    
    vec3 viewdir=cameralocation-position;
  // if(dot(viewdir,normal)<0.0)
  //    return a;
    float angle0=random*6.2831853/samples;
    
  
    for(float i=0.0;i<samples;i++){
    float r=radius*rand(vec2(uv.x,uv.y),random+i);
    //float angle=rand(vec2(uv.y,uv.x),time)*6.2831853;
    float angle=angle0+i*6.2831853/samples;
    dp.x=r*cos(angle);
    dp.y=r*sin(angle);
    dp.z=unpack(texture2D(sampler,vec2(uv.x+dp.x,uv.y+dp.y)));
    vec3 dnormal=texture2D(sampler2,vec2(uv.x+dp.x,uv.y+dp.y)).xyz*2.0-vec3(1.0);
    
    r=r*(pz*camerafar+(1.0-pz)*cameranear)/(camerafar-cameranear);
    float dis=(r*r+(dp.z-pz)*(dp.z-pz));
    //float dis=dpx*dpx+dpy*dpy+dpz*dpz;
    if(dp.z<1.0&&dp.z>0.0&&dot(screennormal.xyz,normalize(vec3(dp.x,dp.y,dp.z-pz)))>bias&&dot(normal,dnormal)<1.0-bias2){
      amount+=(.05/dis);
      samplecount++;
      //amount+=(1.0-dot(normal,dnormal))*strength/dis;
      //amount+=(1.0-dot(normal,dnormal))/(.1+dis);
    }
    }
    
  }
  amount=amount*strength/samples;
  //gl_FragColor=vec4(vec3(pz),1.0);
  return a*(1.0-amount);
  //return a*dot(viewdir,normal);
  //gl_FragColor=vec4(vec3(1.0-amount),1.0);
}
void main(){
  vec3 normal=normalize(normal);
  float lightarea=3.14*lightradius*lightradius;
  vec2 uv=vec2(gl_FragCoord.x/iResolution.x,2.0-gl_FragCoord.y/iResolution.y)*0.5;
  //gl_FragColor=vec4(.5,.1,.5,1.0)+vec4(normal,1.0);
  vec3 lightdir=lightlocation-position;
  float lightdis=dot(lightdir,lightdir);
  vec3 reflectdir=reflect(-lightdir,normal);
  vec3 viewdir=cameralocation-position;
  vec3 reallightdir=reflect(-viewdir,normal);
  float a=dot(normalize(reflectdir),normal)*lightintensity/lightdis;
  
  //float b=pow(max(dot(normalize(reflectdir),normalize(viewdir)),0.0),32.0)*.9;
  float angle1=lightradius/sqrt(lightdis);//近似计算球面光
  float angle2=dot(normal,lightdir)/sqrt(lightdis);
  if(angle2<angle1&&angle2>-angle1){
    if(angle2>0.0){
      a=a*angle2/(2.0*angle1-angle2);
      //a=1.0;
    }
    else
    a=a*(-angle2)/(angle1+angle2);
  }


  normal+=random3d(rand(uv,random))*roughness;//给法线一个随机数
  reallightdir=reflect(-viewdir,normal);
  
  float b=0.0;//计算光泽光线
  //float randomp=1.0-rand(uv,random)*roughness;
  //如果正面朝向，且光线到光源的距离小于半径
  if(dot(lightdir,reallightdir)>0.0&&(length(cross(lightdir,reallightdir))/length(reallightdir))<lightradius){
    b=lightintensity/lightarea;
  }
  //菲涅尔反射
  float fresnel2=pow(dot(normal,viewdir)/length(viewdir),fresnel);
  a=max(a*fresnel2,0.0);
  b=max(b*(1.0-fresnel2),0.0);
  vec3 diffuse=vec3(a,a,a)*diffusecolor;
  vec3 specular=vec3(b,b,b)*glossycolor;
  vec3 color=diffuse+specular;
  color=vec3(1.0)-vec3(1.0)/(color+vec3(1.0))+0.5*(diffusecolor+glossycolor)*ambient.xyz;
  //ao(color);
  color=ao(color);
  

  gl_FragColor=vec4(color,1.0);
  //gl_FragColor=vec4(uv,1.0,1.0);
  
}
