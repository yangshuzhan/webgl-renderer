attribute vec3 aPosition;
attribute vec3 aNormal;
void main(){
    gl_Position=vec4(aPosition,1.0);
}