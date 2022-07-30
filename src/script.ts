import './style.css';
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';


// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ color: 0xF00FFf, wireframe: true });
const mesh = new THREE.Mesh(geometry, material);


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xFF3613, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 10;
directionalLight.shadow.camera.left = - 7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = - 7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/*const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)
*/
scene.add(mesh);

let earth : THREE.Object3D | null = null;

/**
 * Models
 */
const gltfLoader = new GLTFLoader();
gltfLoader.load(
    './models/earth/scene.gltf',
    (gltf) =>
    {
        console.log('success')
        let earth = gltf.scene.children[0];
        earth.scale.set(0.5, 0.5, 0.5)
        scene.add(earth)
        tick(earth);
    },
    (progress) =>
    {
        console.log('progress')
        console.log(progress)
    },
    (error) =>
    {
        console.log('error')
        console.log(error)
    }
)

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// Axe Helper
//const axesHelper = new THREE.AxesHelper(2);
//scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(2, 2, 5)
scene.add(camera)


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('canvas.webgl')
});
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
//controls.target.set(0, 0.75, 0)
//controls.enableDamping = true

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

function tick(earth: any)
{
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;

    ambientLight.intensity = 0.9 * Math.abs(3.5*Math.sin(elapsedTime)) + 1.5;
    previousTime = elapsedTime;
    
    mesh.rotation.y += 0.001;
    earth.rotation.z -= 0.001;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(()=> tick(earth))
}

window.onload = () => {
    //tick();
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})

window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement;
    const canvas = document.querySelector('canvas.webgl');

    if(!canvas) {
        return;
    }

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        
    }
})