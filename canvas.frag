precision highp float;
uniform vec2 iResolution;
uniform sampler2D u_Sampler;
uniform sampler2D Sampler;
uniform float time;
//varying vec3 normal;
vec3 fromLinear(vec3 linearRGB)
{
    vec3 cutoff = step(linearRGB, vec3(0.0031308));
    vec3 higher = vec3(1.055)*pow(linearRGB, vec3(1.0/2.4)) - vec3(0.055);
    vec3 lower = linearRGB * vec3(12.92);

    return mix(higher, lower, cutoff);
}

void main(){
  vec2 uv=gl_FragCoord.xy/iResolution*.5;
  gl_FragColor=vec4(fromLinear(texture2D(Sampler,uv).xyz),1.0);
}