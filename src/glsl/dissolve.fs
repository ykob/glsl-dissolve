uniform float time;
uniform float interval;
uniform vec2 resolution;
uniform vec2 imageResolution;
uniform sampler2D texPrev;
uniform sampler2D texNext;

varying vec3 vPosition;
varying vec2 vUv;

#pragma glslify: cnoise3 = require(glsl-noise/classic/3d);
#pragma glslify: ease = require(glsl-easings/quadratic-in-out);

void main(void) {
  vec2 ratio = vec2(
      min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
      min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
    );
  vec2 uv = vec2(
      vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
      vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
    );
  vec3 colorPrev = texture2D(texPrev, uv).rgb;
  vec3 colorNext = texture2D(texNext, uv).rgb;

  float noise = (cnoise3(vec3(uv.x * 8.0, uv.y * 6.0, 0.0)) + 1.0) / 2.0;
  float step = ease(min((time / interval), 1.0));

  gl_FragColor = vec4(
      colorPrev * smoothstep(step - 0.01, step - 0.005, noise)
      + colorNext * (1.0 - smoothstep(step + 0.005, step + 0.01, noise)),
      1.0
    );
}
