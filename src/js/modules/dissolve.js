const glslify = require('glslify');

export default class Dissolve {
  constructor() {
    this.uniforms = {};
    this.textures = [];
    this.interval = 3;
    this.noise = { x: 8, y: 6, z: 4 };
    this.edge = {
      prev_start: 0.01,
      prev_width: 0.05,
      next_start: 0.01,
      next_width: 0.05,
    };
    this.prev_num = 0;
    this.next_num = 0;
    this.stop = false;
    this.mesh = null;
  }
  loadTexture(images, callback) {
    let count = 0;
    for (var i = 0; i < images.length; i++) {
      const index = i;
      const loader = new THREE.TextureLoader();
      loader.load(images[index], (texture) => {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        this.textures[index] = texture;
        count++;
        if (count == images.length) {
          this.mesh = this.createMesh();
          callback();
        }
      });
    }
  }
  createMesh() {
    const tex_intro = new THREE.DataTexture(new Uint8Array([255, 255, 255, 0]), 1, 1, THREE.RGBAFormat, THREE.UnsignedByteType);
    tex_intro.needsUpdate = true;
    this.uniforms = {
      time: {
        type: 'f',
        value: 0,
      },
      interval: {
        type: 'f',
        value: this.interval,
      },
      resolution: {
        type: 'v2',
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      imageResolution: {
        type: 'v2',
        value: new THREE.Vector2(2048, 1356),
      },
      texPrev: {
        type: 't',
        value: tex_intro,
      },
      texNext: {
        type: 't',
        value: this.textures[0],
      },
      noiseX: {
        type: 'f',
        value: this.noise.x
      },
      noiseY: {
        type: 'f',
        value: this.noise.y
      },
      noiseZ: {
        type: 'f',
        value: this.noise.z
      },
      prevEdgeStart: {
        type: 'f',
        value: this.edge.prev_start
      },
      prevEdgeWidth: {
        type: 'f',
        value: this.edge.prev_width
      },
      nextEdgeStart: {
        type: 'f',
        value: this.edge.next_start
      },
      nextEdgeWidth: {
        type: 'f',
        value: this.edge.next_width
      },
    };
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.RawShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../glsl/dissolve.vs'),
        fragmentShader: glslify('../../glsl/dissolve.fs'),
        transparent: true,
      })
    );
  }
  render(time) {
    if (this.stop) return;
    this.uniforms.time.value += time / this.interval;
    if (this.uniforms.time.value > 1) {
      this.uniforms.time.value = 0;
      this.prev_num = this.next_num;
      this.uniforms.texPrev.value = this.textures[this.next_num];
      while (this.next_num == this.prev_num) {
        this.next_num = Math.floor(Math.random() * this.textures.length);
      }
      this.uniforms.texNext.value = this.textures[this.next_num];
    }
  }
  resize() {
    this.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
  }
}
