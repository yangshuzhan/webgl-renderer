precision highp float;
uniform float lightintensity;
uniform float time;
//varying vec3 normal;
void main(){
  vec2 cxy=2.0*gl_PointCoord-1.0;
  cxy=vec2(cxy.x,-cxy.y);
  //float r=length(cxy)/(1.0-abs(dot(normalize(screennormal.xy),(cxy))));
  float r=length(cxy);
  float alpha=max((exp(-r*r/0.5)/0.625-0.2),0.0);
  gl_FragColor=vec4(vec3(lightintensity),1.0);
  
}