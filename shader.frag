
precision highp float;
uniform vec2 iResolution;
uniform mat4 cmatrix,pmatrix;
uniform vec3 lightlocation;
uniform float lightintensity;
uniform vec3 cameralocation;
uniform  float lightradius;
uniform vec3 diffusecolor;
uniform float fresnel;
uniform vec3 ambient;
varying vec3 normal;
varying vec3 position;
bool detectshadow(){
  
  return true;
}
void main(){
  float lightarea=3.14*lightradius*lightradius;
  vec2 uv = gl_FragCoord.xy/iResolution.xy;
  //gl_FragColor=vec4(.5,.1,.5,1.0)+vec4(normal,1.0);
  vec3 lightdir=lightlocation-position;
  float lightdis=dot(lightdir,lightdir);
  vec3 reflectdir=reflect(-lightdir,normal);
  vec3 viewdir=cameralocation-position;
  vec3 reallightdir=reflect(-viewdir,normal);
  float a=max(dot(normalize(reflectdir),normal)*lightintensity/lightdis,0.0);
  
  //float b=pow(max(dot(normalize(reflectdir),normalize(viewdir)),0.0),32.0)*.9;
  float angle1=lightradius/sqrt(lightdis);//近似计算球面光
  float angle2=sqrt(dot(normal,lightdir))/sqrt(lightdis);
  if(angle2<angle1&&angle2>-angle1){
    if(angle2>0.0){
      a=a*angle2/(2.0*angle1-angle2);
      //a=1.0;
    }
    else
    a=a*(-angle2)/(angle1+angle2);
  }
  
  
  float b=0.0;//计算光泽光线
  if(dot(reallightdir,normal)>0.0&&dot(lightdir,reallightdir)>0.0&&(length(cross(lightdir,reallightdir))/length(reallightdir))<lightradius){
    b=lightintensity*2000.0/(lightdis*lightarea);
  }
  //菲涅尔反射
  float fresnel2=pow(dot(normal,viewdir)/length(viewdir),fresnel);
  a=max(a*fresnel2,0.0);
  b=max(b*(1.0-fresnel2),0.0);
  vec3 diffuse=vec3(a,a,a)*diffusecolor;
  vec3 specular=vec3(b,b,b);
  gl_FragColor=vec4(diffuse+specular+ambient.xyz*0.5,1.0);
  //gl_FragColor=vec4(lightlocation/400.0,1.0);
}
