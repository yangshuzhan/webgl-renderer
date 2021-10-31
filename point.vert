attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 projmatrix,cameramatrix;
//varying vec3 normal;
void main(){
    gl_PointSize=2.0;
      //normal=aNormal;
    gl_Position=projmatrix*cameramatrix*vec4(aPosition,1.0)+vec4(0.0,0.0,-0.00001,0.0);
}