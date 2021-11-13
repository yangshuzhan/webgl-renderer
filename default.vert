attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 projcameramatrix;
varying vec3 prenormal;
varying vec3 position;

void main(){
    prenormal=aNormal;
    position=aPosition;
    gl_Position=projcameramatrix*vec4(aPosition,1.0);
}