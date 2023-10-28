//Cette ligne nous permet d'importer Three.js, présent dans le dossier node_modules
import * as THREE from "three";
//Cette ligne importe les controles 'OrbitControls' de three.js (elle n'est pas présente directement dans three.js)
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
//Cette ligne importe la librairie lil-gui qui permet de d'implémenter facilement une interface de debug
import * as dat from "lil-gui";

//On modifie certains paramètres par défaut de Three.js
THREE.ColorManagement.enabled = false;

/**
 * Debug
 * On initialise l'interface de debug
 */
const gui = new dat.GUI();

/**
 * Base
 * On fait le lien avec la balise canvas de notre fichier index.html
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// On créé la scène Three.js
const scene = new THREE.Scene();

/**
 * Textures
 * On charge les textures d'environnement
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
sphere.castShadow = true;
sphere.position.y = 3;
scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

//Nous ajoutons une lumière directionnel qui projetera des ombres
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Taille de notre fenêtre
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

//Permet de redimensionner notre application quand la taille de la fenêtre du navigateur
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
//Caméra basique
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controles de la caméra
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animation
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // On met à jour les controles
  controls.update();

  // On fait le rendu de la scène
  renderer.render(scene, camera);

  // On boucle sur la même fonction
  window.requestAnimationFrame(tick);
};

tick();
