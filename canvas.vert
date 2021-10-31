attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 projmatrix,cameramatrix;
uniform vec3 cameralocation;
varying vec3 prenormal;
varying vec3 position;
void main(){
    gl_Position=vec4(aPosition,1.0);
}