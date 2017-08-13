// 避免小黑框
// $(window).on('scroll.elasticity', (e) => {
//     e.preventDefault();
// }).on('touchmove.elasticity', (e) => {
//     e.preventDefault();
// });

import positionOfBalls from './conf/balls.js'

import { RAF, CRAF } from './utils/index.js'

const { PI, cos, sin, random } = Math

if ( !Detector.webgl ) Detector.addGetWebGLMessage()

let stats
let container, camera, scene, renderer
let timer = null
let angleX = PI / 100,
    angleY = PI / 100;

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );

    camera.position.y = 400;
    scene = new THREE.Scene();
    let light, object;

    // 开灯 亮度
    scene.add( new THREE.AmbientLight( 0x404040 ) );
    light = new THREE.DirectionalLight( 0xffffff );
    // 应该就是从y轴看
    light.position.set( 0, 1, 0 );
    scene.add( light );

    positionOfBalls.forEach((value, index) => {
        let map = new THREE.TextureLoader().load( value.pic );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        let material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );

        object = new THREE.Mesh( new THREE.SphereGeometry( 15, 75, 75 ), material );
        // 左右, 上下, 斜的？？？？
        object.position.set( value.pos[0], value.pos[1], value.pos[2] );
        object.name = 'llp' + value.pic;
        scene.add( object );
    })

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.setClearColor(0xffffff, 0)

    container.appendChild( renderer.domElement );
    stats = new Stats();
    container.appendChild( stats.dom );
    //
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function animate() {
    timer = RAF(animate)
    stats.update()
    moveBody()
    render()
}

var test = 1;

const cameraPos = {
    x: 300,
    y: 400,
    z: 300
}
const startPos = {
    x: 0,
    y: 0
}
let cameraRotate = 0;
// http://www.cnblogs.com/v-weiwang/p/6072235.html
function render() {
    let rotate = 0.00
    camera.position.x = cameraPos.x
    camera.position.y = cameraPos.y
    camera.position.z = cameraPos.z
    camera.lookAt({ x:0, y:0, z:0 })

    for ( let i = 0, l = scene.children.length; i < l; i ++ ) {
        let object = scene.children[ i ]
        // 自旋
        object.rotation.x += rotate
        object.rotation.y += rotate
        object.rotation.z += rotate

        // 公转
        // object.position.set( object.position.x, object.position.y, object.position.z+1 );
    }

    if (test < 20) {
        test++;
        // console.log(scene.children[2].rotation.x)
    }
    renderer.render( scene, camera )
}

function moveBody(rotation = { clientX: 0, clientY: 0 }) {
    // cameraPos.y = 

    cameraRotate -= 0.002
    cameraPos.x = 300 * cos(cameraRotate)
    cameraPos.z = 300 * sin(cameraRotate)
    
    // console.log(camera.position.x)
    renderer.render( scene, camera )
}

window.addEventListener('touchstart', e => {
    // CRAF(timer)
    let { clientX, clientY } = e.changedTouches[0]
    if (clientX < 0 || clientY < 0 || clientX > window.innerWidth || clientY > window.innerHeight) {
        return;
    }
    startPos.x = clientX;
    startPos.y = clientY;
})
window.addEventListener('touchend', e => {
    // timer = RAF(animate)
})

window.addEventListener('touchmove', e => {
    let { clientX, clientY } = e.changedTouches[0]
    if (clientX < 0 || clientY < 0 || clientX > window.innerWidth || clientY > window.innerHeight) {
        return;
    }

    clientX -= startPos.x
    clientY -= startPos.y
    console.log(clientX, clientY)

    moveBody({ clientX, clientY });

})
// function render() {
//     let timer = Date.now() * 0.0001;
//     camera.position.x = Math.cos( timer ) * 800;
//     camera.position.z = Math.sin( timer ) * 800;
//     camera.lookAt( scene.position );
//     for ( let i = 0, l = scene.children.length; i < l; i ++ ) {
//         let object = scene.children[ i ];
//         object.rotation.x = timer * 5;
//         object.rotation.y = timer * 2.5;
//     }
//     renderer.render( scene, camera );
// }

init();
animate();

export default 'llp'

