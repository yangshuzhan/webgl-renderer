#extension GL_EXT_frag_depth : enable
precision highp float;
uniform float lightintensity;
uniform float time;
uniform vec3 cameralocation;
uniform float photoncount;
uniform float photonstotal;
uniform vec2 iResolution;
uniform sampler2D back_Sampler;
varying vec3 position;
varying vec3 biasedposition;
varying vec3 normal;
varying vec3 raydir;
varying vec3 color;
varying float size;
varying float roughness;
varying vec3 screennormal;
varying vec3 smoothnormal;
varying float refraction;
void main(){
  vec2 uv=gl_FragCoord.xy/iResolution;
  vec4 realposition=texture2D(back_Sampler,uv);
  vec3 viewdir=cameralocation-position;
  
  if(dot(raydir,normal)*dot(viewdir,normal)>=0.0&&refraction<1.0)//去掉背面的像素
    discard;
  if(abs(gl_FragCoord.z-realposition.w)>0.1||gl_FragCoord.z>realposition.w)//去掉距离差距过大的像素
    discard;
  else
    gl_FragDepthEXT = realposition.w-0.0001;

  float l=length(viewdir);
  viewdir=normalize(viewdir);
  vec2 cxy=2.0*gl_PointCoord-1.0;
  cxy=vec2(cxy.x,-cxy.y);
  //float r=length(cxy)/(1.0-abs(dot(normalize(screennormal.xy),(cxy))));
  float r=length(cxy);
  float alpha=max((exp(-r*r/0.5)/0.625-0.2),0.0);
  float temp=abs(dot(viewdir,normal));
  alpha*=pow(temp,0.85)*(1.0-abs(dot(normalize(screennormal.xy),(cxy))));
  vec3 bsdf;
  if(roughness==1.0)//漫反射
    bsdf=color*dot(raydir,smoothnormal)/dot(raydir,normal);
  else if(refraction>0.0){
    bsdf=pow(max(dot(normalize(raydir),viewdir),0.0),l*5.0)*(l*5.0+1.0)*color;
  }
  else{
    bsdf=pow(max(dot(normalize(raydir),viewdir),0.0),l*5.0)*(l*5.0+1.0)*color;
  }
  // else if(dot(raydir,smoothnormal)>=0.0)//透射光线
  //   bsdf=pow(max(dot(refract(raydir,-smoothnormal,1.5),viewdir),0.0),100.0)*(100.0+1.0)*color;
  // else{//根据法线和光线方向判断是反射光
  //   //bsdf=vec3(pow(dot(normalize(-raydir+viewdir),smoothnormal),time)*(time+1.0)/6.28*(0.01+0.99*pow((1.0-dot(smoothnormal,viewdir)),5.0)));//能量不守恒
  // bsdf=vec3(pow(dot(viewdir,reflect(raydir,smoothnormal)),1000.0)*(1000.0+1.0))*(0.2+0.8*pow((1.0-dot(smoothnormal,viewdir)),5.0))*color;
  //   }
  
    
  bsdf=max(bsdf/(size*size),0.0);
  alpha=max(alpha,0.0);
  
  //gl_FragDepthEXT =gl_FragCoord.z+0.0001*(1.0-gl_FragCoord.z)*dot(normalize(screennormal.xy),cxy)*size*abs(screennormal.z);
  gl_FragColor=vec4((vec3(lightintensity*bsdf*alpha*10000.0/(l*l))),1.0);//乘光子数是为了平衡帧间光子不同的区别，赋予采样多的帧更高的权重,time/photonstotal为了平衡不同场景的亮度

  //gl_FragColor=vec4(texture2D(back_Sampler,uv).xyz,1.0);
}