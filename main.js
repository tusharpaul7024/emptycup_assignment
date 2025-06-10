import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import *  as dat from 'dat.gui';

//images



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


//star background
renderer.setClearColor(0x000010);



//create sun structure
const sunGeo = new THREE.SphereGeometry(16,30,30);
const sunMat = new THREE.MeshBasicMaterial({
    color : 0xFFFF00
});
const sun = new THREE.Mesh(sunGeo,sunMat);
scene.add(sun);


//create planet structure
function createPlanets(size, colors, position, ring){
const geo = new THREE.SphereGeometry(size,30,30);
const mat = new THREE.MeshBasicMaterial({
    color : colors
});
const mesh = new THREE.Mesh(geo,mat);
const obj= new THREE.Object3D();
obj.add(mesh);

if(ring) {
    const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius,32);
    const ringMat = new THREE.MeshBasicMaterial({
    color : ring.color,
    side: THREE.DoubleSide
});
const ringMesh = new THREE.Mesh(ringGeo,ringMat);
obj.add(ringMesh);
ringMesh.position.x = position;
ringMesh.rotation.x = -0.5 * Math.PI;
}

scene.add(obj);
mesh.position.x = position;

return {mesh, obj};
}

const mercury =  createPlanets(3.2, 0xFDDA0D, 28);
const venus =  createPlanets(5.8, 0xFAD5A5, 44);
const earth =  createPlanets(6, 0x93C572, 62);
const mars =  createPlanets(4, 0xFF5733 , 78);
const jupiter =  createPlanets(12, 0xF3E5AB , 100);
const saturn = createPlanets(14, 0xE49B0F, 138,{
    innerRadius: 20,
    outerRadius: 30,
    color: 0xE49B0A
});
const uranus = createPlanets(7, 0x8db3ca, 176,{
    innerRadius: 7,
    outerRadius: 12,
    color: 0xFFF8DC
});
const neptune =  createPlanets(7, 0x33b3ff , 200);


//saturn ring


//animation
function animate() {
    sun.rotateY(0.004);

    //self rotation
    mercury.mesh.rotateY(0.004);
    venus.mesh.rotateY(0.002);
    earth.mesh.rotateY(0.02);
    mars.mesh.rotateY(0.018);
    jupiter.mesh.rotateY(0.04);
    saturn.mesh.rotateY(0.038);
    uranus.mesh.rotateY(0.03);
    neptune.mesh.rotateY(0.032);

    //revolve around sun
    mercury.obj.rotateY(0.02);
    venus.obj.rotateY(0.012);
    earth.obj.rotateY(0.01);
    mars.obj.rotateY(0.008);
    jupiter.obj.rotateY(0.002);
    saturn.obj.rotateY(0.0009);
    uranus.obj.rotateY(0.0004);
    neptune.obj.rotateY(0.0001);



    renderer.render(scene, camera);
}


renderer.setAnimationLoop(animate);

window.addEventListener('resize',function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});









