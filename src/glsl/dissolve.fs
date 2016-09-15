uniform vec2 resolution;
uniform vec2 imageResolution;
uniform sampler2D texPrev;
uniform sampler2D texNext;

varying vec2 vUv;

void main(void) {
  vec2 ratio = vec2(
      min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
      min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
    );
  vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  vec4 colorPrev = texture2D(texPrev, uv);
  vec4 colorNext = texture2D(texNext, uv);
  gl_FragColor = colorPrev;
}
