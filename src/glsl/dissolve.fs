precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 imageResolution;
uniform sampler2D texPrev;
uniform sampler2D texNext;
uniform float noiseX;
uniform float noiseY;
uniform float noiseZ;
uniform float prevEdgeStart;
uniform float prevEdgeWidth;
uniform float nextEdgeStart;
uniform float nextEdgeWidth;

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
  vec4 colorPrev = texture2D(texPrev, uv);
  vec4 colorNext = texture2D(texNext, uv);

  float noise = (cnoise3(vec3(uv.x * noiseX, uv.y * noiseY, noiseZ)) + 1.0) / 2.0
    * (1.0 - (prevEdgeStart + prevEdgeWidth + nextEdgeStart + nextEdgeWidth))
    + (prevEdgeStart + prevEdgeWidth + nextEdgeStart + nextEdgeWidth) * 0.5;
  float step = ease(min((time), 1.0));

  gl_FragColor = colorPrev * smoothstep(step - (prevEdgeStart + prevEdgeWidth), step - prevEdgeStart, noise)
    + colorNext * smoothstep((1.0 - step) - (nextEdgeStart + nextEdgeWidth), (1.0 - step) - nextEdgeStart, (1.0 - noise));
}
