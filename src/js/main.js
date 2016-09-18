import Dissolve from './modules/dissolve.js';

const canvas = document.getElementById('canvas-webgl');
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
  alpha: true,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
const clock = new THREE.Clock();
const stats = new Stats();

const images = [
  'img/osaka01.jpg',
  'img/osaka02.jpg',
  'img/osaka03.jpg',
  'img/osaka04.jpg',
  'img/osaka05.jpg',
];
const dissolve = new Dissolve(images);

const resizeWindow = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  dissolve.resize();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
const setEvent = () => {
  $(window).on('resize', () => {
    resizeWindow();
  });
}
const initDatGui = () => {
  const gui = new dat.GUI();
  const controller = {
    time: gui.add(dissolve, 'interval', 1, 10).name('interval').step(1),
    noiseX: gui.add(dissolve.noise, 'x', 0, 100).name('noise x'),
    noiseY: gui.add(dissolve.noise, 'y', 0, 100).name('noise y'),
    noiseZ: gui.add(dissolve.noise, 'z', 0, 100).name('noise z'),
    prevEdgeStart: gui.add(dissolve.edge, 'prev_start', 0, 0.1).name('prev edge start').step(0.001),
    prevEdgeWidth: gui.add(dissolve.edge, 'prev_width', 0, 0.1).name('prev edge width').step(0.001),
    nextEdgeStart: gui.add(dissolve.edge, 'next_start', 0, 0.1).name('next edge start').step(0.001),
    nextEdgeWidth: gui.add(dissolve.edge, 'next_width', 0, 0.1).name('next edge width').step(0.001),
    stop: gui.add(dissolve, 'stop').name('stop animation'),
  }
  controller.time.onChange((value) => {
    dissolve.uniforms.interval.value = value;
  });
  controller.noiseX.onChange((value) => {
    dissolve.uniforms.noiseX.value = value;
  });
  controller.noiseY.onChange((value) => {
    dissolve.uniforms.noiseY.value = value;
  });
  controller.noiseZ.onChange((value) => {
    dissolve.uniforms.noiseZ.value = value;
  });
  controller.prevEdgeStart.onChange((value) => {
    dissolve.uniforms.prevEdgeStart.value = value;
  });
  controller.prevEdgeWidth.onChange((value) => {
    dissolve.uniforms.prevEdgeWidth.value = value;
  });
  controller.nextEdgeStart.onChange((value) => {
    dissolve.uniforms.nextEdgeStart.value = value;
  });
  controller.nextEdgeWidth.onChange((value) => {
    dissolve.uniforms.nextEdgeWidth.value = value;
  });
}
const initStats = () => {
  stats.showPanel(0);
  document.body.appendChild(stats.dom);
}
const render = () => {
  dissolve.render(clock.getDelta());
  renderer.render(scene, camera);
}
const renderLoop = () => {
  stats.begin();
  render();
  stats.end();
  requestAnimationFrame(renderLoop);
}

const init = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 0.0);

  dissolve.loadTexture(images, () => {
    setTimeout(() => {
      $('.p-preloader').addClass('is-hidden').on('transitionend', function() {
        $(this).addClass('is-stoped');
      });
      scene.add(dissolve.mesh);
      setEvent();
      initDatGui();
      initStats();
      resizeWindow();
      renderLoop();
    }, 200);
  });
}
init();
