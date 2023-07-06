console.log(`                                                       
                                                 
         "      m      "                        
mmmm   mmm    mm#mm  mmm     mmm    mmm   m mm  
#" "#    #      #      #    #"  "  #" "#  #"  # 
#   #    #      #      #    #      #   #  #   # 
"#m"#  mm#mm    mm  mm#mm   "#mm"  "#m#"  #   #   -By SK027
    #                                           
 m""                                            

`);
/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Imports
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
import './styles/style.css';
import * as THREE from 'three';
import map from './textures/map.png';
import star from './textures/1.jpg';
import './Clipboard.js'
/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Check mobile phone
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
const mobile = window.matchMedia("(max-width: 480px)").matches;
/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Canvas
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
const canvas = document.querySelector('canvas.webgl');

/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Scene
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
const scene = new THREE.Scene();

/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Cursor
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
const sizes = {
        width: window.innerWidth,
        height: window.innerHeight
};

let cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
        cursor.x = event.clientX / sizes.width - 0.5
        cursor.y = event.clientY / sizes.height - 0.5
})


/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Light
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
let light1 = new THREE.PointLight(0x3a228a, 0.75);
light1.position.set(-150, 150, -50);

let light2 = new THREE.PointLight(0x4f67ff, 0.75);
light2.position.set(-400, 200, 150);

let light3 = new THREE.PointLight(0x7444ff, 1);
light3.position.set(100, 250, -100);

scene.add(light1, light2, light3);


/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Globe
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
const atmosphereShader = {
        'atmosphere': {
                uniforms: {},
                vertexShader: [
                        'varying vec3 vNormal;',
                        'void main() {',
                        'vNormal = normalize( normalMatrix * normal );',
                        'gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
                        '}'
                ].join('\n'),
                fragmentShader: [
                        'varying vec3 vNormal;',
                        'void main() {',
                        'float intensity = pow( 0.99 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 6.0 );',
                        'gl_FragColor = vec4( .28, .48, 1.0, 1.0 ) * intensity;',
                        '}'
                ].join('\n')
        }
}
const atmosphereGeometry = new THREE.SphereGeometry(2, 64, 64);
const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.clone(atmosphereShader['atmosphere'].uniforms),
        vertexShader: atmosphereShader['atmosphere'].vertexShader,
        fragmentShader: atmosphereShader['atmosphere'].fragmentShader,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
});
const atm = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
atm.scale.set(1.05, 1.05, 1.05);
scene.add(atm);

const sphereGeometry = new THREE.SphereGeometry(2, 64, 64);
const sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
sphere.receiveShadow = true;
sphere.rotation.set(0.4, Math.PI, 0);
scene.add(sphere);

atm.position.set(2.38, 2.1, 0);
sphere.position.set(2, 1.8, 0);
const earth = new THREE.TextureLoader().load(map);

//setup map overlay
const overlayMaterial = new THREE.MeshBasicMaterial({
        map: earth,
        transparent: true
});

const overlaySphereGeometry = new THREE.SphereGeometry(2, 64, 64);
const overlaySphere = new THREE.Mesh(overlaySphereGeometry, overlayMaterial);
overlaySphere.castShadow = true;
overlaySphere.receiveShadow = true;
sphere.add(overlaySphere);


/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Curves
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/

let numPoints = 100;
let start = new THREE.Vector3(0, 1.5, 1.3);
let middle = new THREE.Vector3(.6, .6, 3.2);
let end = new THREE.Vector3(1.5, -1, .8);

let curveQuad = new THREE.QuadraticBezierCurve3(start, middle, end);
/**
 * Curve 1
 */
let tube1 = new THREE.TubeGeometry(curveQuad, numPoints, 0.006, 20, false);
const tubeMaterial = new THREE.MeshBasicMaterial({
        color: 0xd965fa
});
tube1.setDrawRange(0, 10000);
let curveMesh1 = new THREE.Mesh(tube1, tubeMaterial);
sphere.add(curveMesh1);
/**
 * Curve 2
 */
let tube2 = new THREE.TubeGeometry(curveQuad, numPoints, 0.006, 20, false);
tube2.setDrawRange(0, 10000);
let curveMesh2 = new THREE.Mesh(tube2, tubeMaterial);
sphere.add(curveMesh2);
curveMesh2.rotation.y = .75
curveMesh2.rotation.z = .75
curveMesh2.rotation.x = -.1
/**
 * Curve 3
 */
let tube3 = new THREE.TubeGeometry(curveQuad, numPoints, 0.006, 20, false);
tube3.setDrawRange(0, 10000);
let curveMesh3 = new THREE.Mesh(tube3, tubeMaterial);
sphere.add(curveMesh3);
curveMesh3.rotation.y = 2.1
curveMesh3.rotation.z = .5
curveMesh3.rotation.x = .2
/**
 * Curve 4
 */
let tube4 = new THREE.TubeGeometry(curveQuad, numPoints, 0.006, 20, false);
tube4.setDrawRange(0, 10000);
let curveMesh4 = new THREE.Mesh(tube4, tubeMaterial);
sphere.add(curveMesh4);
curveMesh4.rotation.y = 2.3
curveMesh4.rotation.z = .8
curveMesh4.rotation.x = .2

/**
 * Curve 5
 */
let tube5 = new THREE.TubeGeometry(curveQuad, numPoints, 0.006, 20, false);
tube5.setDrawRange(0, 10000);
let curveMesh5 = new THREE.Mesh(tube5, tubeMaterial);
sphere.add(curveMesh5);
curveMesh5.rotation.y = 2.9
curveMesh5.rotation.z = 1.1
curveMesh5.rotation.x = 2

/**
 * Curve 6
 */
let tube6 = new THREE.TubeGeometry(curveQuad, numPoints, 0.006, 20, false);
tube6.setDrawRange(0, 10000);
let curveMesh6 = new THREE.Mesh(tube6, tubeMaterial);
sphere.add(curveMesh6);
curveMesh6.rotation.y = 7.1
curveMesh6.rotation.z = 1
curveMesh6.rotation.x = 4.4

/**
 * Curve 7
 */
let tube7 = new THREE.TubeGeometry(curveQuad, numPoints, 0.006, 20, false);
tube7.setDrawRange(0, 10000);
let curveMesh7 = new THREE.Mesh(tube7, tubeMaterial);
sphere.add(curveMesh7);
curveMesh7.rotation.y = 2.1
curveMesh7.rotation.z = 3
curveMesh7.rotation.x = 4.4

/**
 * Curve 8
 */
let tube8 = new THREE.TubeGeometry(curveQuad, numPoints, 0.006, 20, false);
tube8.setDrawRange(0, 10000);
let curveMesh8 = new THREE.Mesh(tube8, tubeMaterial);
sphere.add(curveMesh8);
curveMesh8.rotation.y = 2.5
curveMesh8.rotation.z = 1
curveMesh8.rotation.x = 1.1
/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
       Particles
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
// const objectsDistance = 4
const particlesCount = 1000
const positions = new Float32Array(particlesCount * 3)
let num = 0;
for (let i = 0; i < particlesCount; i++) {
        positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = 4 - (Math.random()) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
        num = Math.ceil(Math.random() * 4);
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// Material
let particlesize = 0.1
const pointTexture = new THREE.TextureLoader().load(star);
const particlesMaterial = new THREE.PointsMaterial({
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        map: pointTexture,
        size: particlesize
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Resizing
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
window.addEventListener('resize', () => {
        // Update sizes
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;

        // Update camera
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();

        // Update renderer
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})


/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Cameras
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 6;
if (mobile) {
        camera.position.z = 7;
}

scene.add(camera);

/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Renderer
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true
});
renderer.setSize(sizes.width, sizes.height);

/*
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
        Animation Frame
=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*= 
*/
let renderCount = 0;
let currentGrowing = 0;
let tubes = [tube1, tube2, tube3, tube4, tube5, tube6, tube7, tube8]


function GrowTube(index, renderCount) {
        renderCount = Math.ceil(renderCount / 3) * 3
        tubes[index].setDrawRange(0, renderCount)
        if (index > 2) {
                tubes[index - 3].setDrawRange(renderCount, 10000)
        }
        else {
                tubes[(tubes.length - 3) + index].setDrawRange(renderCount, 10000)
        }
}
const clock = new THREE.Clock();
let previousTime = 0;
const tick = () => {
        const elapsedTime = clock.getElapsedTime();
        const deltaTime = elapsedTime - previousTime;
        previousTime = elapsedTime;

        // Animate particles
        particles.rotation.y += deltaTime * 0.1;

        // Animate Globe
        sphere.rotation.y += 0.002;

        // Animate curves
        if (renderCount < 10000) {
                renderCount += 80;
                GrowTube(currentGrowing, renderCount);
        } else {
                renderCount = 0;

                if (currentGrowing >= tubes.length - 1) {
                        currentGrowing = 0;
                } else {
                        currentGrowing++;
                }
        }

        // Animate Camera parallax
        const parallaxX = cursor.x * 0.5;
        const parallaxY = - cursor.y * 0.5;

        camera.position.x += (parallaxX - camera.position.x) * 5 * deltaTime;
        camera.position.y += (parallaxY - camera.position.y) * 5 * deltaTime;


        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
}
tick();