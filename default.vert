attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 projmatrix,cameramatrix;
varying vec3 prenormal;
varying vec3 position;

void main(){
    prenormal=aNormal;
    position=aPosition;
    gl_Position=projmatrix*cameramatrix*vec4(aPosition,1.0);
}