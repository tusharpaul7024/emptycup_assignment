import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import *  as dat from 'dat.gui';





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




camera.position.set(-10,30,30);

orbit.update();





  

    renderer.render(scene, camera);







