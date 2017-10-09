// Shaders
var vertShader = document.querySelector('#vertexshader').innerHTML;
var fragShader = document.querySelector('#fragmentshader').innerHTML;

// Renderer
var renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('main'),
    antialiasing: true
});
renderer.setClearColor(0x000000);
renderer.setSize(window.innerWidth, window.innerHeight);

// Camera
var camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 5000);
camera.position.z = 200;

// Scene
var scene = new THREE.Scene();

// Light
var light = new THREE.DirectionalLight(0xffffff, 0.6);
light.position.z = 200;
light.position.x = 100;
light.position.y = 100;
scene.add(light);

var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Shader Materials
const uniforms = THREE.UniformsUtils.merge([
    THREE.UniformsLib["ambient"],
    THREE.UniformsLib["lights"], {
        time: {
            type: "f",
            value: 0
        }
    },
    THREE.ShaderLib.phong.uniforms
]);

var material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertShader,
    fragmentShader: fragShader,
    lights: true
});

var geometry = new THREE.SphereGeometry(20, 150, 150);
var planet = new THREE.Mesh(geometry, material);
scene.add(planet);
planet.position.x = 0;
planet.position.y = 0;
planet.position.z = 0;
planet.modifier = Math.random();
planet.material.transparent = true;
planet.material.opacity = 1 * Math.random();

// Render
var start = Date.now();

function render() {
    uniforms.time.value = .00005 * (Date.now() - start);

    planet.rotation.y += 0.002;
    planet.rotation.z += 0.003;
    planet.rotation.x += 0.001;

    camera.position.z = 52;

    renderer.render(scene, camera);
    window.requestAnimationFrame(render);
}

window.requestAnimationFrame(render);