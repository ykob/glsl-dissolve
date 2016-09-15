const glslify = require('glslify');

export default class Dissolve {
  constructor() {
    this.time = 1;
    this.uniforms = {};
    this.textures = [];
    this.current_num = 0;
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
    this.uniforms = {
      time: {
        type: 'f',
        value: 0,
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
        value: this.textures[0],
      },
      texNext: {
        type: 't',
        value: this.textures[1],
      },

    };
    return new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2, 2),
      new THREE.ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: glslify('../../glsl/dissolve.vs'),
        fragmentShader: glslify('../../glsl/dissolve.fs'),
      })
    );
  }
  render(time) {
    this.uniforms.time.value += time * this.time;
  }
  resize() {
    this.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
  }
}
