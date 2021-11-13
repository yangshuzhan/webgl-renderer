attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 projcameramatrix;
//varying vec3 normal;
void main(){
    gl_PointSize=2.0;
      //normal=aNormal;
    gl_Position=projcameramatrix*vec4(aPosition,1.0);
}