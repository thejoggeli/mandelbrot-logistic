
function Shaders(){}

Shaders.vertex = `
#version 100
attribute vec3 aVoxelPosition;
attribute vec4 aVoxelColor;
uniform mat4 uCameraTransform;

varying vec4 vVoxelColor;

void main() {
   gl_Position = uCameraTransform * vec4(aVoxelPosition.xyz, 1.0); 
   gl_PointSize = 1.0;
   vVoxelColor = aVoxelColor;
}
`

Shaders.geometry = `

`

Shaders.fragment = `
#version 100
precision highp float;

varying vec4 vVoxelColor;
 
void main() {
    gl_FragColor = clamp(vVoxelColor, 0.0, 1.0);
}
`

export default Shaders