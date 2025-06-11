import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


//planets and star textures
import starsTexture from './img/stars.jpg';
import sunTexture from './img/sun.jpg';
import mercuryTexture from './img/mercury.jpg';
import venusTexture from './img/venus.jpg';
import earthTexture from './img/earth.jpg';
import marsTexture from './img/mars.jpg';
import jupiterTexture from './img/jupiter.jpg';
import saturnTexture from './img/saturn.jpg';
import saturnRingTexture from './img/saturn ring.png';
import uranusTexture from './img/uranus.jpg';
import uranusRingTexture from './img/uranus ring.png';
import neptuneTexture from './img/neptune.jpg';

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90,140,140);

orbit.update();


//light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xFFFFFF, 20000, 300);
scene.add(sunLight);



//star background
const cubeTextureLoader = new THREE.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture,
    starsTexture
]);


//Texture of planets creation
const textureLoader = new THREE.TextureLoader();



//create sun structure
const sunGeo = new THREE.SphereGeometry(30,30,30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load(sunTexture)
});
const sun = new THREE.Mesh(sunGeo,sunMat);
scene.add(sun);


const controlPanel = document.getElementById('control-panel');

//planets Data 
const planetData = [
    {name: 'Mercury', size: 3.2, texture: mercuryTexture, position: 40, axialSpeed: 0.005, orbitalSpeed: 0.048},
    {name: 'Venus', size: 5.8, texture: venusTexture, position: 55, axialSpeed: 0.003, orbitalSpeed: 0.035},
    {name: 'Earth', size: 6, texture: earthTexture, position: 74, axialSpeed: 0.01, orbitalSpeed: 0.03},
    {name: 'Mars', size: 4, texture: marsTexture, position: 91, axialSpeed: 0.009, orbitalSpeed: 0.024},
    {name: 'Jupiter', size: 16, texture: jupiterTexture, position: 116, axialSpeed: 0.02, orbitalSpeed: 0.013},
    {name: 'Saturn', size: 12, texture: saturnTexture, position: 165, axialSpeed: 0.018, orbitalSpeed: 0.009, ring:{innerRadius: 18, outerRadius: 28, texture: saturnRingTexture}},
    {name: 'Uranus', size: 7, texture: uranusTexture, position: 213, axialSpeed:0.007, orbitalSpeed: 0.007, ring:{innerRadius: 9, outerRadius: 10, texture: uranusRingTexture}},
    {name: 'Neptune', size: 7, texture: neptuneTexture, position: 242, axialSpeed:0.006, orbitalSpeed: 0.005},
    
];

//planet structure array and speed control array
const planets = [];


//create planet structure function
function createPlanets(size, texture, position, ring){
    
const geo = new THREE.SphereGeometry(size,30,30);
const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture)
});
const mesh = new THREE.Mesh(geo,mat);
const obj= new THREE.Object3D();
obj.add(mesh);

// plantes with ring structure 
if(ring) {
    const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius,32);
    const ringMat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(ring.texture),
    side: THREE.DoubleSide
});

const ringMesh = new THREE.Mesh(ringGeo,ringMat);
obj.add(ringMesh);
ringMesh.position.x = position;
ringMesh.rotation.x = -0.57* Math.PI;
}

//orbit line creation 
const orbitGeo = new THREE.TorusGeometry(position, 0.1, 3, 64);
const orbitMat = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.1 });
const orbitLine = new THREE.Mesh(orbitGeo, orbitMat);
orbitLine.rotation.x = Math.PI / 2;
scene.add(orbitLine);

scene.add(obj);
mesh.position.x = position;
return {mesh, obj};

}



planetData.forEach(data =>{
    
    //storing planet structure data and speed of planets
        const pData = createPlanets(data.size, data.texture, data.position, data.ring);
        planets.push({
            name: data.name,
            mesh: pData.mesh,
            obj: pData.obj,
            speedMultiplier: 1,
            axialSpeed: data.axialSpeed,
            orbitalSpeed: data.orbitalSpeed

        });

        //creating planets speed multiplier controls
        const planetControlDiv = document.createElement('div');
        planetControlDiv.className = 'planet-control';
        planetControlDiv.innerHTML = `
                        <label for="${data.name.toLowerCase()}-speed">${data.name} :</label>
                        <input type="range" id="${data.name.toLowerCase()}-speed" min="0" max="10" step="1" value="1">
                        <span class="speed-value" id="${data.name.toLowerCase()}-speed-value"> 1 </span>
                    `;
        controlPanel.appendChild(planetControlDiv);
        

        //event listener for controls
        const slider = document.getElementById(`${data.name.toLowerCase()}-speed`);
                    const speedValueSpan = document.getElementById(`${data.name.toLowerCase()}-speed-value`);
                    slider.oninput = (event) => {
                        const newSpeed = parseFloat(event.target.value);
                        const planetToUpdate = planets.find(p => p.name === data.name);
                        if(planetToUpdate){
                        planetToUpdate.speedMultiplier = newSpeed; // Update orbital speed
                        speedValueSpan.textContent = newSpeed; // Update displayed value
                        }
                    };


        });

const clock =  new THREE.Clock();
 
//pause and resume animation button
let isPlaying = true;
document.getElementById('pause-resume-button').addEventListener('click', pauseResumeAnimation);
function pauseResumeAnimation() {
        isPlaying = !isPlaying;
}

//animation
function animate() {
       const deltaTime = clock.getDelta();

if(isPlaying){

    sun.rotation.y += 0.05 * deltaTime; // sun rotation on axis
    
    planets.forEach(planet =>{
        planet.mesh.rotation.y += (planet.axialSpeed * deltaTime * 10); //axis rotation
        planet.obj.rotation.y += (planet.orbitalSpeed * deltaTime * 10) * planet.speedMultiplier; //orbit rotation

    });    
}       
renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

window.addEventListener('resize',function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});









