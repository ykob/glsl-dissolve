attribute vec3 position;
attribute vec2 uv;

varying vec3 vPosition;
varying vec2 vUv;

void main(void) {
  vPosition = position;
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
